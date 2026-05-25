import { z } from 'zod';
import { dateOptionalSchema } from '../../shared/schemas/dateSchema';
import { numberOptionalSchema } from '../../shared/schemas/numberSchema';

export const studentExperienceCourseParamsSchema = z.object({
  courseId: z.uuid(),
});

export const studentExperienceAttemptParamsSchema = z.object({
  attemptId: z.uuid(),
});

export const studentExperienceDiagnosticAttemptParamsSchema =
  studentExperienceCourseParamsSchema.extend({
    attemptId: z.uuid(),
  });

export const studentExperienceNoteParamsSchema =
  studentExperienceCourseParamsSchema.extend({
    noteId: z.uuid(),
  });

export const studentExperienceStudyPlanParamsSchema =
  studentExperienceCourseParamsSchema.extend({
    itemId: z.uuid(),
  });

export const studentExperiencePracticeStartInputSchema = z.object({
  questionCount: numberOptionalSchema
    .pipe(z.number().int().min(1).max(20).optional().nullable())
    .optional(),
});

export const studentExperienceDiagnosticStartInputSchema = z.object({
  questionCount: numberOptionalSchema
    .pipe(z.number().int().min(3).max(20).optional().nullable())
    .optional(),
});

export const studentExperiencePracticeAnswerInputSchema = z.object({
  questionId: z.uuid(),
  selectedAnswerIndex: z.number().int().min(0).max(20),
});

export const studentExperienceDiagnosticAnswerInputSchema = z.object({
  answerId: z.uuid(),
  selectedAnswerIndex: z.number().int().min(0).max(20),
});

export const studentExperienceFlashcardReviewParamsSchema =
  studentExperienceCourseParamsSchema.extend({
    flashcardId: z.uuid(),
  });

export const studentExperienceFlashcardReviewInputSchema = z.object({
  rating: z.enum(['again', 'hard', 'good', 'easy']),
});

export const studentExperienceRemediationGenerateInputSchema = z.object({
  domain: z.string().trim().min(1).max(200).nullable().optional(),
});

export const studentExperienceNoteInputSchema = z.object({
  lessonId: z.uuid().nullable().optional(),
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(20000),
  tags: z.array(z.string().trim().min(1).max(60)).max(15).optional(),
});

export const studentExperienceNoteUpdateInputSchema =
  studentExperienceNoteInputSchema.partial().extend({
    updatedAt: z.string().optional(),
  });

export const studentExperienceStudyPlanInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).nullable().optional(),
  plannedForDate: dateOptionalSchema,
  status: z.enum(['todo', 'complete']).default('todo'),
});

export const studentExperienceStudyPlanUpdateInputSchema =
  studentExperienceStudyPlanInputSchema.partial().extend({
    updatedAt: z.string().optional(),
  });

export const studentExperienceAdaptivePlanGenerateInputSchema = z.object({
  targetExamDate: dateOptionalSchema,
  examName: z.string().trim().max(200).nullable().optional(),
});

export const studentExperienceResumeInputSchema = z.object({
  lessonId: z.uuid().nullable().optional(),
  practiceAttemptId: z.uuid().nullable().optional(),
  lastRoute: z.string().trim().max(500).nullable().optional(),
  lastPositionSeconds: z
    .number()
    .int()
    .min(0)
    .max(86_400)
    .nullable()
    .optional(),
  lastScrollPercent: z.number().int().min(0).max(100).nullable().optional(),
  deviceType: z
    .enum(['web', 'mobileWeb', 'ios', 'android'])
    .nullable()
    .optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const studentExperienceOfflineMutationSchema = z.discriminatedUnion(
  'type',
  [
    z.object({
      id: z.string().min(1).max(120),
      type: z.literal('lessonComplete'),
      courseId: z.uuid(),
      lessonId: z.uuid(),
      createdAt: z.string(),
    }),
    z.object({
      id: z.string().min(1).max(120),
      type: z.literal('noteCreate'),
      courseId: z.uuid(),
      title: z.string().trim().min(1).max(200),
      content: z.string().trim().min(1).max(20000),
      lessonId: z.uuid().nullable().optional(),
      tags: z.array(z.string().trim().min(1).max(60)).max(15).optional(),
      createdAt: z.string(),
    }),
    z.object({
      id: z.string().min(1).max(120),
      type: z.literal('practiceAnswer'),
      courseId: z.uuid(),
      attemptId: z.uuid(),
      questionId: z.uuid(),
      selectedAnswerIndex: z.number().int().min(0).max(20),
      createdAt: z.string(),
    }),
    z.object({
      id: z.string().min(1).max(120),
      type: z.literal('studyPlanUpdate'),
      courseId: z.uuid(),
      itemId: z.uuid(),
      status: z.enum(['todo', 'complete']),
      createdAt: z.string(),
    }),
    z.object({
      id: z.string().min(1).max(120),
      type: z.literal('resumeUpdate'),
      courseId: z.uuid(),
      resume: studentExperienceResumeInputSchema,
      createdAt: z.string(),
    }),
  ],
);

export const studentExperienceSyncInputSchema = z.object({
  mutations: z.array(studentExperienceOfflineMutationSchema).max(100),
});

export const studentReminderPreferenceInputSchema = z.object({
  courseId: z.uuid().nullable().optional(),
  enabled: z.boolean(),
  quietHoursStart: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable()
    .optional(),
  quietHoursEnd: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable()
    .optional(),
  timezone: z.string().trim().min(1).max(80).default('UTC'),
  channels: z
    .array(z.enum(['mobilePush', 'webPush', 'email']))
    .default(['mobilePush']),
  smartRemindersEnabled: z.boolean().default(true),
});

export type StudentExperiencePracticeStartInput = z.infer<
  typeof studentExperiencePracticeStartInputSchema
>;

export type StudentExperienceAdaptivePlanGenerateInput = z.infer<
  typeof studentExperienceAdaptivePlanGenerateInputSchema
>;
export type StudentExperienceResumeInput = z.infer<
  typeof studentExperienceResumeInputSchema
>;
export type StudentExperienceSyncInput = z.infer<
  typeof studentExperienceSyncInputSchema
>;
export type StudentReminderPreferenceInput = z.infer<
  typeof studentReminderPreferenceInputSchema
>;
