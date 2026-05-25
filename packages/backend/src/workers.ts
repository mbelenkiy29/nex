import { getPgBoss, stopPgBoss, scheduleJob } from './shared/jobs/pgBoss';
import { emailWorker } from './shared/email/emailWorker';
import { EMAIL_QUEUE, type EmailJobData } from './shared/email/emailSchemas';
import { notificationWorker } from './features/notification/notificationWorker';
import {
  NOTIFICATION_QUEUE,
  type NotificationJobData,
} from './features/notification/notificationSchemas';
import { oneOnOneWorker } from './features/oneOnOneCall/oneOnOneWorker';
import {
  ONE_ON_ONE_QUEUE,
  ONE_ON_ONE_AUTO_COMPLETE_CRON,
  ONE_ON_ONE_RELEASE_HOLDS_CRON,
  type OneOnOneJobData,
} from './features/oneOnOneCall/oneOnOneJobSchemas';
import { userAccountWorker } from './features/userAccount/userAccountWorker';
import {
  USER_ACCOUNT_QUEUE,
  USER_ACCOUNT_HARD_DELETE_CRON,
  USER_ACCOUNT_TOKEN_CLEANUP_CRON,
  type UserAccountJobData,
} from './features/userAccount/userAccountJobSchemas';
import { fileVerificationWorker } from './features/file/fileVerificationWorker';
import {
  FILE_VERIFICATION_QUEUE,
  type FileVerificationJobData,
} from './features/file/fileVerificationJobSchemas';
import { courseAiWorker } from './features/courseAi/courseAiWorker';
import {
  COURSE_AI_QUEUE,
  type CourseAiGenerationJobData,
} from './features/courseAi/courseAiJobSchemas';
import { studentStudyReminderWorker } from './features/studentExperience/studentReminderWorker';
import {
  STUDENT_STUDY_REMINDER_CRON,
  STUDENT_STUDY_REMINDER_QUEUE,
  type StudentStudyReminderJobData,
} from './features/studentExperience/studentReminderJobSchemas';
import type { Job } from 'pg-boss';
import { logger } from './shared/lib/logger';
import { runPgBossJob } from './shared/jobs/jobRunner';

async function startWorkers() {
  logger.info('workers.starting');
  // getPgBoss() creates all queues on initialization
  const boss = await getPgBoss();

  const workQueue = async <T>(
    queueName: string,
    handler: (data: T) => Promise<unknown>,
  ) => {
    await boss.work<T>(queueName, async ([job]: Job<T>[]) => {
      if (!job) {
        logger.warn('pgboss.job.missing_payload', { queueName });
        return;
      }

      await runPgBossJob(queueName, job, handler);
    });
  };

  await workQueue<EmailJobData>(EMAIL_QUEUE, emailWorker);
  await workQueue<NotificationJobData>(NOTIFICATION_QUEUE, notificationWorker);
  await workQueue<OneOnOneJobData>(ONE_ON_ONE_QUEUE, oneOnOneWorker);
  await workQueue<UserAccountJobData>(USER_ACCOUNT_QUEUE, userAccountWorker);
  await workQueue<FileVerificationJobData>(
    FILE_VERIFICATION_QUEUE,
    fileVerificationWorker,
  );
  await workQueue<CourseAiGenerationJobData>(COURSE_AI_QUEUE, courseAiWorker);
  await workQueue<StudentStudyReminderJobData>(
    STUDENT_STUDY_REMINDER_QUEUE,
    studentStudyReminderWorker,
  );

  // Recurring 1:1 sweepers — auto-complete past-end sessions and release
  // abandoned paid holds. `boss.schedule` is idempotent so re-running this on
  // every worker boot is fine.
  await scheduleJob(ONE_ON_ONE_QUEUE, ONE_ON_ONE_AUTO_COMPLETE_CRON, {
    kind: 'autoComplete',
  });
  await scheduleJob(ONE_ON_ONE_QUEUE, ONE_ON_ONE_RELEASE_HOLDS_CRON, {
    kind: 'releaseExpiredHold',
  });

  // Daily PII-anonymization sweep for accounts whose 14-day grace window has
  // elapsed AND who confirmed via email.
  await scheduleJob(USER_ACCOUNT_QUEUE, USER_ACCOUNT_HARD_DELETE_CRON, {
    kind: 'hardDeleteSweep',
  });

  // Daily token-table cleanup — drops consumed/expired EmailUnsubscribeToken
  // and AccountDeletionConfirmationToken rows older than 30 days. Closes
  // audit finding #20.
  await scheduleJob(USER_ACCOUNT_QUEUE, USER_ACCOUNT_TOKEN_CLEANUP_CRON, {
    kind: 'tokenCleanup',
  });

  await scheduleJob(STUDENT_STUDY_REMINDER_QUEUE, STUDENT_STUDY_REMINDER_CRON, {
    kind: 'smartSweep',
  });

  logger.info('workers.started');

  const gracefulShutdown = async (signal: string) => {
    logger.info('workers.shutdown_requested', { signal });
    await stopPgBoss();
    process.exit(0);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  if (process.platform === 'win32') {
    process.on('SIGBREAK', () => gracefulShutdown('SIGBREAK'));
  }
}

startWorkers().catch((error) => {
  logger.error('workers.start_failed', { error });
});
