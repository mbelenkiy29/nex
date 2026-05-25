import {
  redisConnection,
  isRedisAvailable,
} from '../../shared/lib/redisConnection';

/**
 * Course Study AI Lock Service
 * Prevents concurrent AI study requests per user (cost control + avoids the
 * student firing several generations at once). Uses a Redis lock with an
 * in-memory fallback. The key prefix is deliberately separate from the
 * chatbot's lock so an open chatbot session does not block a study action.
 */

const LOCK_PREFIX = 'studyai:lock:user:';
const LOCK_TTL = 120; // seconds — study AI calls are short; guards crashed processes

const inMemoryLocks = new Map<string, NodeJS.Timeout>();

export class StudyAiLockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StudyAiLockError';
  }
}

export async function acquireStudyAiLock(userId: string): Promise<void> {
  const lockKey = `${LOCK_PREFIX}${userId}`;
  let acquired: boolean;

  if (await isRedisAvailable()) {
    // SET NX EX — atomic acquire-or-fail with an expiry.
    const result = await redisConnection.set(
      lockKey,
      '1',
      'EX',
      LOCK_TTL,
      'NX',
    );
    acquired = result === 'OK';
  } else if (inMemoryLocks.has(userId)) {
    acquired = false;
  } else {
    const timeout = setTimeout(
      () => inMemoryLocks.delete(userId),
      LOCK_TTL * 1000,
    );
    inMemoryLocks.set(userId, timeout);
    acquired = true;
  }

  if (!acquired) {
    throw new StudyAiLockError(
      'You already have an AI study request in progress. Please wait for it to finish before starting another.',
    );
  }
}

export async function releaseStudyAiLock(userId: string): Promise<void> {
  const lockKey = `${LOCK_PREFIX}${userId}`;

  if (await isRedisAvailable()) {
    await redisConnection.del(lockKey);
  } else {
    const timeout = inMemoryLocks.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      inMemoryLocks.delete(userId);
    }
  }
}
