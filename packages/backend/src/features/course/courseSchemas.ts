import { z } from 'zod';
import { fileUploadedSchema } from '../file/fileSchemas';
import { orderBySchema } from '../../shared/schemas/orderBySchema';
import {
  COURSE_DEFAULT_CREATOR_REVENUE_SHARE_BPS,
  COURSE_REVENUE_SHARE_TOTAL_BPS,
} from './courseRevenueShare';
import { pricingCheckoutMetadataSchema } from '../pricing/pricingSchemas';

export const courseStatusSchema = z.enum([
  'draft',
  'inReview',
  'published',
  'archived',
  'rejected',
]);

export const courseVisibilitySchema = z.enum(['private', 'unlisted', 'public']);

export const courseAccessTypeSchema = z.enum([
  'free',
  'manual',
  'paid',
  'subscription',
]);

export const courseEnrollmentStatusSchema = z.enum([
  'active',
  'completed',
  'cancelled',
]);

export const courseCatalogSortSchema = z.enum([
  'trending',
  'topRated',
  'newest',
  'mostPopular',
  'priceAsc',
  'priceDesc',
  'durationAsc',
]);

export const courseDurationBucketSchema = z.enum(['short', 'medium', 'long']);

export const courseCouponDiscountTypeSchema = z.enum(['percent', 'amount']);

export const courseCouponStatusSchema = z.enum([
  'active',
  'inactive',
  'archived',
]);

export const courseBundleStatusSchema = z.enum([
  'draft',
  'published',
  'archived',
]);

export const courseAssignmentSubmissionStatusSchema = z.enum([
  'submitted',
  'complete',
  'needsRevision',
]);

export const courseAssignmentRubricCriterionManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  maxPoints: z.coerce.number().int().min(1).max(1000).default(10),
  orderIndex: z.coerce.number().int().min(0).default(0),
});

export const courseAssignmentRubricScoreInputSchema = z.object({
  criterionId: z.string().uuid(),
  score: z.coerce.number().int().min(0).max(1000),
  feedback: z.string().trim().max(2000).optional().nullable(),
});

const nullableUuidSchema = z
  .string()
  .uuid()
  .optional()
  .nullable()
  .transform((value) => value || null);

const optionalCourseFileArraySchema = z
  .array(fileUploadedSchema)
  .optional()
  .nullable()
  .transform((value) => value || null);

export const courseListInputSchema = z.object({
  filter: z.record(z.string(), z.any()).optional(),
  orderBy: orderBySchema.optional(),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const courseCompareInputSchema = z.object({
  ids: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((value) => {
      if (!value) {
        return [];
      }

      const raw = Array.isArray(value) ? value : value.split(',');

      return raw.map((item) => item.trim()).filter(Boolean);
    })
    .pipe(z.array(z.string().uuid()).max(4)),
});

export const courseWishlistCreateInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export const courseCheckoutInputSchema = z
  .object({
    couponCode: z.string().trim().max(80).optional().nullable(),
  })
  .merge(pricingCheckoutMetadataSchema.partial());

export const courseBundleCheckoutInputSchema = pricingCheckoutMetadataSchema
  .partial()
  .default({});

export const courseAutocompleteInputSchema = z.object({
  search: z.string().trim().optional(),
  exclude: z.array(z.uuid()).optional(),
  take: z.coerce.number().optional(),
  orderBy: orderBySchema.default({ title: 'asc' }),
});

export const courseAutocompleteOutputSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
});

export const courseModuleManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  orderIndex: z.coerce.number().int().min(0).default(0),
});

export const courseLessonManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  videoFiles: optionalCourseFileArraySchema,
  videoUrl: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .nullable()
    .transform((value) => value || null),
  resourceFiles: optionalCourseFileArraySchema,
  videoDurationSeconds: z.coerce.number().int().min(0).optional().nullable(),
  orderIndex: z.coerce.number().int().min(0).default(0),
  isPreview: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  moduleId: nullableUuidSchema,
});

