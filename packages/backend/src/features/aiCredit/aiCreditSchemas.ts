import { z } from 'zod';
import { pricingCheckoutMetadataSchema } from '../pricing/pricingSchemas';

export const aiCreditPackManageInputSchema = z.object({
  key: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  tokenAmount: z.coerce.number().int().min(1),
  bonusTokenAmount: z.coerce.number().int().min(0).default(0),
  priceCents: z.coerce.number().int().min(1),
  currency: z.string().trim().length(3).toUpperCase().default('USD'),
  stripePriceId: z.string().trim().max(255).optional().nullable(),
  stripeProductId: z.string().trim().max(255).optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(1000),
});

export const aiCreditPackUpdateInputSchema =
  aiCreditPackManageInputSchema.partial();

export const aiCreditCheckoutInputSchema = pricingCheckoutMetadataSchema
  .partial()
  .default({});

export const aiCreditCheckoutOutputSchema = z.object({
  url: z.string(),
});
