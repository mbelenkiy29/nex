import { Prisma } from '../../prisma/generated/client';
// bypass-RLS: workers run outside an HTTP request and do not have the
// AsyncLocalStorage request context required by the RLS client.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS as prisma } from '../../prisma';
import { auditLogCreate } from '../auditLog/auditLogCreate';
import { auditLogOperations } from '../auditLog/auditLogOperations';
import { courseAiJobTypeSchema } from './courseAiSchemas';
import type { CourseAiGenerationJobData } from './courseAiJobSchemas';
import { courseAiBuildQualityReport } from './courseAiQuality';
import { runCourseAiGeneration } from './courseAiService';
import {
  durationMs,
  errorToLogMetadata,
  logger,
} from '../../shared/lib/logger';

export async function courseAiWorker(
  data: CourseAiGenerationJobData,
): Promise<void> {
  if (data.kind !== 'generate') {
    logger.warn('ai.course_generation.unknown_job_kind', {
      kind: (data as any).kind,
    });
    return;
  }

  const startedAt = Date.now();
  const job = await prisma.courseAiGenerationJob.findUnique({
    where: { id: data.jobId },
  });
  if (!job || job.status === 'completed' || job.status === 'failed') {
    logger.info('ai.course_generation.skipped', {
      jobId: data.jobId,
      reason: !job ? 'missing_job' : 'terminal_status',
      status: job?.status,
    });
    return;
  }

  const input = parseJobInput(job.input);
  let jobType = String(job.jobType);

  logger.info('ai.course_generation.started', {
    jobId: job.id,
    userId: job.userId,
    courseId: job.courseId,
    jobType,
  });

  try {
    const parsedJobType = courseAiJobTypeSchema.parse(job.jobType);
    jobType = parsedJobType;
    await updateJobProgress(job.id, 'processing', 10, 'preparing', {
      startedAt: new Date(),
      errorMessage: null,
    });

    const prompt = await buildGenerationPrompt({
      courseId: job.courseId,
      jobType: parsedJobType,
      prompt: input.prompt,
      lessonId: input.lessonId,
    });

    await updateJobProgress(job.id, 'processing', 35, 'generating');
    const generation = await runCourseAiGeneration(parsedJobType, prompt, {
      notConfigured: 'courseAiNotConfigured',
      parseFailed: 'courseAiParseFailed',
    });
    const output = generation.json;

    await updateJobProgress(job.id, 'processing', 85, 'checking');
    const existingQuestionTexts = job.courseId
      ? (
          await prisma.courseQuestion.findMany({
            where: { courseId: job.courseId },
            select: { questionText: true },
          })
        ).map((question) => question.questionText)
      : [];
    const qualityReport = courseAiBuildQualityReport({
      jobType: parsedJobType,
      output,
      existingQuestionTexts,
    });

    const completed = await prisma.courseAiGenerationJob.update({
      where: { id: job.id },
      data: {
        status: 'completed',
        progressPercent: 100,
        progressStage: 'completed',
        output: output as Prisma.InputJsonValue,
        qualityReport: qualityReport as unknown as Prisma.InputJsonValue,
        completedAt: new Date(),
      },
    });

    await auditLogCreate({
      entityId: completed.id,
      entityName: 'CourseAiGenerationJob',
      operation: auditLogOperations.update,
      organizationId: null,
      userId: job.userId,
      oldData: job,
      newData: completed,
    });

    logger.info('ai.course_generation.completed', {
      jobId: job.id,
      userId: job.userId,
      courseId: job.courseId,
      jobType,
      model: generation.model,
      inputTokens: generation.usage.inputTokens,
      outputTokens: generation.usage.outputTokens,
      durationMs: durationMs(startedAt),
    });
  } catch (error: any) {
    const failed = await prisma.courseAiGenerationJob.update({
      where: { id: job.id },
      data: {
        status: 'failed',
        progressPercent: 100,
        progressStage: 'failed',
        errorMessage: courseAiErrorCode(error),
        completedAt: new Date(),
      },
    });

    await auditLogCreate({
      entityId: failed.id,
      entityName: 'CourseAiGenerationJob',
      operation: auditLogOperations.update,
      organizationId: null,
      userId: job.userId,
      oldData: job,
      newData: failed,
    });

    logger.error('ai.course_generation.failed', {
      jobId: job.id,
      userId: job.userId,
      courseId: job.courseId,
      jobType,
      errorCode: courseAiErrorCode(error),
      durationMs: durationMs(startedAt),
      error: errorToLogMetadata(error),
    });
  }
}

async function updateJobProgress(
  jobId: string,
  status: string,
  progressPercent: number,
  progressStage: string,
  extra?: Prisma.CourseAiGenerationJobUpdateInput,
) {
  await prisma.courseAiGenerationJob.update({
    where: { id: jobId },
    data: {
      status,
      progressPercent,
      progressStage,
      ...extra,
    },
  });
}

function parseJobInput(value: unknown) {
  const input =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    prompt: typeof input.prompt === 'string' ? input.prompt : '',
    lessonId: typeof input.lessonId === 'string' ? input.lessonId : null,
  };
}

async function buildGenerationPrompt(input: {
  courseId: string | null;
  jobType: string;
  prompt: string;
  lessonId: string | null;
}) {
  if (input.jobType !== 'improveLesson' || !input.courseId || !input.lessonId) {
    return input.prompt;
  }

  const lesson = await prisma.courseLesson.findFirst({
    where: { id: input.lessonId, courseId: input.courseId },
    include: { blocks: { orderBy: { orderIndex: 'asc' } } },
  });

  if (!lesson) {
    return input.prompt;
  }

  return [
    `Creator request: ${input.prompt}`,
    `Existing lesson title: ${lesson.title}`,
    `Existing lesson description: ${lesson.description || ''}`,
    `Existing blocks JSON: ${JSON.stringify(lesson.blocks || [])}`,
  ].join('\n\n');
}

function courseAiErrorCode(error: any) {
  const message = String(error?.message || error || '');
  if (
    message === 'courseAiNotConfigured' ||
    message === 'courseAiParseFailed'
  ) {
    return message;
  }

  return 'courseAiGenerationFailed';
}