// Phase 7: course-setup items + flashcards.
export const courseTextItemManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  text: z.string().trim().min(1).max(500),
  orderIndex: z.coerce.number().int().min(0).default(0),
});

export const courseFlashcardSetManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  moduleId: nullableUuidSchema,
  lessonId: nullableUuidSchema,
  orderIndex: z.coerce.number().int().min(0).default(0),
});

export const courseFlashcardManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  flashcardSetId: z.string().uuid(),
  front: z.string().trim().min(1).max(2000),
  back: z.string().trim().min(1).max(2000),
  hint: z.string().trim().max(1000).optional().nullable(),
  orderIndex: z.coerce.number().int().min(0).default(0),
});

// Typed block-editor lesson content.
export const courseLessonBlockTypeSchema = z.enum([
  'heading',
  'paragraph',
  'image',
  'video',
  'pdf',
  'callout',
  'quizEmbed',
  'flashcardSet',
  'aiTutorPrompt',
  'table',
  'divider',
  'bulletList',
  'numberedList',
]);

export const courseLessonBlockManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  lessonId: z.string().uuid(),
  blockType: courseLessonBlockTypeSchema,
  // content shape depends on blockType; validated by the editor, stored as JSON.
  content: z.any().optional(),
  orderIndex: z.coerce.number().int().min(0).default(0),
});

export const courseAssignmentManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  prompt: z.string().trim().min(1).max(50000),
  orderIndex: z.coerce.number().int().min(0).default(0),
  dueDaysAfterEnroll: z.coerce.number().int().min(0).optional().nullable(),
  rubric: z
    .array(courseAssignmentRubricCriterionManageInputSchema)
    .max(20)
    .default([]),
  allowResubmissions: z.boolean().default(true),
  maxAttempts: z.coerce.number().int().min(1).max(50).optional().nullable(),
  moduleId: nullableUuidSchema,
  lessonId: nullableUuidSchema,
});

// ----- Phase 6: reusable question bank -----

export const courseQuestionTypeSchema = z.enum([
  'multipleChoice',
  'multiSelect',
  'trueFalse',
  'shortAnswer',
  'ordering',
  'matching',
  'caseStudy',
]);

export const courseQuestionDifficultySchema = z.enum([
  'easy',
  'medium',
  'hard',
]);

export const courseQuestionStatusSchema = z.enum([
  'draft',
  'approved',
  'flagged',
  'archived',
]);

export const courseQuestionAnswerManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  answerText: z.string().trim().min(1).max(2000),
  isCorrect: z.boolean().default(false),
  matchText: z.string().trim().max(2000).optional().nullable(),
  explanation: z.string().trim().max(2000).optional().nullable(),
  orderIndex: z.coerce.number().int().min(0).default(0),
});

// A reusable question-bank entry. Quizzes and practice exams reference these.
export const courseQuestionManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  questionText: z.string().trim().min(1).max(5000),
  questionType: courseQuestionTypeSchema.default('multipleChoice'),
  explanation: z.string().trim().max(5000).optional().nullable(),
  difficulty: courseQuestionDifficultySchema.default('medium'),
  examDomain: z.string().trim().max(200).optional().nullable(),
  tags: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
  source: z.string().trim().max(200).optional().nullable(),
  aiGenerated: z.boolean().default(false),
  status: courseQuestionStatusSchema.default('draft'),
  meta: z.any().optional().nullable(),
  answers: z.array(courseQuestionAnswerManageInputSchema).max(20).default([]),
});

// Join row: a bank question's placement (order + points) within a quiz.
export const courseQuizQuestionManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  quizId: z.string().uuid(),
  questionId: z.string().uuid(),
  orderIndex: z.coerce.number().int().min(0).default(0),
  points: z.coerce.number().int().min(1).max(100).default(1),
});

