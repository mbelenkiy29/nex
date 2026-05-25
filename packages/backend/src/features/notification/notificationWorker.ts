import webpush from 'web-push';
import { env } from '../../env';
import { addEmailToQueue } from '../../shared/email/emailQueue';
import { notificationFormatContent } from './notificationFormat';
import { NotificationJobData } from './notificationSchemas';
// bypass-RLS: pg-boss worker runs without an HTTP request, so there is
// no session or per-request org context to set on the RLS client.
// eslint-disable-next-line no-restricted-syntax
import { prismaDangerouslyBypassRLS } from '../../prisma';
import { getDictionary } from '../../translation/getDictionary';
import { Locale } from '../../translation/locales';
import { logger } from '../../shared/lib/logger';

if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:' + (env.EMAIL_FROM || 'noreply@example.com'),
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY,
  );
}

/**
 * Send push notification to mobile device via Expo
 * Uses Expo Access Token for authentication if available (recommended for production)
 * Without token, Expo still allows sending but with rate limits
 */
async function sendMobilePushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<boolean> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (env.EXPO_ACCESS_TOKEN) {
      headers['Authorization'] = `Bearer ${env.EXPO_ACCESS_TOKEN}`;
    }

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: token,
        title,
        body,
        sound: 'default',
        data,
      }),
    });

    const result = (await response.json()) as {
      data?: { status: string; message?: string };
    };

    if (result.data?.status === 'error') {
      logger.warn('notification.delivery.mobile_provider_error', {
        provider: 'expo',
        status: result.data.status,
        providerMessage: result.data.message,
      });
      return false;
    } else {
      logger.info('notification.delivery.mobile_sent', {
        provider: 'expo',
      });
      return true;
    }
  } catch (error) {
    logger.error('notification.delivery.mobile_failed', { error });
    return false;
  }
}

/**
 * Send push notification to web browser
 */
async function sendWebPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<boolean> {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify({
        title,
        body,
        data,
      }),
    );
    logger.info('notification.delivery.web_sent');
    return true;
  } catch (error) {
    logger.error('notification.delivery.web_failed', { error });
    return false;
  }
}

/**
 * Send email and push notifications to a single user
 */
async function sendUserNotification(
  userId: string,
  payload: NotificationJobData['payload'],
  locale: string,
  senderUserId?: string,
  channels?: NotificationJobData['channels'],
): Promise<{ success: boolean; error?: string }> {
  try {
    // If this is the sender, skip email and push (they don't need to be notified via email/push)
    if (senderUserId && userId === senderUserId) {
      logger.debug('notification.delivery.skipped_sender', { userId });
      return { success: true };
    }

    const user = await prismaDangerouslyBypassRLS.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      logger.warn('notification.delivery.user_missing', { userId });
      return { success: false, error: 'User not found' };
    }

    const dictionary = await getDictionary(locale as Locale);

    const content = notificationFormatContent(payload, dictionary);
    const shouldSendEmail = !channels || channels.includes('email');
    const shouldSendPush = !channels || channels.includes('push');

    if (shouldSendEmail) {
      try {
        await addEmailToQueue({
          to: user.email,
          subject: content.subject,
          content: content.body,
          type: 'HTML',
        });
        logger.info('notification.delivery.email_queued', {
          userId,
          notificationType: payload.type,
        });
      } catch (error) {
        logger.error('notification.delivery.email_queue_failed', {
          userId,
          notificationType: payload.type,
          error,
        });
      }
    }

    let pushSuccessCount = 0;
    let pushFailureCount = 0;

    if (shouldSendPush && env.PUSH_NOTIFICATIONS_ENABLED) {
      const pushTokens = await prismaDangerouslyBypassRLS.pushToken.findMany({
        where: { userId },
      });
      const pushData = {
        notificationType: payload.type,
        ...(payload.deepLink ? { deepLink: payload.deepLink } : {}),
      };

      for (const pushToken of pushTokens) {
        try {
          let sent = false;
          if (pushToken.type === 'mobile' && pushToken.token) {
            sent = await sendMobilePushNotification(
              pushToken.token,
              content.subject,
              content.pushBody,
              pushData,
            );
          } else if (
            pushToken.type === 'web' &&
            pushToken.token &&
            pushToken.p256dh &&
            pushToken.auth
          ) {
            sent = await sendWebPushNotification(
              {
                endpoint: pushToken.token,
                p256dh: pushToken.p256dh,
                auth: pushToken.auth,
              },
              content.subject,
              content.pushBody,
              pushData,
            );
          }
          if (sent) {
            pushSuccessCount++;
          } else {
            pushFailureCount++;
          }
        } catch (error) {
          pushFailureCount++;
          logger.error('notification.delivery.push_token_failed', {
            userId,
            pushTokenId: pushToken.id,
            pushTokenType: pushToken.type,
            error,
          });
        }
      }
    }

    logger.info('notification.delivery.user_completed', {
      userId,
      notificationType: payload.type,
      pushSuccessCount,
      pushFailureCount,
    });

    return { success: true };
  } catch (error) {
    logger.error('notification.delivery.user_failed', { userId, error });
    return { success: false, error: String(error) };
  }
}

/**
 * Notification worker - sends email and push notifications
 * Notification records are already created by the service layer
 */
export async function notificationWorker(data: NotificationJobData) {
  const {
    organizationId,
    roles,
    targetUserIds,
    payload,
    senderUserId,
    locale,
    channels,
  } = data;

  logger.info('notification.job.started', {
    organizationId,
    notificationType: payload.type,
    roleCount: roles.length,
  });

  try {
    const members = targetUserIds?.length
      ? targetUserIds.map((userId) => ({ userId }))
      : await prismaDangerouslyBypassRLS.member.findMany({
          where: {
            organizationId,
            isNotificationsEnabled: true,
            ...(roles.length > 0 ? { role: { in: roles } } : {}),
          },
          select: { userId: true },
        });

    if (members.length === 0) {
      logger.info('notification.job.no_recipients', {
        organizationId,
        notificationType: payload.type,
        roleCount: roles.length,
      });
      return { success: true, memberCount: 0 };
    }

    logger.info('notification.job.recipients_loaded', {
      organizationId,
      notificationType: payload.type,
      memberCount: members.length,
    });

    const results = await Promise.allSettled(
      members.map((member) =>
        sendUserNotification(
          member.userId,
          payload,
          locale,
          senderUserId,
          channels,
        ),
      ),
    );

    const successCount = results.filter(
      (r) => r.status === 'fulfilled' && r.value.success,
    ).length;
    const failureCount = results.length - successCount;

    logger.info('notification.job.completed', {
      organizationId,
      notificationType: payload.type,
      memberCount: members.length,
      successCount,
      failureCount,
    });

    return {
      success: true,
      memberCount: members.length,
      successCount,
      failureCount,
    };
  } catch (error) {
    logger.error('notification.job.failed', {
      organizationId,
      notificationType: payload.type,
      error,
    });
    throw error;
  }
}
