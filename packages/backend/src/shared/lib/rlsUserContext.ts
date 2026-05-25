import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * Per-request user-id propagation for Row Level Security policies that
 * scope rows by `userId` (CourseStudyPlanItem) or by participant id
 * (OneOnOneSession). The Hono middleware sets the userId once at the top
 * of each request; `$withRLS` reads it and SET LOCALs `app.current_user_id`
 * inside its transaction so the policies fire automatically.
 *
 * Workers / Better-Auth hooks / Stripe webhooks already use
 * `prismaDangerouslyBypassRLS` — they never go through `$withRLS`, so they
 * don't need an ALS entry. Code paths that DO go through `$withRLS`
 * without first establishing the ALS scope will get an undefined userId,
 * which makes the new policies fail-closed (no rows visible). That's the
 * correct default — better to return nothing than to leak.
 *
 * Added 2026-05-23 alongside audit finding #5.
 */
export const rlsUserContext = new AsyncLocalStorage<{ userId?: string }>();

/**
 * Convenience wrapper for places that want to opt-in to the per-user RLS
 * scope outside the standard request-middleware path (e.g. a script that
 * needs to act as a specific user). Most call sites should NOT use this —
 * the Hono middleware sets the scope automatically for every request.
 */
export function runWithRlsUser<T>(
  userId: string | null | undefined,
  fn: () => T | Promise<T>,
): T | Promise<T> {
  return rlsUserContext.run({ userId: userId ?? undefined }, fn);
}