export const courseQuizManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  orderIndex: z.coerce.number().int().min(0).default(0),
  passingScore: z.coerce.number().int().min(0).max(100).optional().nullable(),
  timeLimitMinutes: z.coerce
    .number()
    .int()
    .min(0)
    .max(600)
    .optional()
    .nullable(),
  randomizeQuestions: z.boolean().default(false),
  randomizeAnswers: z.boolean().default(false),
  showExplanations: z.boolean().default(true),
  allowRetries: z.boolean().default(true),
  maxAttempts: z.coerce.number().int().min(1).max(50).optional().nullable(),
  moduleId: nullableUuidSchema,
  lessonId: nullableUuidSchema,
});

export const coursePracticeExamRuleManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  practiceExamId: z.string().uuid(),
  examDomain: z.string().trim().min(1).max(200),
  questionCount: z.coerce.number().int().min(0).max(500).default(0),
  difficulty: courseQuestionDifficultySchema.optional().nullable(),
  orderIndex: z.coerce.number().int().min(0).default(0),
});

export const coursePracticeExamManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  examType: z.string().trim().max(120).optional().nullable(),
  totalQuestions: z.coerce.number().int().min(0).max(500).default(0),
  timeLimitMinutes: z.coerce
    .number()
    .int()
    .min(0)
    .max(600)
    .optional()
    .nullable(),
  passingScore: z.coerce.number().int().min(0).max(100).optional().nullable(),
  randomizeQuestions: z.boolean().default(true),
  simulateRealExam: z.boolean().default(false),
  orderIndex: z.coerce.number().int().min(0).default(0),
});

export const courseManageInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(220).optional().nullable(),
  subtitle: z.string().trim().max(300).optional().nullable(),
  description: z.string().trim().max(50000).optional().nullable(),
  categoryId: nullableUuidSchema,
  examType: z.string().trim().max(120).optional().nullable(),
  thumbnail: optionalCourseFileArraySchema,
  introVideoFiles: optionalCourseFileArraySchema,
  promoVideoFiles: optionalCourseFileArraySchema,
  difficulty: z.string().trim().max(40).optional().nullable(),
  language: z.string().trim().max(40).optional().nullable(),
  visibility: courseVisibilitySchema.default('private'),
  audience: z.array(z.string().trim().min(1).max(300)).max(20).default([]),
  status: courseStatusSchema.default('draft'),
  accessType: courseAccessTypeSchema.default('free'),
  priceCents: z.coerce.number().int().min(0).optional().nullable(),
  certificateEnabled: z.boolean().default(true),
  currency: z.string().trim().length(3).toUpperCase().default('USD'),
  stripePriceId: z.string().trim().max(255).optional().nullable(),
  lifetimeAccessEnabled: z.boolean().default(false),
  lifetimePriceCents: z.coerce.number().int().min(0).optional().nullable(),
  lifetimeStripePriceId: z.string().trim().max(255).optional().nullable(),
  subscriptionPlanKey: z.string().trim().max(120).optional().nullable(),
  creatorRevenueShareBps: z.coerce
    .number()
    .int()
    .min(0)
    .max(COURSE_REVENUE_SHARE_TOTAL_BPS)
    .default(COURSE_DEFAULT_CREATOR_REVENUE_SHARE_BPS),
  nexVerified: z.boolean().default(false),
  creatorUserId: nullableUuidSchema,
  creatorMemberId: nullableUuidSchema,
  creatorOrganizationId: nullableUuidSchema,
  modules: z.array(courseModuleManageInputSchema).default([]),
  lessons: z.array(courseLessonManageInputSchema).default([]),
  assignments: z.array(courseAssignmentManageInputSchema).default([]),
  questions: z.array(courseQuestionManageInputSchema).default([]),
  quizzes: z.array(courseQuizManageInputSchema).default([]),
  quizQuestions: z.array(courseQuizQuestionManageInputSchema).default([]),
  practiceExams: z.array(coursePracticeExamManageInputSchema).default([]),
  practiceExamRules: z
    .array(coursePracticeExamRuleManageInputSchema)
    .default([]),
  outcomes: z.array(courseTextItemManageInputSchema).default([]),
  requirements: z.array(courseTextItemManageInputSchema).default([]),
  flashcardSets: z.array(courseFlashcardSetManageInputSchema).default([]),
  flashcards: z.array(courseFlashcardManageInputSchema).default([]),
  blocks: z.array(courseLessonBlockManageInputSchema).default([]),
});

