import type { Context, Next } from 'hono';
import { dictionary } from '../../translation/en/en';
import {
  consumeRateLimit,
  extractRateLimitIp,
  rateLimitProfiles,
} from './rateLimiter';
import { hashForLogging } from './logger';

export function publicRouteRateLimiter(opts: {
  windowMs: number;
  max: number;
  routeKey: string;
}) {
  return async function rateLimitMiddleware(c: Context, next: Next) {
    const key = `rate:public:${opts.routeKey}:ip:${hashForLogging(
      extractRateLimitIp(c),
    )}`;
    const result = await consumeRateLimit(key, {
      routeKey: `${rateLimitProfiles.publicRead.routeKeyPrefix}:${opts.routeKey}`,
      windowMs: opts.windowMs,
      max: opts.max,
    });

    if (!result.allowed) {
      return c.json(
        { message: dictionary.shared.errors.tooManyRequests },
        429,
        { 'Retry-After': String(result.retryAfterSeconds) },
      );
    }
    await next();
  };
}
