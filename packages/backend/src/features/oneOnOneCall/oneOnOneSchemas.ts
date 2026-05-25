import { z } from 'zod';

// One recurring weekly availability window. Times are minutes from local
// midnight in the given IANA timezone; endMinute is exclusive.
export const oneOnOneAvailabilityWindowSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    startMinute: z.number().int().min(0).max(1439),
    endMinute: z.number().int().min(1).max(1440),
    timezone: z.string().min(1).max(64),
    isActive: z.boolean().optional(),
  })
  .refine((w) => w.endMinute > w.startMinute, {
    message: 'endMinute must be after startMinute',
  });
export type OneOnOneAvailabilityWindowInput = z.infer<
  typeof oneOnOneAvailabilityWindowSchema
>;

// PUT /availability replaces the whole set of windows in one call.
export const oneOnOneAvailabilityPutSchema = z.object({
  windows: z.array(oneOnOneAvailabilityWindowSchema).max(60),
});

// A bookable offering. `priceCents` is required when `isFree` is false.
export const oneOnOneSessionTypeInputSchema = z
  .object({
    courseId: z.string().uuid().nullable().optional(),
    title: z.string().min(1).max(120),
    description: z.string().max(2000).nullable().optional(),
    durationMinutes: z.number().int().min(10).max(240),
    isFree: z.boolean().default(true),
    priceCents: z.number().int().min(50).max(1_000_000).nullable().optional(),
    currency: z.string().length(3).optional(),
    bufferMinutes: z.number().int().min(0).max(120).default(0),
    minNoticeHours: z.number().int().min(0).max(720).default(12),
  })
  .refine((t) => t.isFree || (t.priceCents != null && t.priceCents > 0), {
    message: 'priceCents is required for a paid session type',
  });
export type OneOnOneSessionTypeInput = z.infer<
  typeof oneOnOneSessionTypeInputSchema
>;

export const oneOnOneSessionTypeUpdateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).nullable().optional(),
  durationMinutes: z.number().int().min(10).max(240).optional(),
  isFree: z.boolean().optional(),
  priceCents: z.number().int().min(50).max(1_000_000).nullable().optional(),
  currency: z.string().length(3).optional(),
  bufferMinutes: z.number().int().min(0).max(120).optional(),
  minNoticeHours: z.number().int().min(0).max(720).optional(),
  isActive: z.boolean().optional(),
});

// GET /courses/:courseId/slots query.
export const oneOnOneSlotsQuerySchema = z.object({
  sessionTypeId: z.string().uuid(),
  from: z.string().datetime(),
  to: z.string().datetime(),
});

// POST /courses/:courseId/bookings — `startUtc` must match an open slot.
export const oneOnOneBookingInputSchema = z.object({
  sessionTypeId: z.string().uuid(),
  startUtc: z.string().datetime(),
});

export const oneOnOneSessionsQuerySchema = z.object({
  role: z.enum(['student', 'instructor']).default('student'),
  scope: z.enum(['upcoming', 'past', 'all']).default('upcoming'),
});

export const oneOnOneCancelInputSchema = z.object({
  reason: z.string().max(500).optional(),
});

export const oneOnOneNoteInputSchema = z.object({
  body: z.string().min(1).max(5000),
  isShared: z.boolean().default(false),
});

export const oneOnOneNoteUpdateSchema = z
  .object({
    body: z.string().min(1).max(5000).optional(),
    isShared: z.boolean().optional(),
  })
  .refine((n) => n.body !== undefined || n.isShared !== undefined, {
    message: 'Nothing to update',
  });

// Student opens a dispute on a completed/no-show paid 1:1.
export const oneOnOneOpenDisputeSchema = z.object({
  reason: z.string().min(10).max(2000),
});

// Platform-admin resolves a dispute either with a refund (full or partial) or
// without one, optionally attaching internal resolution notes.
export const oneOnOneResolveDisputeSchema = z.object({
  resolution: z.enum(['refund', 'noRefund']),
  refundCents: z.number().int().min(50).max(1_000_000).optional(),
  resolutionNotes: z.string().max(2000).optional(),
});
