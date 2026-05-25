// bypass-RLS: low-level notification helper called from system-level
// paths (Better-Auth hooks, crons, webhooks) that have no RLS context.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { addEmailToQueue } from '../email/emailQueue';

export interface DirectUserNotice {
  title: string;
  message: string;
}

/**
 * Sends an in-app notification + an email directly to one specific user,
 * bypassing `sendNotification`'s org-broadcast pattern. Useful when the
 * sender and recipient may live in different organizations (1:1 sessions,
 * creator payouts, future cross-tenant flows). Writes a per-user
 * `Notification` row with type `'custom'` so the existing notification UI
 * renders it unchanged, and queues a plain HTML email.
 *
 * Best-effort: any failure is logged but never re-thrown — a notification
 * failure must not roll back the work that triggered it (a booking, a
 * payout state change, etc.).
 */
export async function notifyUserDirect(
  targetUserId: string | null | undefined,
  notice: DirectUserNotice,
): Promise<void> {
  if (!targetUserId) {
    return;
  }
  try {
    const member = await prismaDangerouslyBypassRLS.member.findFirst({
      where: { userId: targetUserId },
      select: { organizationId: true },
    });
    if (!member) {
      return;
    }

    await prismaDangerouslyBypassRLS.notification.create({
      data: {
        userId: targetUserId,
        organizationId: member.organizationId,
        type: 'custom',
        roles: [],
        payload: {
          type: 'custom',
          title: notice.title.slice(0, 200),
          message: notice.message.slice(0, 1000),
        },
      },
    });

    const user = await prismaDangerouslyBypassRLS.user.findUnique({
      where: { id: targetUserId },
      select: { email: true },
    });
    if (user?.email) {
      await addEmailToQueue({
        to: user.email,
        subject: notice.title,
        content: `<p>${notice.message}</p>`,
        type: 'HTML',
      });
    }
  } catch (error) {
    console.error('Failed to send per-user notification:', error);
  }
}