// Creator-facing builder input. Deliberately omits status, nexVerified,
// monetization (price/stripe/subscription/revenue share) and creator-attribution
// fields — those are admin/system-controlled and must never be settable by a
// creator. Status transitions go through dedicated submit/withdraw/review endpoints.
export const courseBuilderManageInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(220).optional().nullable(),
  subtitle: z.string().trim().max(300).optional().nullable(),
  description: z.string().trim().max(50000).optional().nullable(),
  categoryId: nullableUuidSchema,
  examType: z.string().trim().max(120).optional().nullable(),
  thumbnail: optionalCourseFileArraySchema,
  introVideoFiles: optionalCourseFileArraySchema,
  promoVideoFiles: optionalCourseFileArraySchema,
  difficulty: z.string().trim().max(40).optional().nullable(),
  language: z.string().trim().max(40).optional().nullable(),
  visibility: courseVisibilitySchema.default('private'),
  audience: z.array(z.string().trim().min(1).max(300)).max(20).default([]),
  certificateEnabled: z.boolean().default(true),
  modules: z.array(courseModuleManageInputSchema).default([]),
  lessons: z.array(courseLessonManageInputSchema).default([]),
  assignments: z.array(courseAssignmentManageInputSchema).default([]),
  questions: z.array(courseQuestionManageInputSchema).default([]),
  quizzes: z.array(courseQuizManageInputSchema).default([]),
  quizQuestions: z.array(courseQuizQuestionManageInputSchema).default([]),
  practiceExams: z.array(coursePracticeExamManageInputSchema).default([]),
  practiceExamRules: z
    .array(coursePracticeExamRuleManageInputSchema)
    .default([]),
  outcomes: z.array(courseTextItemManageInputSchema).default([]),
  requirements: z.array(courseTextItemManageInputSchema).default([]),
  flashcardSets: z.array(courseFlashcardSetManageInputSchema).default([]),
  flashcards: z.array(courseFlashcardManageInputSchema).default([]),
  blocks: z.array(courseLessonBlockManageInputSchema).default([]),
});

export const courseBuilderCheckpointSourceSchema = z.enum([
  'autosave',
  'manual',
  'restore',
  'submitSnapshot',
]);

export const courseBuilderCheckpointCreateInputSchema = z.object({
  source: courseBuilderCheckpointSourceSchema.default('manual'),
  label: z.string().trim().max(120).optional().nullable(),
  payload: z.record(z.string(), z.any()).default({}),
});

export const courseReviewInputSchema = z.object({
  decision: z.enum(['approve', 'requestChanges']),
  reviewNotes: z.string().trim().max(4000).optional().nullable(),
});

export const courseQuizAttemptInputSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        selectedOptionIds: z
          .array(z.string().trim().min(1).max(64))
          .default([]),
      }),
    )
    .default([]),
});

export const courseEnrollmentManageInputSchema = z.object({
  email: z.string().trim().email(),
});

export const courseAssignmentSubmissionInputSchema = z.object({
  text: z.string().trim().max(50000).optional().nullable(),
  files: z
    .array(fileUploadedSchema)
    .optional()
    .nullable()
    .transform((value) => value || null),
});

