import { getPgBoss } from '../../shared/jobs/pgBoss';
import { errorToLogMetadata, logger } from '../../shared/lib/logger';
import {
  COURSE_VIDEO_TRANSCRIPT_QUEUE,
  type CourseVideoTranscriptJobData,
} from './courseVideoTranscriptJobSchemas';

export async function courseVideoTranscriptEnqueue(
  data: CourseVideoTranscriptJobData,
) {
  const boss = await getPgBoss();
  return await boss.send(COURSE_VIDEO_TRANSCRIPT_QUEUE, data);
}

export async function courseVideoTranscriptEnqueueQueuedLessons(
  lessons: Array<{
    id: string;
    videoTranscriptStatus?: string | null;
    videoTranscriptSourceKey?: string | null;
  }>,
) {
  const queued = lessons.filter(
    (lesson) =>
      lesson.videoTranscriptStatus === 'queued' &&
      Boolean(lesson.videoTranscriptSourceKey),
  );

  for (const lesson of queued) {
    courseVideoTranscriptEnqueue({
      kind: 'transcribe',
      lessonId: lesson.id,
      sourceKey: lesson.videoTranscriptSourceKey!,
    }).catch((error) => {
      logger.error('course.video_transcript.enqueue_failed', {
        lessonId: lesson.id,
        sourceKey: lesson.videoTranscriptSourceKey,
        error: errorToLogMetadata(error),
      });
    });
  }
}
