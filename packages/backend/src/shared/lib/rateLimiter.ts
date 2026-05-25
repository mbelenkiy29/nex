import type { Context } from 'hono';
import { env } from '../../env';
import type { AppContext } from '../controller/appContext';
import { Error429 } from '../errors/Error429';
import { hashForLogging } from './logger';
import { logger } from './logger';
import { isRedisAvailable, redisConnection } from './redisConnection';

type Bucket = { count: number; resetAt: number };

export type RateLimitScope = 'ip' | 'user' | 'userOrIp';

export type RateLimitOptions = {
  routeKey: string;
  windowMs: number;
  max: number;
  scope: RateLimitScope;
};

export type RateLimitProfile = Omit<RateLimitOptions, 'routeKey'> & {
  routeKeyPrefix: string;
};

const memoryBuckets = new Map<string, Bucket>();
let lastSweepAt = Date.now();
const SWEEP_INTERVAL_MS = 60_000;

function envNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const rateLimitProfiles = {
  ai: {
    routeKeyPrefix: 'ai',
    windowMs: 60_000,
    max: envNumber(env.RATE_LIMIT_AI_PER_USER_PER_MINUTE, 20),
    scope: 'userOrIp',
  },
  aiPoll: {
    routeKeyPrefix: 'ai-poll',
    windowMs: 60_000,
    max: envNumber(env.RATE_LIMIT_AI_POLL_PER_USER_PER_MINUTE, 120),
    scope: 'userOrIp',
  },
  upload: {
    routeKeyPrefix: 'upload',
    windowMs: 60_000,
    max: envNumber(env.RATE_LIMIT_UPLOAD_PER_USER_PER_MINUTE, 30),
    scope: 'userOrIp',
  },
  notification: {
    routeKeyPrefix: 'notification',
    windowMs: 60_000,
    max: envNumber(env.RATE_LIMIT_NOTIFICATION_PER_USER_PER_MINUTE, 20),
    scope: 'user',
  },
  courseCreate: {
    routeKeyPrefix: 'course-create',
    windowMs: 86_400_000,
    max: envNumber(env.RATE_LIMIT_COURSE_CREATE_PER_USER_PER_DAY, 20),
    scope: 'user',
  },
  report: {
    routeKeyPrefix: 'report',
    windowMs: 3_600_000,
    max: envNumber(env.RATE_LIMIT_REPORT_PER_USER_PER_HOUR, 10),
    scope: 'userOrIp',
  },
  publicRead: {
    routeKeyPrefix: 'public-read',
    windowMs: 60_000,
    max: envNumber(env.RATE_LIMIT_PUBLIC_PER_IP_PER_MINUTE, 300),
    scope: 'userOrIp',
  },
} satisfies Record<string, RateLimitProfile>;

export function extractRateLimitIp(c: Context): string {
  const xff = c.req.header('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() || 'unknown';
  return c.req.header('x-real-ip') || 'unknown';
}

export function rateLimitFromProfile(
  profile: RateLimitProfile,
  routeKey: string,
): RateLimitOptions {
  return {
    routeKey: `${profile.routeKeyPrefix}:${routeKey}`,
    windowMs: profile.windowMs,
    max: profile.max,
    scope: profile.scope,
  };
}

export async function rateLimitRequest(
  c: Context,
  context: AppContext | undefined,
  options: RateLimitOptions,
) {
  const identity = rateLimitIdentity(c, context, options.scope);
  const key = `rate:${options.routeKey}:${identity.kind}:${hashForLogging(
    identity.value,
  )}`;
  const result = await consumeRateLimit(key, options);

  if (result.allowed) {
    return;
  }

  logger.warn('rate_limit.exceeded', {
    routeKey: options.routeKey,
    identityKind: identity.kind,
    retryAfterSeconds: result.retryAfterSeconds,
    max: options.max,
    windowMs: options.windowMs,
  });

  throw new Error429(
    context?.dictionary.shared.errors.tooManyRequests,
    result.retryAfterSeconds,
  );
}

export async function consumeRateLimit(
  key: string,
  options: Pick<RateLimitOptions, 'windowMs' | 'max' | 'routeKey'>,
): Promise<{ allowed: true } | { allowed: false; retryAfterSeconds: number }> {
  const redisReady = await isRedisAvailable();

  if (redisReady) {
    try {
      const count = await redisConnection.incr(key);
      if (count === 1) {
        await redisConnection.pexpire(key, options.windowMs);
      }
      if (count <= options.max) {
        return { allowed: true };
      }
      const ttl = await redisConnection.pttl(key);
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil(ttl / 1000)),
      };
    } catch (error) {
      logger.error('rate_limit.redis_failed', {
        routeKey: options.routeKey,
        error,
      });
    }
  }

  if (
    env.NODE_ENV === 'production' &&
    env.RATE_LIMIT_REDIS_REQUIRED_IN_PRODUCTION
  ) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(options.windowMs / 1000)),
    };
  }

  return consumeMemoryRateLimit(key, options);
}

function rateLimitIdentity(
  c: Context,
  context: AppContext | undefined,
  scope: RateLimitScope,
) {
  const userId = context?.currentUser?.id;

  if (scope === 'user' && userId) {
    return { kind: 'user', value: userId };
  }

  if (scope === 'userOrIp' && userId) {
    return { kind: 'user', value: userId };
  }

  return { kind: 'ip', value: extractRateLimitIp(c) };
}

function consumeMemoryRateLimit(
  key: string,
  options: Pick<RateLimitOptions, 'windowMs' | 'max'>,
) {
  const now = Date.now();
  sweepMemoryBuckets(now);

  let bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + options.windowMs };
    memoryBuckets.set(key, bucket);
  }

  bucket.count++;

  if (bucket.count <= options.max) {
    return { allowed: true as const };
  }

  return {
    allowed: false as const,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

function sweepMemoryBuckets(now: number) {
  if (now - lastSweepAt < SWEEP_INTERVAL_MS) return;
  lastSweepAt = now;
  for (const [key, bucket] of memoryBuckets) {
    if (bucket.resetAt < now) {
      memoryBuckets.delete(key);
    }
  }
}
