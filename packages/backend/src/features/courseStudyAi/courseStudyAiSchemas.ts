import { z } from 'zod';

// Input for the per-lesson streaming features (explain / summarize).
export const courseStudyAiLessonInputSchema = z.object({
  lessonId: z.string().uuid(),
});
export type CourseStudyAiLessonInput = z.infer<
  typeof courseStudyAiLessonInputSchema
>;

// Input for "Quiz me from this module" — a short interactive quiz.
export const courseStudyAiQuizInputSchema = z.object({
  moduleId: z.string().uuid(),
});
export type CourseStudyAiQuizInput = z.infer<
  typeof courseStudyAiQuizInputSchema
>;

// Input for "Generate practice questions" — a larger module-scoped set.
export const courseStudyAiPracticeInputSchema = z.object({
  moduleId: z.string().uuid(),
  count: z.number().int().min(5).max(20).default(12),
});
export type CourseStudyAiPracticeInput = z.infer<
  typeof courseStudyAiPracticeInputSchema
>;

// One AI-generated multiple-choice question. This is both the AI output shape
// and the response shape — Phase 1 grades client-side, so options carry the
// `isCorrect` flag. AI questions are study-only and never count toward grades.
export const courseStudyAiQuestionSchema = z.object({
  questionText: z.string().min(1),
  explanation: z.string().default(''),
  examDomain: z.string().default('General'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  options: z
    .array(
      z.object({
        text: z.string().min(1),
        isCorrect: z.boolean(),
      }),
    )
    .min(2),
});
export type CourseStudyAiQuestion = z.infer<typeof courseStudyAiQuestionSchema>;

export const courseStudyAiQuizResultSchema = z.object({
  kind: z.enum(['quiz', 'practice']),
  moduleId: z.string().uuid(),
  questions: z.array(courseStudyAiQuestionSchema),
});
export type CourseStudyAiQuizResult = z.infer<
  typeof courseStudyAiQuizResultSchema
>;

// SSE chunk shape for the streaming endpoints — kept here (zod-only module) so
// the frontend can import the type without pulling in the Anthropic SDK.
export interface CourseStudyAiStreamChunk {
  type: 'text' | 'error' | 'done' | 'usage';
  content?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

// Submitting a completed AI quiz so the attempt is persisted (Phase 2). The
// generated questions are echoed back since they are not bank questions.
export const courseStudyAiSubmitInputSchema = z.object({
  kind: z.enum(['quiz', 'practice']),
  moduleId: z.string().uuid().nullish(),
  questions: z.array(courseStudyAiQuestionSchema).min(1),
  answers: z.array(
    z.object({
      questionIndex: z.number().int().min(0),
      selectedOptionIndex: z.number().int().min(0),
    }),
  ),
});
export type CourseStudyAiSubmitInput = z.infer<
  typeof courseStudyAiSubmitInputSchema
>;

// The student's per-course target exam date (stored on CourseEnrollment).
export const courseStudyAiExamDateInputSchema = z.object({
  targetExamDate: z.string().trim().min(1).max(40).nullable(),
  examName: z.string().trim().max(200).nullable().optional(),
});
export type CourseStudyAiExamDateInput = z.infer<
  typeof courseStudyAiExamDateInputSchema
>;

// Creating a manual study-plan item.
export const courseStudyPlanItemInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).nullish(),
  plannedForDate: z.string().trim().max(40).nullish(),
});
export type CourseStudyPlanItemInput = z.infer<
  typeof courseStudyPlanItemInputSchema
>;

// Updating a study-plan item (toggle done, edit fields).
export const courseStudyPlanItemUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).nullish(),
  plannedForDate: z.string().trim().max(40).nullish(),
  status: z.enum(['todo', 'completed']).optional(),
});
export type CourseStudyPlanItemUpdate = z.infer<
  typeof courseStudyPlanItemUpdateSchema
>;
