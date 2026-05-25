import { z } from 'zod';
import { fileUploadedSchema } from '../file/fileSchemas';

export const creatorApplicationStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
]);

export const creatorApplicationIdentityStatusSchema = z.enum([
  'notStarted',
  'needsDocuments',
  'readyForReview',
  'verified',
  'rejected',
]);

export const creatorApplicationIdentityScanStatusSchema = z.enum([
  'notStarted',
  'passed',
  'needsReview',
  'failed',
]);

// Payout onboarding is status-tracking only — there is no Stripe Connect
// integration. The creator drives `notStarted -> inProgress -> submitted`;
// an admin then resolves to `complete` or `actionRequired`.
export const payoutOnboardingStatusSchema = z.enum([
  'notStarted',
  'inProgress',
  'submitted',
  'actionRequired',
  'complete',
]);

// A single credential / certification entry. Stored as a JSON array on the
// application (mirrors `identityDocumentFiles`) — no separate table.
export const creatorCertificationSchema = z.object({
  title: z.string().trim().min(1).max(160),
  issuer: z.string().trim().min(1).max(160),
  issuedYear: z.string().trim().max(16).optional().nullable(),
  credentialUrl: z.string().trim().url().max(2000).optional().nullable(),
  documents: z.array(fileUploadedSchema).max(2).default([]),
});

export const creatorApplicationUpsertInputSchema = z.object({
  legalName: z.string().trim().min(1).max(160),
  displayName: z.string().trim().min(1).max(160),
  professionalTitle: z.string().trim().max(160).optional().nullable(),
  bio: z.string().trim().min(1).max(5000),
  credentials: z.string().trim().min(1).max(5000),
  certifications: z.array(creatorCertificationSchema).max(20).default([]),
  expertise: z.string().trim().min(1).max(2000),
  teachingExperience: z.string().trim().min(1).max(5000),
  audience: z.string().trim().min(1).max(2000),
  courseTopics: z.array(z.string().trim().min(1).max(160)).max(12).default([]),
  sampleLessonPlan: z.string().trim().min(1).max(5000),
  links: z.array(z.string().trim().url()).max(8).default([]),
  payoutContact: z.string().trim().max(2000).optional().nullable(),
  identityDocumentFiles: z.array(fileUploadedSchema).max(3).default([]),
  identityVerificationConsent: z.boolean(),
});

export const creatorApplicationReviewInputSchema = z.object({
  status: creatorApplicationStatusSchema,
  adminNotes: z.string().trim().max(5000).optional().nullable(),
  identityStatus: creatorApplicationIdentityStatusSchema.optional(),
  payoutOnboardingStatus: payoutOnboardingStatusSchema.optional(),
  payoutOnboardingNotes: z.string().trim().max(5000).optional().nullable(),
  nexVerified: z.boolean().optional(),
});

// Creator-driven payout onboarding transitions (no Stripe Connect).
export const payoutOnboardingActionInputSchema = z.object({
  action: z.enum(['begin', 'submit']),
});

export type CreatorCertification = z.output<typeof creatorCertificationSchema>;

export type CreatorApplicationUpsertInput = z.input<
  typeof creatorApplicationUpsertInputSchema
>;

export type CreatorApplicationReviewInput = z.input<
  typeof creatorApplicationReviewInputSchema
>;

export type PayoutOnboardingActionInput = z.input<
  typeof payoutOnboardingActionInputSchema
>;
