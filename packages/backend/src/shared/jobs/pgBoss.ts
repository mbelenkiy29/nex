import { PgBoss } from 'pg-boss';
import { env } from '../../env';
import { EMAIL_QUEUE } from '../email/emailSchemas';
import { NOTIFICATION_QUEUE } from '../../features/notification/notificationSchemas';
import { ONE_ON_ONE_QUEUE } from '../../features/oneOnOneCall/oneOnOneJobSchemas';
import { USER_ACCOUNT_QUEUE } from '../../features/userAccount/userAccountJobSchemas';
import { FILE_VERIFICATION_QUEUE } from '../../features/file/fileVerificationJobSchemas';
import { COURSE_AI_QUEUE } from '../../features/courseAi/courseAiJobSchemas';
import { STUDENT_STUDY_REMINDER_QUEUE } from '../../features/studentExperience/studentReminderJobSchemas';
import { logger } from '../lib/logger';

let boss: PgBoss | null = null;
let starting: Promise<PgBoss> | null = null;

// Queue configuration - pg-boss v10+ requires explicit queue creation.
//
// Transient failures (e.g. an SMTP timeout) are retried a few times with
// exponential backoff so a brief outage does not permanently drop a job such
// as a verification or password-reset email. Handlers should still tolerate
// the occasional re-run (an extra email is far less harmful than a lost one).
const QUEUE_CONFIG = {
  retryLimit: 3,
  retryDelay: 60, // seconds before the first retry
  retryBackoff: true, // exponential backoff between subsequent retries
};

// All queues that need to be created on startup. Adding a new pg-boss
// queue requires touching this list — `boss.send(queueName, …)` errors
// with "Queue X does not exist" otherwise, even if `workers.ts` has a
// matching `boss.work()` (the work-side creates the queue lazily but
// the send-side doesn't).
const QUEUES = [
  EMAIL_QUEUE,
  NOTIFICATION_QUEUE,
  ONE_ON_ONE_QUEUE,
  USER_ACCOUNT_QUEUE,
  FILE_VERIFICATION_QUEUE,
  COURSE_AI_QUEUE,
  STUDENT_STUDY_REMINDER_QUEUE,
];

export async function getPgBoss(): Promise<PgBoss> {
  if (boss) return boss;
  if (starting) return starting;

  starting = (async () => {
    const instance = new PgBoss({
      // PgBoss require a privilege connection for creating queues
      connectionString: env.DATABASE_MIGRATION_URL,
      schema: env.DATABASE_SCHEMA_JOBS,
    });

    // Must add error listener before start() to prevent unhandled exceptions
    instance.on('error', (error) => {
      logger.error('pgboss.client.error', { error });
    });

    await instance.start();

    // Create all queues on startup (idempotent - safe if already exists)
    for (const queue of QUEUES) {
      await createQueueIfNotExists(instance, queue);
    }

    boss = instance;
    return boss;
  })();

  return starting;
}

async function createQueueIfNotExists(
  instance: PgBoss,
  name: string,
): Promise<void> {
  try {
    await instance.createQueue(name, QUEUE_CONFIG);
  } catch (error) {
    // Queue already exists - expected on subsequent startups
    if (error instanceof Error && error.message.includes('already exists')) {
      return;
    }
    throw error;
  }
}

export async function stopPgBoss(): Promise<void> {
  if (boss) {
    await boss.stop();
    boss = null;
    starting = null;
  }
}

export async function scheduleJob(name: string, cron: string, data?: object) {
  const b = await getPgBoss();
  return b.schedule(name, cron, data ?? {});
}
