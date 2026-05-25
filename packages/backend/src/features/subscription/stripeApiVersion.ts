import type Stripe from 'stripe';

/**
 * Stripe API version pinned for this codebase.
 *
 * This is intentionally kept at an older version than the installed SDK's
 * default. Bumping it is a deliberate API migration (Stripe webhook and
 * response payload shapes can change between versions) and must be done as a
 * separate, reviewed change — not as part of a type-error cleanup.
 *
 * The `as unknown as` cast is required because the SDK types `apiVersion` as a
 * single exact literal (its own latest version); we are deliberately overriding
 * that to pin a known-good version.
 */
export const STRIPE_API_VERSION =
  '2025-10-29.clover' as unknown as Stripe.LatestApiVersion;