export const courseAssignmentSubmissionReviewInputSchema = z.object({
  status: courseAssignmentSubmissionStatusSchema,
  feedback: z.string().trim().max(5000).optional().nullable(),
  rubricScores: z.array(courseAssignmentRubricScoreInputSchema).default([]),
});

export const courseRatingInputSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().nullable(),
  isPublic: z.boolean().default(true),
});

export const courseCouponManageInputSchema = z
  .object({
    code: z.string().trim().min(3).max(80),
    description: z.string().trim().max(500).optional().nullable(),
    status: courseCouponStatusSchema.default('active'),
    discountType: courseCouponDiscountTypeSchema,
    percentOff: z.coerce.number().int().min(1).max(100).optional().nullable(),
    amountOffCents: z.coerce.number().int().min(1).optional().nullable(),
    currency: z.string().trim().length(3).toUpperCase().default('USD'),
    startsAt: z.coerce.date().optional().nullable(),
    endsAt: z.coerce.date().optional().nullable(),
    maxRedemptions: z.coerce.number().int().min(1).optional().nullable(),
    maxRedemptionsPerUser: z.coerce.number().int().min(1).default(1),
    courseId: nullableUuidSchema,
    bundleId: nullableUuidSchema,
  })
  .refine(
    (value) =>
      value.discountType === 'percent'
        ? Boolean(value.percentOff)
        : Boolean(value.amountOffCents),
    { path: ['discountType'] },
  );

export const courseBundleManageInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(220).optional().nullable(),
  description: z.string().trim().max(4000).optional().nullable(),
  thumbnail: optionalCourseFileArraySchema,
  status: courseBundleStatusSchema.default('draft'),
  priceCents: z.coerce.number().int().min(0).optional().nullable(),
  currency: z.string().trim().length(3).toUpperCase().default('USD'),
  courseIds: z.array(z.string().uuid()).min(2).max(20),
});

export type CourseManageInput = z.input<typeof courseManageInputSchema>;
export type CourseBuilderManageInput = z.input<
  typeof courseBuilderManageInputSchema
>;
export type CourseBundleManageInput = z.input<
  typeof courseBundleManageInputSchema
>;
export type CourseCouponManageInput = z.input<
  typeof courseCouponManageInputSchema
>;
export type CourseBuilderCheckpointCreateInput = z.input<
  typeof courseBuilderCheckpointCreateInputSchema
>;
export type CourseAssignmentSubmissionInput = z.input<
  typeof courseAssignmentSubmissionInputSchema
>;

// Structural type for the content-sync arrays shared by the admin and creator
// builder paths — courseSyncContent touches exactly these collections.
export type CourseContentManageInput = {
  modules: Array<z.output<typeof courseModuleManageInputSchema>>;
  lessons: Array<z.output<typeof courseLessonManageInputSchema>>;
  assignments: Array<z.output<typeof courseAssignmentManageInputSchema>>;
  questions: Array<z.output<typeof courseQuestionManageInputSchema>>;
  quizzes: Array<z.output<typeof courseQuizManageInputSchema>>;
  quizQuestions: Array<z.output<typeof courseQuizQuestionManageInputSchema>>;
  practiceExams: Array<z.output<typeof coursePracticeExamManageInputSchema>>;
  practiceExamRules: Array<
    z.output<typeof coursePracticeExamRuleManageInputSchema>
  >;
  outcomes: Array<z.output<typeof courseTextItemManageInputSchema>>;
  requirements: Array<z.output<typeof courseTextItemManageInputSchema>>;
  flashcardSets: Array<z.output<typeof courseFlashcardSetManageInputSchema>>;
  flashcards: Array<z.output<typeof courseFlashcardManageInputSchema>>;
  blocks: Array<z.output<typeof courseLessonBlockManageInputSchema>>;
};

export const coursePracticeExamSubmitSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        selectedOptionIds: z
          .array(z.string().trim().min(1).max(64))
          .default([]),
      }),
    )
    .default([]),
});
