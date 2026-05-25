import { runFileVerificationJob } from './fileVerification';
import type { FileVerificationJobData } from './fileVerificationJobSchemas';
import { logger } from '../../shared/lib/logger';

/**
 * Dispatcher for the `file-verification` pg-boss queue. Only one kind today
 * (`magicBytes`) — additional kinds (virus scanning, AV-tool scanning) can
 * land here with their own switch branches.
 */
export async function fileVerificationWorker(
  data: FileVerificationJobData,
): Promise<void> {
  switch (data.kind) {
    case 'magicBytes':
      await runFileVerificationJob(data);
      return;
    default:
      logger.warn('file_verification.unknown_job_kind', {
        kind: (data as any).kind,
      });
  }
}
