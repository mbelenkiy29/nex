/**
 * Native app integration utilities
 * Handles communication between web app and native mobile wrapper
 */

import { useAuthStore } from '@/features/auth/authStore';
import { apiClient } from './apiClient';
import { logger } from './logger';

interface PushTokenResponse {
  type: 'PUSH_TOKEN_RESPONSE';
  token: string;
  platform: 'ios' | 'android';
}

export interface NativeDeviceContext {
  type: 'DEVICE_CONTEXT_RESPONSE';
  isNativeApp: true;
  platform: 'ios' | 'android';
  isDevice?: boolean;
  appOwnership?: string | null;
  appVersion?: string | null;
}

export interface NativeDeepLinkEvent {
  type: 'DEEP_LINK_OPENED' | 'NOTIFICATION_OPENED';
  deepLink: string;
  url?: string;
  data?: Record<string, unknown>;
}

type NativeBridgeMessage =
  | { type: 'GET_PUSH_TOKEN' }
  | { type: 'GET_DEVICE_CONTEXT' }
  | { type: 'OPEN_DEEP_LINK'; deepLink: string }
  | { type: 'SET_BADGE_COUNT'; count: number }
  | { type: 'CACHE_STATUS'; status: string }
  | { type: 'SYNC_STATUS'; status: string };

declare global {
  interface Window {
    isNativeApp?: boolean;
    nativePlatform?: 'ios' | 'android';
    requestPushToken?: () => void;
    requestNativeContext?: () => void;
    openNativeDeepLink?: (deepLink: string) => void;
    setNativeBadgeCount?: (count: number) => void;
    nativeBridgePostMessage?: (message: NativeBridgeMessage) => void;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

/**
 * Check if the app is running inside a native mobile wrapper
 */
export function isNativeApp(): boolean {
  return typeof window !== 'undefined' && window.isNativeApp === true;
}

/**
 * Check if push notifications are enabled in config
 */
export function isPushNotificationsEnabled(): boolean {
  const config = useAuthStore.getState().config;
  return Boolean(config?.isPushNotificationsEnabled);
}

/**
 * Get the native platform (iOS or Android)
 */
export function getNativePlatform(): 'ios' | 'android' | null {
  if (!isNativeApp()) {
    return null;
  }
  return window.nativePlatform || null;
}

export function nativeBridgeIsAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return Boolean(
    isNativeApp() &&
    (window.nativeBridgePostMessage || window.ReactNativeWebView),
  );
}

export function nativeBridgePostMessage(message: NativeBridgeMessage) {
  if (!nativeBridgeIsAvailable()) {
    return;
  }

  if (window.nativeBridgePostMessage) {
    window.nativeBridgePostMessage(message);
    return;
  }

  window.ReactNativeWebView?.postMessage(JSON.stringify(message));
}

export function nativeBridgeOpenDeepLink(deepLink: string) {
  if (window.openNativeDeepLink) {
    window.openNativeDeepLink(deepLink);
    return;
  }

  nativeBridgePostMessage({ type: 'OPEN_DEEP_LINK', deepLink });
}

export function nativeBridgeSetBadgeCount(count: number) {
  if (window.setNativeBadgeCount) {
    window.setNativeBadgeCount(count);
    return;
  }

  nativeBridgePostMessage({ type: 'SET_BADGE_COUNT', count });
}

export function nativeBridgeReportCacheStatus(status: string) {
  nativeBridgePostMessage({ type: 'CACHE_STATUS', status });
}

export function nativeBridgeReportSyncStatus(status: string) {
  nativeBridgePostMessage({ type: 'SYNC_STATUS', status });
}

export function nativeBridgeSubscribe<T extends Event>(
  eventName: 'nativeContext' | 'deepLinkOpened' | 'notificationOpened',
  handler: (event: T) => void,
) {
  window.addEventListener(eventName, handler as EventListener);
  return () => window.removeEventListener(eventName, handler as EventListener);
}

export function nativeBridgeGetContext(
  timeoutMs: number = 5000,
): Promise<NativeDeviceContext | null> {
  return new Promise((resolve) => {
    if (!isNativeApp()) {
      resolve(null);
      return;
    }

    const timeout = setTimeout(() => {
      cleanup();
      resolve(null);
    }, timeoutMs);

    const handleNativeContext = (event: Event) => {
      cleanup();
      resolve((event as CustomEvent<NativeDeviceContext>).detail);
    };

    const cleanup = () => {
      clearTimeout(timeout);
      window.removeEventListener('nativeContext', handleNativeContext);
    };

    window.addEventListener('nativeContext', handleNativeContext);
    nativeBridgePostMessage({ type: 'GET_DEVICE_CONTEXT' });
  });
}

/**
 * Request push notification token from native app
 * Returns a promise that resolves with the token or rejects on timeout
 */
export function requestPushToken(
  timeoutMs: number = 5000,
): Promise<PushTokenResponse> {
  return new Promise((resolve, reject) => {
    if (!isNativeApp()) {
      reject(new Error('Not running in native app'));
      return;
    }

    if (!window.requestPushToken) {
      reject(new Error('Native push token API not available'));
      return;
    }

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Push token request timed out'));
    }, timeoutMs);

    const handlePushToken = (event: Event) => {
      const customEvent = event as CustomEvent<PushTokenResponse>;
      cleanup();
      resolve(customEvent.detail);
    };

    const cleanup = () => {
      clearTimeout(timeout);
      window.removeEventListener('pushToken', handlePushToken);
    };

    window.addEventListener('pushToken', handlePushToken);

    window.requestPushToken();
  });
}

/**
 * Example usage function - can be called after successful authentication
 */
export async function handlePushTokenAfterAuth() {
  if (!isNativeApp()) {
    return;
  }

  if (!isPushNotificationsEnabled()) {
    return;
  }

  try {
    const response = await requestPushToken();
    logger.info('native_push.token_received', {
      platform: response.platform,
    });

    await apiClient.post('api/push-token', {
      json: {
        type: 'mobile',
        token: response.token,
        platform: response.platform,
      },
    });

    logger.info('native_push.token_saved', {
      platform: response.platform,
    });
  } catch (error) {
    logger.error('native_push.token_setup_failed', { error });
  }
}
