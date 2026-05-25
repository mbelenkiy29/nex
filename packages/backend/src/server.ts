import { serve } from '@hono/node-server';
import app from './app';
import { env } from './env';
import { dictionaryIntegrityCheck } from './translation/dictionaryIntegrityCheck';
import { logger } from './shared/lib/logger';

const port = env.PORT || '3011';

dictionaryIntegrityCheck();

logger.info('server.starting', { port });

serve({
  fetch: app.fetch,
  port: Number(port),
});
