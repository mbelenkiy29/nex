import { z } from 'zod';
import { courseAccessTypeSchema } from '../course/courseSchemas';

export const productAnalyticsEventNameSchema = z.enum([
  'course_view',
  'personalized_onboarding_started',
  'personalized_onboarding_answered',
  'personalized_plan_generated',
  'personalized_plan_unlock_seen',
  'personalized_onboarding_completed',
  'preview_start',
  'value_sample_started',
  'value_sample_completed',
  'sample_diagnostic_started',
  'sample_diagnostic_completed',
  'proof_review_seen',
  'preview_curriculum_seen',
  'paywall_seen',
  'cta_click',
  'checkout_started',
  'paid',
  'first_value_after_payment',
  'activation_seen',
  'activation_cta_click',
  'ai_tutor_starter_click',
]);

export const productAnalyticsEventSourceSchema = z.enum([
  'frontend',
  'backend',
  'stripeWebhook',
]);

const nullableUuidSchema = z
  .string()
  .uuid()
  .optional()
  .nullable()
  .transform((value) => value || null);

const optionalStringSchema = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => value || null);

export const productAnalyticsEventInputSchema = z.object({
  eventName: productAnalyticsEventNameSchema,
  dedupeKey: optionalStringSchema(500),
  courseId: nullableUuidSchema,
  lessonId: nullableUuidSchema,
  subscriptionId: nullableUuidSchema,
  coursePurchaseId: nullableUuidSchema,
  stripeCheckoutSessionId: optionalStringSchema(255),
  stripePriceId: optionalStringSchema(255),
  accessType: courseAccessTypeSchema.optional().nullable(),
  ctaLocation: optionalStringSchema(120),
  funnelId: optionalStringSchema(180),
  sessionId: optionalStringSchema(180),
  anonymousId: optionalStringSchema(180),
  currentPath: optionalStringSchema(1000),
  referrerPath: optionalStringSchema(1000),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export const productAnalyticsEventOutputSchema = z.object({
  ok: z.literal(true),
});

export type ProductAnalyticsEventName = z.infer<
  typeof productAnalyticsEventNameSchema
>;

export type ProductAnalyticsEventSource = z.infer<
  typeof productAnalyticsEventSourceSchema
>;

export type ProductAnalyticsEventInput = z.input<
  typeof productAnalyticsEventInputSchema
>;
