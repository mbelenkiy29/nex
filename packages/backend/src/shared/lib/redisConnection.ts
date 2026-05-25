import IORedis from 'ioredis';
import { env } from '../../env';
import { logger } from './logger';

let connectionInstance: IORedis | null = null;

function createRedisConnection(): IORedis | null {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!connectionInstance) {
    connectionInstance = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    connectionInstance.on('error', (error) => {
      logger.error('redis.connection.error', { error });
    });

    connectionInstance.on('connect', () => {
      logger.info('redis.connection.connected');
    });
  }

  return connectionInstance;
}

export const redisConnection = createRedisConnection() || ({} as IORedis);

export async function isRedisAvailable(): Promise<boolean> {
  if (!env.REDIS_URL) {
    return false;
  }

  const conn = createRedisConnection();
  if (!conn) {
    return false;
  }

  try {
    await conn.ping();
    return true;
  } catch {
    return false;
  }
}
