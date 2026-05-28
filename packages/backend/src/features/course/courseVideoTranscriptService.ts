import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { spawn } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { Readable } from 'node:stream';
import { env } from '../../env';
import { Prisma } from '../../prisma/generated/client';
// bypass-RLS: transcript workers run outside a request context and operate on
// course marketplace rows, which are not organization-scoped.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS as prisma } from '../../prisma';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { errorToLogMetadata, logger } from '../../shared/lib/logger';
import type { CourseVideoTranscriptJobData } from './courseVideoTranscriptJobSchemas';

const AUDIO_SEGMENT_SECONDS = 600;
const MAX_OPENAI_AUDIO_BYTES = 24 * 1024 * 1024;
const MAX_TRANSCRIPT_CHARS = 240_000;

type ExistingLessonTranscriptState = {
  id: string;
  videoFiles: Prisma.JsonValue | null;
  videoTranscriptStatus: string;
  videoTranscriptSourceKey: string | null;
};

type CourseVideoTranscriptSyncData = {
  videoTranscriptText?: string | null;
  videoTranscriptStatus?: string;
  videoTranscriptSourceKey?: string | null;
  videoTranscriptError?: string | null;
  videoTranscriptGeneratedAt?: Date | null;
};

function createS3Client() {
  return new S3Client({
    region: env.S3_REGION || 'us-east-1',
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: env.S3_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: env.S3_ENDPOINT ? true : false,
  });
}

export function courseLessonVideoSourceKey(videoFiles: unknown) {
  const files = Array.isArray(videoFiles) ? videoFiles : [];
  const first = files[0];
  if (!first || typeof first !== 'object') {
    return null;
  }

  const key = (first as Record<string, unknown>).key;
  return typeof key === 'string' && key.trim() ? key : null;
}

export function courseVideoTranscriptSyncData(
  videoFiles: unknown,
  previous?: ExistingLessonTranscriptState,
): CourseVideoTranscriptSyncData {
  const sourceKey = courseLessonVideoSourceKey(videoFiles);
  if (!sourceKey) {
    return {
      videoTranscriptText: null,
      videoTranscriptStatus: 'notRequested',
      videoTranscriptSourceKey: null,
      videoTranscriptError: null,
      videoTranscriptGeneratedAt: null,
    };
  }

  const previousSourceKey =
    previous?.videoTranscriptSourceKey ||
    courseLessonVideoSourceKey(previous?.videoFiles);
  const shouldQueue =
    sourceKey !== previousSourceKey ||
    (previous?.videoTranscriptStatus === 'notRequested' &&
      !previous.videoTranscriptSourceKey);

  if (!shouldQueue) {
    return {};
  }

  return {
    videoTranscriptText: null,
    videoTranscriptStatus: 'queued',
    videoTranscriptSourceKey: sourceKey,
    videoTranscriptError: null,
    videoTranscriptGeneratedAt: null,
  };
}

export async function runCourseVideoTranscriptJob(
  data: CourseVideoTranscriptJobData,
) {
  if (data.kind !== 'transcribe') {
    logger.warn('course.video_transcript.unknown_job_kind', {
      kind: (data as any).kind,
    });
    return;
  }

  const lesson = await prisma.courseLesson.findUnique({
    where: { id: data.lessonId },
    include: { course: { select: { title: true } } },
  });
  if (!lesson) {
    logger.info('course.video_transcript.skipped', {
      lessonId: data.lessonId,
      reason: 'missing_lesson',
    });
    return;
  }

  const currentSourceKey = courseLessonVideoSourceKey(lesson.videoFiles);
  if (!currentSourceKey || currentSourceKey !== data.sourceKey) {
    logger.info('course.video_transcript.skipped', {
      lessonId: lesson.id,
      reason: 'source_changed',
      sourceKey: data.sourceKey,
      currentSourceKey,
    });
    return;
  }

  const claim = await prisma.courseLesson.updateMany({
    where: {
      id: lesson.id,
      videoTranscriptStatus: 'queued',
      videoTranscriptSourceKey: data.sourceKey,
    },
    data: {
      videoTranscriptStatus: 'processing',
      videoTranscriptError: null,
    },
  });
  if (claim.count === 0) {
    logger.info('course.video_transcript.skipped', {
      lessonId: lesson.id,
      reason: 'not_queued',
      status: lesson.videoTranscriptStatus,
    });
    return;
  }

  try {
    const transcript = await transcribeVideoFromS3({
      sourceKey: data.sourceKey,
      prompt: `${lesson.course.title}. ${lesson.title}.`,
    });
    const updated = await prisma.courseLesson.update({
      where: { id: lesson.id },
      data: {
        videoTranscriptText: transcript.slice(0, MAX_TRANSCRIPT_CHARS),
        videoTranscriptStatus: 'ready',
        videoTranscriptError: null,
        videoTranscriptGeneratedAt: new Date(),
      },
    });

    await auditLogCreate({
      entityId: lesson.id,
      entityName: 'CourseLesson',
      operation: auditLogOperations.update,
      organizationId: null,
      userId: null,
      oldData: {
        videoTranscriptStatus: lesson.videoTranscriptStatus,
        videoTranscriptSourceKey: lesson.videoTranscriptSourceKey,
      },
      newData: {
        videoTranscriptStatus: updated.videoTranscriptStatus,
        videoTranscriptSourceKey: updated.videoTranscriptSourceKey,
        videoTranscriptGeneratedAt: updated.videoTranscriptGeneratedAt,
      },
    });

    logger.info('course.video_transcript.completed', {
      lessonId: lesson.id,
      sourceKey: data.sourceKey,
      transcriptChars: transcript.length,
    });
  } catch (error: any) {
    const errorCode = courseVideoTranscriptErrorCode(error);
    const failed = await prisma.courseLesson.update({
      where: { id: lesson.id },
      data: {
        videoTranscriptStatus: 'failed',
        videoTranscriptError: errorCode,
      },
    });

    await auditLogCreate({
      entityId: lesson.id,
      entityName: 'CourseLesson',
      operation: auditLogOperations.update,
      organizationId: null,
      userId: null,
      oldData: {
        videoTranscriptStatus: lesson.videoTranscriptStatus,
        videoTranscriptSourceKey: lesson.videoTranscriptSourceKey,
      },
      newData: {
        videoTranscriptStatus: failed.videoTranscriptStatus,
        videoTranscriptSourceKey: failed.videoTranscriptSourceKey,
        videoTranscriptError: failed.videoTranscriptError,
      },
    });

    logger.error('course.video_transcript.failed', {
      lessonId: lesson.id,
      sourceKey: data.sourceKey,
      errorCode,
      error: errorToLogMetadata(error),
    });
  }
}

