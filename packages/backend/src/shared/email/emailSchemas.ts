export const EMAIL_QUEUE = 'email';

/**
 * Email channels classify the *kind* of email so unsubscribe preferences
 * can be honored at send time. `auth` and `transactional` are never honored
 * (legal/security notices always send); anything else is gated by
 * `User.emailUnsubscribedChannels`.
 */
export const EMAIL_CHANNELS = [
  'auth',
  'transactional',
  'marketing',
  'digest',
  'productUpdates',
] as const;

export type EmailChannel = (typeof EMAIL_CHANNELS)[number];

export const ALWAYS_SEND_CHANNELS: ReadonlySet<EmailChannel> = new Set<EmailChannel>([
  'auth',
  'transactional',
]);

export function isUnsubscribable(channel: EmailChannel): boolean {
  return !ALWAYS_SEND_CHANNELS.has(channel);
}

export interface EmailJobData {
  to: string;
  bcc?: string | string[] | null;
  subject: string;
  content: string;
  type?: 'HTML' | 'TEXT';

  /**
   * Classifies the email for unsubscribe handling. Defaults to
   * 'transactional' when omitted (always-send) — that's the safe default
   * for legacy callers. New call sites should set this explicitly.
   */
  channel?: EmailChannel;

  /**
   * When set + channel is unsubscribable, the worker looks up the user's
   * `emailUnsubscribedChannels` and silently drops the send if the user
   * has opted out. Pass it for any user-targeted email.
   */
  userId?: string;
}
