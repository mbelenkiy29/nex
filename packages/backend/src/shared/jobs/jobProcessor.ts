import { getPgBoss } from './pgBoss';
import { emailWorker } from '../email/emailWorker';
import { EMAIL_QUEUE, EmailJobData } from '../email/emailSchemas';
import { notificationWorker } from '../../features/notification/notificationWorker';
import {
  NOTIFICATION_QUEUE,
  NotificationJobData,
} from '../../features/notification/notificationSchemas';
import { oneOnOneWorker } from '../../features/oneOnOneCall/oneOnOneWorker';
import {
  ONE_ON_ONE_QUEUE,
  OneOnOneJobData,
} from '../../features/oneOnOneCall/oneOnOneJobSchemas';
import { studentStudyReminderWorker } from '../../features/studentExperience/studentReminderWorker';
import {
  STUDENT_STUDY_REMINDER_QUEUE,
  StudentStudyReminderJobData,
} from '../../features/studentExperience/studentReminderJobSchemas';
import { runPgBossJob } from './jobRunner';

async function processQueue<T>(
  queueName: string,
  handler: (data: T) => Promise<unknown>,
  batchSize: number,
): Promise<{ processed: number; failed: number }> {
  const boss = await getPgBoss();
  let processed = 0;
  let failed = 0;

  const jobs = await boss.fetch<T>(queueName, { batchSize });
  if (!jobs) return { processed, failed };

  for (const job of jobs) {
    try {
      await runPgBossJob(queueName, job, handler);
      await boss.complete(queueName, job.id);
      processed++;
    } catch (e) {
      const errorData = e instanceof Error ? { message: e.message } : {};
      await boss.fail(queueName, job.id, errorData);
      failed++;
    }
  }

  return { processed, failed };
}

export async function processJobs(batchSize = 10) {
  const emailResult = await processQueue<EmailJobData>(
    EMAIL_QUEUE,
    emailWorker,
    batchSize,
  );
  const notificationResult = await processQueue<NotificationJobData>(
    NOTIFICATION_QUEUE,
    notificationWorker,
    batchSize,
  );
  const oneOnOneResult = await processQueue<OneOnOneJobData>(
    ONE_ON_ONE_QUEUE,
    oneOnOneWorker,
    batchSize,
  );
  const reminderResult = await processQueue<StudentStudyReminderJobData>(
    STUDENT_STUDY_REMINDER_QUEUE,
    studentStudyReminderWorker,
    batchSize,
  );

  return {
    processed:
      emailResult.processed +
      notificationResult.processed +
      oneOnOneResult.processed +
      reminderResult.processed,
    failed:
      emailResult.failed +
      notificationResult.failed +
      oneOnOneResult.failed +
      reminderResult.failed,
  };
}
