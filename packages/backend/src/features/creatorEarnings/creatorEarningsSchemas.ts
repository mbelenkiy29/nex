import { z } from 'zod';

// Optional `status` filter; the controller validates it against the known
// CreatorPayout status values before passing to Prisma.
export const creatorEarningsListQuerySchema = z.object({
  status: z.enum(['pending', 'paid', 'cancelled']).optional(),
  take: z.coerce.number().int().min(1).max(200).optional(),
  skip: z.coerce.number().int().min(0).optional(),
});

// Length cap mirrors what the admin reads on the payout queue — a paragraph
// of payout instructions, not an essay. `null` clears the field.
export const creatorEarningsPayoutMethodInputSchema = z.object({
  payoutMethodNote: z.string().max(2000).nullable(),
});
