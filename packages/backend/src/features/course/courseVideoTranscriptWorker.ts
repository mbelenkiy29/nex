import { logger } from '../../shared/lib/logger';
import { runCourseVideoTranscriptJob } from './courseVideoTranscriptService';
import type { CourseVideoTranscriptJobData } from './courseVideoTranscriptJobSchemas';

export async function courseVideoTranscriptWorker(
  data: CourseVideoTranscriptJobData,
) {
  switch (data.kind) {
    case 'transcribe':
      await runCourseVideoTranscriptJob(data);
      return;
    default:
      logger.warn('course.video_transcript.unknown_job_kind', {
        kind: (data as any).kind,
      });
  }
}
