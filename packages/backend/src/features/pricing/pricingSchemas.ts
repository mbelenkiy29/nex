import { z } from 'zod';

export const pricingPackageTypeSchema = z.enum([
  'monthly_subscription',
  'annual_subscription',
  'course_purchase',
  'course_bundle',
  'ai_credit_pack',
  'selected_lifetime_course_access',
]);

export const pricingSurfaceSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .default('global');

export const pricingExperimentStatusSchema = z.enum([
  'draft',
  'active',
  'paused',
  'archived',
]);

export const pricingPackagesInputSchema = z.object({
  surface: pricingSurfaceSchema,
  courseId: z.string().uuid().optional().nullable(),
  courseSlug: z.string().trim().max(220).optional().nullable(),
  bundleId: z.string().uuid().optional().nullable(),
  sessionId: z.string().trim().max(180).optional().nullable(),
  anonymousId: z.string().trim().max(180).optional().nullable(),
  currentPath: z.string().trim().max(1000).optional().nullable(),
});

export const pricingExposureInputSchema = z.object({
  surface: pricingSurfaceSchema,
  sessionId: z.string().trim().max(180).optional().nullable(),
  anonymousId: z.string().trim().max(180).optional().nullable(),
  currentPath: z.string().trim().max(1000).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export const pricingCheckoutMetadataSchema = z.object({
  pricingPackageId: z.string().trim().max(180).optional().nullable(),
  pricingExperimentId: z.string().uuid().optional().nullable(),
  pricingVariantId: z.string().uuid().optional().nullable(),
  packageType: pricingPackageTypeSchema.optional().nullable(),
});

export const pricingPackageSchema = z.object({
  id: z.string(),
  packageType: pricingPackageTypeSchema,
  name: z.string(),
  description: z.string().nullable(),
  priceCents: z.number(),
  currency: z.string(),
  billingInterval: z
    .enum(['one_time', 'month', 'year', 'day', 'week'])
    .default('one_time'),
  stripePriceId: z.string().nullable(),
  courseId: z.string().uuid().nullable(),
  bundleId: z.string().uuid().nullable(),
  aiCreditPackId: z.string().uuid().nullable(),
  tokenAmount: z.number().nullable(),
  savingsPercent: z.number().nullable(),
  recommended: z.boolean(),
  comparisonGroup: z.string().nullable(),
  benefits: z.array(z.string()),
  pricingExperimentId: z.string().uuid().nullable(),
  pricingVariantId: z.string().uuid().nullable(),
  variantName: z.string().nullable(),
});

export const pricingPackagesOutputSchema = z.object({
  experiment: z
    .object({
      id: z.string().uuid(),
      key: z.string(),
      name: z.string(),
      surface: z.string(),
    })
    .nullable(),
  variant: z
    .object({
      id: z.string().uuid(),
      key: z.string(),
      name: z.string(),
      isControl: z.boolean(),
    })
    .nullable(),
  packages: z.array(pricingPackageSchema),
});

export const pricingVariantManageInputSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(200),
  allocationBps: z.coerce.number().int().min(0).max(10000).default(10000),
  isControl: z.boolean().default(false),
  orderIndex: z.coerce.number().int().min(0).default(0),
  packageConfig: z.record(z.string(), z.unknown()).default({}),
});

export const pricingExperimentManageInputSchema = z.object({
  key: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(200),
  status: pricingExperimentStatusSchema.default('draft'),
  surface: pricingSurfaceSchema,
  trafficPercent: z.coerce.number().int().min(0).max(100).default(100),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  variants: z.array(pricingVariantManageInputSchema).min(1).max(12),
});

export const pricingExperimentUpdateInputSchema =
  pricingExperimentManageInputSchema.partial().extend({
    variants: z
      .array(pricingVariantManageInputSchema)
      .min(1)
      .max(12)
      .optional(),
  });

export type PricingPackageType = z.infer<typeof pricingPackageTypeSchema>;
export type PricingCheckoutMetadata = z.input<
  typeof pricingCheckoutMetadataSchema
>;
