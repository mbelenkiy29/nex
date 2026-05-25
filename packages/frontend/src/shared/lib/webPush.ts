/**
 * Web push notification utilities
 * Handles web push notification registration for browser environments
 */

import { useAuthStore } from '@/features/auth/authStore';
import { apiClient } from './apiClient';
import { logger } from './logger';

/**
 * Check if web push notifications are supported and enabled
 */
export function isWebPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

/**
 * Check if web push notifications are enabled in config
 */
export function isWebPushEnabled(): boolean {
  const config = useAuthStore.getState().config;
  return Boolean(config?.isPushNotificationsEnabled);
}

/**
 * Convert base64 string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Register service worker
 */
async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    logger.debug('web_push.service_worker.unsupported');
    return null;
  }

  try {
    let registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
      logger.debug('web_push.service_worker.already_registered');
      return registration;
    }

    registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    logger.info('web_push.service_worker.registered');

    await navigator.serviceWorker.ready;

    return registration;
  } catch (error) {
    logger.error('web_push.service_worker.registration_failed', { error });
    return null;
  }
}

/**
 * Get VAPID public key from backend config
 */
async function getVapidPublicKey(): Promise<string | null> {
  try {
    const config = useAuthStore.getState().config;
    return config?.vapidPublicKey || null;
  } catch (error) {
    logger.error('web_push.vapid_public_key.read_failed', { error });
    return null;
  }
}

/**
 * Create or get push subscription
 */
async function subscribeToPush(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string,
): Promise<PushSubscription | null> {
  try {
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      logger.debug('web_push.subscription.already_exists');
      return subscription;
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    logger.info('web_push.subscription.created');
    return subscription;
  } catch (error) {
    logger.error('web_push.subscription.create_failed', { error });
    return null;
  }
}

/**
 * Send subscription to backend
 */
async function saveSubscriptionToBackend(
  subscription: PushSubscription,
): Promise<boolean> {
  try {
    const subscriptionJson = subscription.toJSON();

    await apiClient.post('api/push-token', {
      json: {
        type: 'web',
        token: subscriptionJson.endpoint,
        p256dh: subscriptionJson.keys?.p256dh,
        auth: subscriptionJson.keys?.auth,
        expirationTime: subscriptionJson.expirationTime
          ? new Date(subscriptionJson.expirationTime).toISOString()
          : undefined,
      },
    });

    logger.info('web_push.subscription.saved', {
      hasExpirationTime: Boolean(subscriptionJson.expirationTime),
    });
    return true;
  } catch (error) {
    logger.error('web_push.subscription.save_failed', { error });
    return false;
  }
}

/**
 * Request web push notification permission and setup subscription
 */
export async function requestWebPushSubscription(): Promise<PushSubscription | null> {
  if (!isWebPushSupported()) {
    logger.debug('web_push.unsupported');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      logger.info('web_push.permission_not_granted', { permission });
      return null;
    }

    const registration = await registerServiceWorker();
    if (!registration) {
      logger.warn('web_push.service_worker.unavailable');
      return null;
    }

    const vapidPublicKey = await getVapidPublicKey();
    if (!vapidPublicKey) {
      logger.warn('web_push.vapid_public_key.missing');
      return null;
    }

    const subscription = await subscribeToPush(registration, vapidPublicKey);
    if (!subscription) {
      logger.warn('web_push.subscription.unavailable');
      return null;
    }

    await saveSubscriptionToBackend(subscription);

    return subscription;
  } catch (error) {
    logger.error('web_push.subscription.setup_failed', { error });
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromWebPush(): Promise<boolean> {
  if (!isWebPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return false;
    }

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      return false;
    }

    const endpoint = subscription.endpoint;
    const success = await subscription.unsubscribe();

    if (success) {
      logger.info('web_push.subscription.unsubscribed');

      try {
        await apiClient.delete('api/push-token', {
          json: { token: endpoint },
        });
        logger.info('web_push.subscription.backend_token_removed');
      } catch (error) {
        logger.error('web_push.subscription.backend_token_remove_failed', {
          error,
        });
      }
    }

    return success;
  } catch (error) {
    logger.error('web_push.subscription.unsubscribe_failed', { error });
    return false;
  }
}

/**
 * Handle web push notification registration after authentication
 * Automatically called when user is authenticated
 */
export async function handleWebPushAfterAuth() {
  if (!isWebPushSupported() || !isWebPushEnabled()) {
    return;
  }

  if (
    Notification.permission === 'default' ||
    Notification.permission === 'granted'
  ) {
    try {
      await requestWebPushSubscription();
    } catch (error) {
      logger.error('web_push.after_auth.setup_failed', { error });
    }
  }
}

/**
 * Request permission and subscribe to web push notifications
 * This can be called from a user-initiated action (e.g., settings page)
 */
export async function enableWebPushNotifications(): Promise<boolean> {
  if (!isWebPushSupported()) {
    logger.warn('web_push.enable.unsupported');
    return false;
  }

  if (!isWebPushEnabled()) {
    logger.warn('web_push.enable.disabled');
    return false;
  }

  try {
    const subscription = await requestWebPushSubscription();
    return subscription !== null;
  } catch (error) {
    logger.error('web_push.enable.failed', { error });
    return false;
  }
}
