export const USER_ACCOUNT_QUEUE = 'user-account';

/**
 * Daily sweep that hard-deletes (PII-anonymizes) any user whose 14-day
 * deletion grace window has elapsed. Idempotent: rows already at
 * `deletedAt != null` are skipped.
 */
export const USER_ACCOUNT_HARD_DELETE_CRON = '0 4 * * *';

/**
 * Daily cleanup of consumed/expired token rows (EmailUnsubscribeToken +
 * AccountDeletionConfirmationToken) older than 30 days. Closes audit
 * finding #20 — without this, the token tables grow unbounded. Offset 15 min
 * from the hard-delete cron so they don't lock-contend on shared rows.
 */
export const USER_ACCOUNT_TOKEN_CLEANUP_CRON = '15 4 * * *';

/**
 * `dataExport` is per-request (one job per `UserDataExport` row).
 * `hardDeleteSweep` + `tokenCleanup` are recurring crons.
 */
export type UserAccountJobKind =
  | 'dataExport'
  | 'hardDeleteSweep'
  | 'tokenCleanup';

export interface UserAccountJobData {
  kind: UserAccountJobKind;
  /** Required for `dataExport`. The id of the `UserDataExport` row. */
  exportId?: string;
  /** Locale to use for any email content the worker may emit. */
  locale?: string;
}
