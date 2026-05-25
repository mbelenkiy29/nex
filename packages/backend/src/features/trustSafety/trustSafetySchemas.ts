import { z } from 'zod';
import { orderBySchema } from '../../shared/schemas/orderBySchema';

export const trustSafetyPolicyTypeSchema = z.enum([
  'refundPolicy',
  'teacherTerms',
  'studentTerms',
]);

export const trustSafetyReportTargetTypeSchema = z.enum([
  'course',
  'teacher',
  'courseRating',
]);

export const trustSafetyReportStatusSchema = z.enum([
  'open',
  'underReview',
  'resolvedActionTaken',
  'resolvedNoAction',
]);

export const trustSafetyReportPrioritySchema = z.enum([
  'low',
  'normal',
  'high',
  'urgent',
]);

export const trustSafetyReportOutcomeCategorySchema = z.enum([
  'none',
  'contentRemoved',
  'creatorWarning',
  'creatorSuspended',
  'refundReviewed',
  'noViolation',
  'duplicate',
]);

export const trustSafetyRiskFlagTargetTypeSchema = z.enum([
  'creator',
  'course',
  'report',
  'payout',
  'oneOnOneSession',
]);

export const trustSafetyRiskFlagSeveritySchema = z.enum([
  'low',
  'medium',
  'high',
  'critical',
]);

export const trustSafetyRiskFlagStatusSchema = z.enum([
  'open',
  'reviewing',
  'resolved',
  'dismissed',
]);

const nullableUuidSchema = z
  .string()
  .uuid()
  .optional()
  .nullable()
  .transform((value) => value || null);

const nullableUuidPatchSchema = z
  .string()
  .uuid()
  .optional()
  .nullable()
  .transform((value) => (value === undefined ? undefined : value || null));

export const trustSafetyPolicyAcceptInputSchema = z.object({
  policyType: trustSafetyPolicyTypeSchema,
});

export const trustSafetyReportCreateInputSchema = z
  .object({
    targetType: trustSafetyReportTargetTypeSchema,
    courseId: nullableUuidSchema,
    teacherUserId: nullableUuidSchema,
    ratingId: nullableUuidSchema,
    reason: z.string().trim().min(1).max(120),
    details: z.string().trim().max(5000).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.targetType === 'course' && !data.courseId) {
      ctx.addIssue({
        code: 'custom',
        path: ['courseId'],
        message: 'Required',
      });
    }

    if (data.targetType === 'teacher' && !data.teacherUserId) {
      ctx.addIssue({
        code: 'custom',
        path: ['teacherUserId'],
        message: 'Required',
      });
    }

    if (data.targetType === 'courseRating' && !data.ratingId) {
      ctx.addIssue({
        code: 'custom',
        path: ['ratingId'],
        message: 'Required',
      });
    }
  });

export const trustSafetyAdminListInputSchema = z.object({
  filter: z.record(z.string(), z.any()).optional(),
  orderBy: orderBySchema.optional(),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const trustSafetyReportUpdateInputSchema = z.object({
  status: trustSafetyReportStatusSchema,
  priority: trustSafetyReportPrioritySchema.optional(),
  assignedToUserId: nullableUuidPatchSchema,
  reviewDueAt: z.coerce.date().optional().nullable(),
  outcomeCategory: trustSafetyReportOutcomeCategorySchema.optional().nullable(),
  resolutionSummary: z.string().trim().max(5000).optional().nullable(),
  adminNotes: z.string().trim().max(5000).optional().nullable(),
});

export const trustSafetyRiskFlagCreateInputSchema = z
  .object({
    targetType: trustSafetyRiskFlagTargetTypeSchema,
    severity: trustSafetyRiskFlagSeveritySchema.default('medium'),
    reason: z.string().trim().min(1).max(1000),
    adminNotes: z.string().trim().max(5000).optional().nullable(),
    courseId: nullableUuidSchema,
    creatorUserId: nullableUuidSchema,
    reportId: nullableUuidSchema,
    payoutId: nullableUuidSchema,
    oneOnOneSessionId: nullableUuidSchema,
  })
  .superRefine((data, ctx) => {
    const fieldByTarget = {
      creator: 'creatorUserId',
      course: 'courseId',
      report: 'reportId',
      payout: 'payoutId',
      oneOnOneSession: 'oneOnOneSessionId',
    } as const;
    const field = fieldByTarget[data.targetType];

    if (!data[field]) {
      ctx.addIssue({
        code: 'custom',
        path: [field],
        message: 'Required',
      });
    }
  });

export const trustSafetyRiskFlagUpdateInputSchema = z.object({
  status: trustSafetyRiskFlagStatusSchema,
  severity: trustSafetyRiskFlagSeveritySchema.optional(),
  adminNotes: z.string().trim().max(5000).optional().nullable(),
});

export const trustSafetyCreatorStatusInputSchema = z.object({
  disabled: z.boolean(),
  reason: z.string().trim().max(5000).optional().nullable(),
  holdCourses: z.boolean().default(true),
});

export const trustSafetyCourseHoldInputSchema = z.object({
  held: z.boolean(),
  reason: z.string().trim().max(5000).optional().nullable(),
});

export type TrustSafetyPolicyType = z.output<
  typeof trustSafetyPolicyTypeSchema
>;

export type TrustSafetyReportCreateInput = z.input<
  typeof trustSafetyReportCreateInputSchema
>;

export type TrustSafetyRiskFlagCreateInput = z.input<
  typeof trustSafetyRiskFlagCreateInputSchema
>;
