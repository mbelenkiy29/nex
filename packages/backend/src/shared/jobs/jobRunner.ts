import { durationMs, errorToLogMetadata, logger } from '../lib/logger';

type JobLike<T> = {
  id: string;
  data: T;
  retrycount?: number;
  retryCount?: number;
};

function summarizeResult(result: unknown) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    return undefined;
  }

  const source = result as Record<string, unknown>;
  const allowedKeys = [
    'success',
    'suppressed',
    'skipped',
    'reason',
    'memberCount',
    'successCount',
    'failureCount',
    'processed',
    'failed',
  ];

  return Object.fromEntries(
    allowedKeys.filter((key) => key in source).map((key) => [key, source[key]]),
  );
}

export async function runPgBossJob<T>(
  queueName: string,
  job: JobLike<T>,
  handler: (data: T) => Promise<unknown>,
) {
  const startedAt = Date.now();
  const baseMetadata = {
    queueName,
    jobId: job.id,
    retryCount: job.retrycount ?? job.retryCount,
  };

  logger.info('pgboss.job.started', baseMetadata);

  try {
    const result = await handler(job.data);
    logger.info('pgboss.job.completed', {
      ...baseMetadata,
      durationMs: durationMs(startedAt),
      result: summarizeResult(result),
    });
    return result;
  } catch (error) {
    logger.error('pgboss.job.failed', {
      ...baseMetadata,
      durationMs: durationMs(startedAt),
      error: errorToLogMetadata(error),
    });
    throw error;
  }
}
