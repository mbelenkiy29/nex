import nodemailer from 'nodemailer';
import { env } from '../../env';
// bypass-RLS: pg-boss email worker — no per-request RLS context. Also
// checks the recipient's emailUnsubscribedChannels which is user-scoped
// (not per-org).
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { EmailJobData, isUnsubscribable } from './emailSchemas';
import { logger } from '../lib/logger';

export async function emailWorker(data: EmailJobData) {
  const {
    to,
    bcc,
    subject,
    content,
    type = 'HTML',
    channel = 'transactional',
    userId,
  } = data;

  // Validation
  if (!to) {
    throw new Error('to is required');
  }
  if (!subject) {
    throw new Error('subject is required');
  }
  if (!content) {
    throw new Error('content is required');
  }

  // Unsubscribe guard: if this is a user-targeted, unsubscribable channel
  // and the user has opted out, drop the send silently. Always-send
  // channels (auth, transactional) bypass this check entirely.
  if (userId && isUnsubscribable(channel)) {
    const user = await prismaDangerouslyBypassRLS.user.findUnique({
      where: { id: userId },
      select: { emailUnsubscribedChannels: true },
    });
    if (user?.emailUnsubscribedChannels.includes(channel)) {
      logger.info('email.delivery.suppressed', {
        userId,
        channel,
        reason: 'unsubscribed',
      });
      return { success: true, suppressed: true, reason: 'unsubscribed' };
    }
  }

  const payload: {
    from: string;
    to: string;
    subject: string;
    bcc?: string | string[];
    html?: string;
    text?: string;
  } = {
    from: env.EMAIL_FROM || '',
    to,
    subject,
  };

  if (bcc) {
    payload.bcc = bcc;
  }
  if (type === 'HTML') {
    payload.html = content;
  } else {
    payload.text = content;
  }

  // Check if email is configured
  if (!env.EMAIL_SMTP_HOST || !env.EMAIL_FROM) {
    if (env.NODE_ENV !== 'test') {
      logger.warn('email.delivery.skipped', {
        reason: 'smtp_not_configured',
        channel,
        userId,
        type,
      });
    }
    return { success: true, skipped: true, reason: 'Email not configured' };
  }

  logger.debug('email.delivery.started', {
    channel,
    userId,
    type,
    hasBcc: Boolean(bcc),
  });

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_SMTP_HOST,
    port: parseInt(env.EMAIL_SMTP_PORT || '587'),
    auth: {
      user: env.EMAIL_SMTP_USER,
      pass: env.EMAIL_SMTP_PASSWORD,
    },
  });

  // Send email
  const info = await transporter.sendMail(payload);
  logger.info('email.delivery.sent', {
    channel,
    userId,
    messageId: info.messageId,
  });

  return {
    success: true,
    messageId: info.messageId,
    response: info.response,
  };
}
