import { z } from 'zod';

export const courseAiJobTypeSchema = z.enum([
  'generateOutline',
  'generateQuiz',
  'generateFlashcards',
  'generateLesson',
  'improveLesson',
]);

export type CourseAiJobType = z.infer<typeof courseAiJobTypeSchema>;

export const courseAiGenerateInputSchema = z.object({
  jobType: courseAiJobTypeSchema,
  prompt: z.string().trim().min(1).max(8000),
  lessonId: z.string().uuid().optional().nullable(),
});