async function transcribeVideoFromS3(input: {
  sourceKey: string;
  prompt: string;
}) {
  if (!env.OPENAI_API_KEY) {
    throw new Error('openAiNotConfigured');
  }
  if (!env.S3_BUCKET_PRIVATE) {
    throw new Error('s3NotConfigured');
  }

  const workDir = await mkdtemp(join(tmpdir(), 'nexexam-transcript-'));
  try {
    const sourceBuffer = await downloadPrivateObject(input.sourceKey);
    const extension = extname(input.sourceKey).slice(0, 12) || '.mp4';
    const sourcePath = join(workDir, `source${extension}`);
    await writeFile(sourcePath, sourceBuffer);

    await runFfmpeg([
      '-y',
      '-i',
      sourcePath,
      '-vn',
      '-ac',
      '1',
      '-ar',
      '16000',
      '-b:a',
      '48k',
      '-f',
      'segment',
      '-segment_time',
      String(AUDIO_SEGMENT_SECONDS),
      '-reset_timestamps',
      '1',
      join(workDir, 'chunk-%03d.mp3'),
    ]);

    const chunkNames = (await readdir(workDir))
      .filter((name) => name.startsWith('chunk-') && name.endsWith('.mp3'))
      .sort();
    if (!chunkNames.length) {
      throw new Error('noAudioSegments');
    }

    const parts: string[] = [];
    for (const chunkName of chunkNames) {
      const chunk = await readFile(join(workDir, chunkName));
      if (chunk.byteLength > MAX_OPENAI_AUDIO_BYTES) {
        throw new Error('audioSegmentTooLarge');
      }
      parts.push(await transcribeAudioChunk(chunk, chunkName, input.prompt));
    }

    return parts
      .map((part) => part.trim())
      .filter(Boolean)
      .join('\n\n');
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

async function downloadPrivateObject(key: string) {
  const response = await createS3Client().send(
    new GetObjectCommand({
      Bucket: env.S3_BUCKET_PRIVATE,
      Key: key,
    }),
  );
  return await bodyToBuffer(response.Body);
}

async function bodyToBuffer(body: unknown): Promise<Buffer> {
  if (!body) {
    return Buffer.alloc(0);
  }
  if (body instanceof Uint8Array) {
    return Buffer.from(body);
  }
  if (
    typeof body === 'object' &&
    'transformToByteArray' in body &&
    typeof (body as any).transformToByteArray === 'function'
  ) {
    return Buffer.from(await (body as any).transformToByteArray());
  }
  if (body instanceof Readable) {
    const chunks: Buffer[] = [];
    for await (const chunk of body) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
  throw new Error('Unsupported S3 body type.');
}

function runFfmpeg(args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(env.FFMPEG_PATH, args, {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk).slice(0, 4000);
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr || `ffmpeg exited with code ${code}`));
      }
    });
  });
}

async function transcribeAudioChunk(
  chunk: Buffer,
  filename: string,
  prompt: string,
) {
  const form = new FormData();
  form.append(
    'file',
    new Blob([new Uint8Array(chunk)], { type: 'audio/mpeg' }),
    filename,
  );
  form.append('model', env.OPENAI_TRANSCRIBE_MODEL);
  form.append('response_format', 'text');
  form.append('prompt', prompt);

  const response = await fetch(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: form,
    },
  );
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`openAiTranscriptionFailed:${response.status}:${text}`);
  }
  return text;
}

function courseVideoTranscriptErrorCode(error: any) {
  const message = String(error?.message || error || '');
  if (message === 'openAiNotConfigured') {
    return 'openAiNotConfigured';
  }
  if (message === 's3NotConfigured') {
    return 's3NotConfigured';
  }
  if (message.includes('ffmpeg') || message.includes('noAudioSegments')) {
    return 'audioExtractionFailed';
  }
  if (message.includes('openAiTranscriptionFailed')) {
    return 'transcriptionProviderFailed';
  }
  if (message.includes('audioSegmentTooLarge')) {
    return 'audioSegmentTooLarge';
  }
  return 'transcriptionFailed';
}
