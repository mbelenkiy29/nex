import { z } from 'zod';
import { orderBySchema } from '../../shared/schemas/orderBySchema';

export const platformPromotionKindSchema = z.enum([
  'toast',
  'banner',
  'discount',
]);

export const platformPromotionAudienceSchema = z.enum([
  'students',
  'admins',
  'all',
]);

export const creatorPayoutStatusSchema = z.enum([
  'pending',
  'paid',
  'cancelled',
]);

export const platformMetricsRangeSchema = z.enum([
  '7d',
  '30d',
  '90d',
  '12m',
]);

const nullableUuidSchema = z
  .string()
  .uuid()
  .optional()
  .nullable()
  .transform((value) => value || null);

const nullableDateSchema = z
  .string()
  .optional()
  .nullable()
  .transform((value) => (value ? new Date(value) : null));

export const platformAdminListInputSchema = z.object({
  filter: z.record(z.string(), z.any()).optional(),
  orderBy: orderBySchema.optional(),
  skip: z.coerce.number().optional(),
  take: z.coerce.number().optional(),
});

export const platformAdminInvitationCreateInputSchema = z.object({
  organizationId: z.string().uuid(),
  email: z.string().trim().email(),
  role: z.enum(['admin', 'member']),
});

export const platformPromotionCreateInputSchema = z.object({
  kind: platformPromotionKindSchema,
  title: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(1000),
  ctaLabel: z.string().trim().max(80).optional().nullable(),
  ctaHref: z.string().trim().max(500).optional().nullable(),
  audience: platformPromotionAudienceSchema.default('students'),
  organizationId: nullableUuidSchema,
  startsAt: nullableDateSchema,
  endsAt: nullableDateSchema,
  isActive: z.boolean().default(true),
});

export const platformPromotionUpdateInputSchema =
  platformPromotionCreateInputSchema.partial();

export const creatorPayoutCreateInputSchema = z.object({
  organizationId: nullableUuidSchema,
  creatorUserId: nullableUuidSchema,
  creatorMemberId: nullableUuidSchema,
  courseId: nullableUuidSchema,
  amount: z.coerce.number().positive(),
  currency: z.string().trim().min(3).max(3).default('USD'),
  description: z.string().trim().max(1000).optional().nullable(),
});

export const creatorPayoutUpdateStatusInputSchema = z.object({
  status: creatorPayoutStatusSchema,
});

export const platformMetricsInputSchema = z.object({
  range: platformMetricsRangeSchema.default('30d'),
  courseId: nullableUuidSchema,
  creatorUserId: nullableUuidSchema,
});

export type PlatformPromotionCreateInput = z.input<
  typeof platformPromotionCreateInputSchema
>;

export type PlatformPromotionUpdateInput = z.input<
  typeof platformPromotionUpdateInputSchema
>;

export type CreatorPayoutCreateInput = z.input<
  typeof creatorPayoutCreateInputSchema
>;

export type CreatorPayoutUpdateStatusInput = z.input<
  typeof creatorPayoutUpdateStatusInputSchema
>;

export type PlatformMetricsInput = z.input<typeof platformMetricsInputSchema>;
