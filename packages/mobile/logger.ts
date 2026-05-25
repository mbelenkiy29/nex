declare const __DEV__: boolean | undefined;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogMetadata = Record<string, unknown>;

const sensitiveKeyPattern =
  /(authorization|cookie|password|secret|token|apikey|api_key|privatekey|private_key|signature|p256dh|endpoint|vapid|prompt|content|body|rawbody)/i;

function shouldLog(level: LogLevel) {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return true;
  }

  return level === 'warn' || level === 'error';
}

function normalizeForLog(value: unknown, depth = 0): unknown {
  if (depth > 4) {
    return '[depth-exceeded]';
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      ...(typeof __DEV__ !== 'undefined' && __DEV__
        ? { stack: value.stack }
        : {}),
    };
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

  if (metadata) {
    console[level](`[${level}] ${event}`, normalizeForLog(metadata));
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
