import { addEmailToQueue } from '../email/emailQueue';
import type { EmailChannel } from '../email/emailSchemas';
import { logger } from './logger';

export async function sendEmail(
  to: string,
  bcc: string | string[] | null,
  subject: string,
  content: string,
  type: 'HTML' | 'TEXT' = 'HTML',
  options?: { channel?: EmailChannel; userId?: string },
) {
  if (!to) {
    throw new Error('to is required');
  }
  if (!subject) {
    throw new Error('subject is required');
  }
  if (!content) {
    throw new Error('content is required');
  }
  if (!type) {
    throw new Error('type is required');
  }

  const job = await addEmailToQueue({
    to,
    bcc: bcc || undefined,
    subject,
    content,
    type,
    channel: options?.channel,
    userId: options?.userId,
  });

  logger.info('email.queued', {
    jobId: job.id,
    jobName: job.name,
    channel: options?.channel,
    userId: options?.userId,
    hasBcc: Boolean(bcc),
  });

  return {
    queued: true,
    jobId: job.id,
    jobName: job.name,
  };
}
