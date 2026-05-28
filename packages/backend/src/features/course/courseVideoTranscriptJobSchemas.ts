import { z } from 'zod';

export const COURSE_VIDEO_TRANSCRIPT_QUEUE = 'course-video-transcript';

export const courseVideoTranscriptJobDataSchema = z.object({
  kind: z.literal('transcribe'),
  lessonId: z.string().uuid(),
  sourceKey: z.string().min(1),
});

export type CourseVideoTranscriptJobData = z.infer<
  typeof courseVideoTranscriptJobDataSchema
>;
