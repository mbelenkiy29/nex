export const ONE_ON_ONE_QUEUE = 'one-on-one';

// Cron expressions for the recurring sweepers, kept here so workers.ts has a
// single import.
export const ONE_ON_ONE_AUTO_COMPLETE_CRON = '*/15 * * * *';
export const ONE_ON_ONE_RELEASE_HOLDS_CRON = '*/5 * * * *';

/**
 * Per-session reminders are scheduled with `boss.send(..., { startAfter })`
 * at confirmation time. Sweepers run on a cron — `autoComplete` flips
 * finished sessions to `completed`, `releaseExpiredHold` releases unpaid
 * holds whose 30-minute checkout window has lapsed (backstop for missed
 * Stripe webhooks).
 */
export type OneOnOneJobKind =
  | 'reminder24h'
  | 'reminder1h'
  | 'autoComplete'
  | 'releaseExpiredHold';

export interface OneOnOneJobData {
  kind: OneOnOneJobKind;
  sessionId?: string;
  locale?: string;
}
