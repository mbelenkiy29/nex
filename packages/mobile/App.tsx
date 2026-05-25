import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Platform, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView as RNWebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { logger } from './logger';

const WebView = RNWebView as any;

const WEB_URL =
  Platform.OS === 'android'
    ? process.env.EXPO_PUBLIC_ANDROID_WEB_URL
    : process.env.EXPO_PUBLIC_IOS_WEB_URL;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const webViewRef = useRef<WebViewType>(null);
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const notificationListener = useRef<ReturnType<
    typeof Notifications.addNotificationReceivedListener
  > | null>(null);
  const responseListener = useRef<ReturnType<
    typeof Notifications.addNotificationResponseReceivedListener
  > | null>(null);
  const pendingDeepLinkRef = useRef<string | null>(null);
  const webViewReadyRef = useRef(false);

  const postToWeb = useCallback((message: Record<string, unknown>) => {
    webViewRef.current?.postMessage(JSON.stringify(message));
  }, []);

  const webUrlForDeepLink = useCallback((target: string) => {
    if (!WEB_URL) {
      return target;
    }

    if (target.startsWith('http://') || target.startsWith('https://')) {
      return target;
    }

    if (target.startsWith('/')) {
      return `${WEB_URL.replace(/\/$/, '')}${target}`;
    }

    try {
      const parsed = new URL(target);
      if (parsed.protocol === 'nexexam:') {
        const path = parsed.host
          ? `/${parsed.host}${parsed.pathname}`
          : parsed.pathname;
        return `${WEB_URL.replace(/\/$/, '')}${path}${parsed.search}`;
      }
    } catch {
      return `${WEB_URL.replace(/\/$/, '')}`;
    }

    return target;
  }, []);

  const openDeepLink = useCallback(
    (target: string) => {
      const url = webUrlForDeepLink(target);

      if (!webViewReadyRef.current) {
        pendingDeepLinkRef.current = url;
        return;
      }

      postToWeb({
        type: 'DEEP_LINK_OPENED',
        deepLink: target,
        url,
      });
      webViewRef.current?.injectJavaScript(
        `window.location.href = ${JSON.stringify(url)}; true;`,
      );
    },
    [postToWeb, webUrlForDeepLink],
  );

  const flushPendingDeepLink = useCallback(() => {
    if (!pendingDeepLinkRef.current) {
      return;
    }

    const url = pendingDeepLinkRef.current;
    pendingDeepLinkRef.current = null;
    postToWeb({
      type: 'DEEP_LINK_OPENED',
      deepLink: url,
      url,
    });
    webViewRef.current?.injectJavaScript(
      `window.location.href = ${JSON.stringify(url)}; true;`,
    );
  }, [postToWeb]);

  useEffect(() => {
    const isExpoGo = !!Constants.expoGoConfig;

    logger.info('mobile_push.initializing', {
      isExpoGo,
      platform: Platform.OS,
      isDevice: Device.isDevice,
    });

    // Always try to register for push notifications regardless of Expo Go detection
    // The actual check will happen in registerForPushNotificationsAsync based on Device.isDevice
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        logger.info('mobile_push.token_received', {
          platform: Platform.OS,
        });
        setExpoPushToken(token);
      } else {
        logger.info('mobile_push.token_unavailable', {
          platform: Platform.OS,
        });
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        logger.debug('mobile_push.notification_received', {
          identifier: notification.request.identifier,
        });
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const deepLink = response.notification.request.content.data
          ?.deepLink as string | undefined;
        logger.debug('mobile_push.notification_response_received', {
          actionIdentifier: response.actionIdentifier,
          identifier: response.notification.request.identifier,
          hasDeepLink: Boolean(deepLink),
        });
        if (deepLink) {
          openDeepLink(deepLink);
          postToWeb({
            type: 'NOTIFICATION_OPENED',
            deepLink,
            data: response.notification.request.content.data,
          });
        }
      });

    Linking.getInitialURL().then((url) => {
      if (url) {
        openDeepLink(url);
      }
    });

    const linkingSubscription = Linking.addEventListener('url', (event) => {
      openDeepLink(event.url);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
      linkingSubscription.remove();
    };
  }, [openDeepLink, postToWeb]);

  const handleMessage = (event: any) => {
    const data = event.nativeEvent.data;

    try {
      const message = JSON.parse(data);

      if (message.type === 'GET_PUSH_TOKEN') {
        logger.debug('mobile_push.webview_token_requested', {
          platform: Platform.OS,
          hasToken: Boolean(expoPushToken),
        });

        const response = JSON.stringify({
          type: 'PUSH_TOKEN_RESPONSE',
          token: expoPushToken,
          platform: Platform.OS,
        });

        webViewRef.current?.postMessage(response);
      } else if (message.type === 'GET_DEVICE_CONTEXT') {
        postToWeb({
          type: 'DEVICE_CONTEXT_RESPONSE',
          isNativeApp: true,
          platform: Platform.OS,
          isDevice: Device.isDevice,
          appOwnership: Constants.appOwnership,
          appVersion: Constants.expoConfig?.version,
        });
      } else if (message.type === 'OPEN_DEEP_LINK' && message.deepLink) {
        openDeepLink(String(message.deepLink));
      } else if (message.type === 'SET_BADGE_COUNT') {
        Notifications.setBadgeCountAsync(Number(message.count) || 0);
      } else if (message.type === 'CACHE_STATUS') {
        logger.debug('mobile_cache.status_received', {
          status: message.status,
        });
      } else if (message.type === 'SYNC_STATUS') {
        logger.debug('mobile_sync.status_received', {
          status: message.status,
        });
      }
    } catch (error) {
      logger.error('mobile_push.webview_message_parse_failed', { error });
    }
  };

  const injectedJavaScript = `
    (function() {
      window.isNativeApp = true;
      window.nativePlatform = '${Platform.OS}';

      window.nativeBridgePostMessage = function(message) {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
      };

      window.requestPushToken = function() {
        window.nativeBridgePostMessage({
          type: 'GET_PUSH_TOKEN'
        });
      };

      window.requestNativeContext = function() {
        window.nativeBridgePostMessage({
          type: 'GET_DEVICE_CONTEXT'
        });
      };

      window.openNativeDeepLink = function(deepLink) {
        window.nativeBridgePostMessage({
          type: 'OPEN_DEEP_LINK',
          deepLink: deepLink
        });
      };

      window.setNativeBadgeCount = function(count) {
        window.nativeBridgePostMessage({
          type: 'SET_BADGE_COUNT',
          count: count
        });
      };

      function handleNativeMessage(event) {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'PUSH_TOKEN_RESPONSE') {
            window.dispatchEvent(new CustomEvent('pushToken', { detail: data }));
          } else if (data.type === 'DEVICE_CONTEXT_RESPONSE') {
            window.dispatchEvent(new CustomEvent('nativeContext', { detail: data }));
          } else if (data.type === 'DEEP_LINK_OPENED') {
            window.dispatchEvent(new CustomEvent('deepLinkOpened', { detail: data }));
          } else if (data.type === 'NOTIFICATION_OPENED') {
            window.dispatchEvent(new CustomEvent('notificationOpened', { detail: data }));
          }
        } catch (error) {
          return;
        }
      }

      document.addEventListener('message', handleNativeMessage);
      window.addEventListener('message', handleNativeMessage);

      true;
    })();
  `;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        <WebView
          ref={webViewRef}
          source={{ uri: WEB_URL }}
          style={styles.webview}
          onMessage={handleMessage}
          onLoadEnd={() => {
            webViewReadyRef.current = true;
            flushPendingDeepLink();
          }}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          mixedContentMode="compatibility"
          allowsBackForwardNavigationGestures={true}
          sharedCookiesEnabled={true}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  logger.info('mobile_push.registration_started', {
    platform: Platform.OS,
    isDevice: Device.isDevice,
  });
  let token;

  if (Platform.OS === 'android') {
    logger.debug('mobile_push.android_channel_configuring');
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    logger.debug('mobile_push.android_channel_configured');
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    logger.debug('mobile_push.permission_status_read', {
      status: existingStatus,
    });
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      logger.info('mobile_push.permission_request_started');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      logger.info('mobile_push.permission_request_completed', { status });
    }

    if (finalStatus !== 'granted') {
      logger.warn('mobile_push.permission_not_granted', {
        status: finalStatus,
      });
      alert('Failed to get push token for push notification!');
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        throw new Error('Project ID not found');
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      logger.info('mobile_push.registration_completed', {
        platform: Platform.OS,
      });
    } catch (error) {
      logger.error('mobile_push.registration_failed', { error });
    }
  } else {
    logger.warn('mobile_push.physical_device_required');
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});
