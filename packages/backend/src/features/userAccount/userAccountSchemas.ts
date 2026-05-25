import { z } from 'zod';

// The currently-published versions baked into the build. When you update the
// ToS or Privacy copy in `dictionary.legal.*.version`, bump these constants
// to match — they're what gets persisted on every accept.
export const CURRENT_TERMS_VERSION = '2026-05-23';
export const CURRENT_PRIVACY_VERSION = '2026-05-23';

// COPPA: no accounts for under-13 in v1.
export const MINIMUM_SIGNUP_AGE = 13;

// Grace window between deletion request and hard delete. The user can
// cancel at any point inside this window. Tuned long enough to recover
// from accidental clicks; short enough that legal-retention obligations
// stay intact.
export const DELETION_GRACE_DAYS = 14;
export const DELETION_TOKEN_TTL_HOURS = 24;

// Hard cap on how often a user can request a fresh export. Generates a
// large zip; throttle is friendly + cost control.
export const DATA_EXPORT_RATE_LIMIT_HOURS = 24;

// Signed-download URLs are intentionally short-lived to keep blast radius
// small if a link leaks.
export const DATA_EXPORT_SIGNED_URL_TTL_SECONDS = 15 * 60;

// Confirmation tokens are 32 random bytes, base64url-encoded.
export const CONFIRMATION_TOKEN_BYTES = 32;

// ---- Inputs ---------------------------------------------------------------

export const accountDeletionRequestSchema = z.object({}).strict();
export type AccountDeletionRequestInput = z.infer<
  typeof accountDeletionRequestSchema
>;

export const accountDeletionConfirmSchema = z
  .object({
    token: z.string().min(20).max(200),
  })
  .strict();
export type AccountDeletionConfirmInput = z.infer<
  typeof accountDeletionConfirmSchema
>;

export const dataExportRequestSchema = z.object({}).strict();
export type DataExportRequestInput = z.infer<typeof dataExportRequestSchema>;

export const dataExportDownloadParamsSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

export const emailPreferencesSchema = z
  .object({
    marketing: z.boolean().optional(),
    digest: z.boolean().optional(),
    productUpdates: z.boolean().optional(),
  })
  .strict();
export type EmailPreferencesInput = z.infer<typeof emailPreferencesSchema>;

export const cookieConsentSchema = z
  .object({
    analytics: z.boolean(),
    marketing: z.boolean(),
  })
  .strict();
export type CookieConsentInput = z.infer<typeof cookieConsentSchema>;

// ---- Public unsubscribe query (no auth — token IS the auth) ---------------

export const emailUnsubscribeQuerySchema = z
  .object({
    token: z.string().min(20).max(200),
    channels: z.string().optional(), // comma-separated, e.g. "marketing,digest"
  })
  .strict();
