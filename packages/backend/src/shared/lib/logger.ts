import { createHash } from 'node:crypto';
import { env } from '../../env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogMetadata = Record<string, unknown>;

const sensitiveKeyPattern =
  /(authorization|cookie|password|secret|token|apikey|api_key|privatekey|private_key|signature|p256dh|endpoint|vapid|prompt|content|body|rawbody)/i;

function shouldLog(level: LogLevel) {
  if (env.NODE_ENV === 'test') {
    return level === 'warn' || level === 'error';
  }

  if (env.NODE_ENV === 'production') {
    return level !== 'debug';
  }

  return true;
}

function normalizeForLog(value: unknown, depth = 0): unknown {
  if (depth > 4) {
    return '[depth-exceeded]';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return errorToLogMetadata(value);
  }

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => normalizeForLog(item, depth + 1));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        sensitiveKeyPattern.test(key)
          ? '[redacted]'
          : normalizeForLog(item, depth + 1),
      ]),
    );
  }

  if (typeof value === 'string' && value.length > 800) {
    return `${value.slice(0, 800)}...`;
  }

  return value;
}

function write(level: LogLevel, event: string, metadata?: LogMetadata) {
  if (!shouldLog(level)) {
    return;
  }

  const normalized = metadata ? normalizeForLog(metadata) : undefined;

  if (env.NODE_ENV === 'production') {
    console[level](
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        event,
        ...(normalized && typeof normalized === 'object' ? normalized : {}),
      }),
    );
    return;
  }

  if (normalized) {
    console[level](`[${level}] ${event}`, normalized);
  } else {
    console[level](`[${level}] ${event}`);
  }
}

export const logger = {
  debug: (event: string, metadata?: LogMetadata) =>
    write('debug', event, metadata),
  info: (event: string, metadata?: LogMetadata) =>
    write('info', event, metadata),
  warn: (event: string, metadata?: LogMetadata) =>
    write('warn', event, metadata),
  error: (event: string, metadata?: LogMetadata) =>
    write('error', event, metadata),
};

export function errorToLogMetadata(error: unknown): LogMetadata {
  if (error instanceof Error) {
    const codedError = error as Error & { code?: unknown };
    return {
      name: error.name,
      message: error.message,
      code: codedError.code,
      ...(env.NODE_ENV !== 'production' ? { stack: error.stack } : {}),
    };
  }

  return { message: String(error) };
}

export function durationMs(startedAt: number) {
  return Date.now() - startedAt;
}

export function hashForLogging(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}
