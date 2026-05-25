import { Locale } from '../../translation/locales';
import {
  runAccountHardDeleteSweep,
  runTokenCleanup,
} from './userAccountDeletionService';
import { runDataExportJob } from './userAccountDataExportService';
import type { UserAccountJobData } from './userAccountJobSchemas';

/**
 * Dispatcher for the `user-account` pg-boss queue. Per-request `dataExport`
 * jobs carry an `exportId`; the daily `hardDeleteSweep` is fired by
 * `boss.schedule` with no payload. Every branch is idempotent — a
 * re-fired job for an already-completed export is a no-op.
 */
export async function userAccountWorker(
  data: UserAccountJobData,
): Promise<void> {
  switch (data.kind) {
    case 'dataExport': {
      if (!data.exportId) return;
      const locale = (data.locale ?? 'en') as Locale;
      await runDataExportJob(data.exportId, locale);
      return;
    }
    case 'hardDeleteSweep':
      await runAccountHardDeleteSweep();
      return;
    case 'tokenCleanup': {
      const { emailUnsubscribeTokens, accountDeletionTokens } =
        await runTokenCleanup();
      console.log(
        `userAccountWorker: tokenCleanup removed ${emailUnsubscribeTokens} email-unsubscribe + ${accountDeletionTokens} deletion tokens`,
      );
      return;
    }
    default:
      console.warn(
        `userAccountWorker: unknown job kind ${(data as any).kind}`,
      );
  }
}
