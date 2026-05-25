# Mobile App (Expo + React Native)

This package contains the mobile application built with **Expo SDK 54** and **React Native 0.81**. The app displays the web application in a full-screen WebView with native push notification support for both iOS and Android.

## Features

- **Full-screen WebView**: Displays the web application seamlessly
- **Push Notifications**: Native push notification support for iOS and Android
- **Bidirectional Communication**: Native-to-Web bridge for token exchange
- **Cross-platform**: Single codebase for both iOS and Android
- **Development Mode**: Automatically connects to localhost during development
- **Expo SDK 54**: Latest Expo features including precompiled XCFrameworks for faster iOS builds

## Prerequisites

- **Node.js 20.19.4+** (required by Expo SDK 54) and pnpm
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally
- For iOS development:
  - macOS with **Xcode 16+** (Xcode 26 recommended for SDK 54)
  - iOS Simulator or physical iOS device
  - Apple Developer account (for push notifications)
- For Android development:
  - Android Studio with Android SDK
  - **Android 16** target (automatically enabled in SDK 54)
  - Android Emulator or physical Android device
  - Firebase project (for push notifications)

## Installation

From the project root:

```bash
pnpm install
```

## Configuration

### 1. Update App Identifiers

Edit `app.json` and update the following:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

### 2. Configure Web URL

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and update the production URL:

```bash
# Mobile App Configuration
EXPO_PUBLIC_ANDROID_WEB_URL=https://your-production-url.com
EXPO_PUBLIC_IOS_WEB_URL=https://your-production-url.com
```

**Development**: Use `localhost:5173` for `EXPO_PUBLIC_IOS_WEB_URL` (iOS simulator) and `10.0.2.2:5173` for `EXPO_PUBLIC_ANDROID_WEB_URL` (Android emulator).

**Production**: Both URLs point to your production domain.

### 3. Set Up Push Notifications

#### Firebase Setup (Required for both iOS and Android)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add an iOS app and download `GoogleService-Info.plist`
3. Add an Android app and download `google-services.json`
4. Place both files in the `certificates/` directory
5. Replace `app.json` with `app-with-google-services-file.json`:

```bash
mv app-with-google-services-file.json app.json
```

This adds the `googleServicesFile` entries pointing to your certificates. Without this step, push notifications won't work even if the certificate files are in place.

See `certificates/README.md` for detailed instructions.

#### iOS APNs Configuration

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Create an App ID with Push Notifications capability
3. Generate an APNs certificate or key
4. Upload the certificate/key to Firebase Console (Project Settings > Cloud Messaging > Apple)

#### EAS Project Setup

1. Install EAS CLI globally:

```bash
npm install -g eas-cli
```

2. Initialize EAS project:

```bash
cd packages/mobile
eas init
```

3. Update `app.json` with your EAS project ID:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

### 4. Add App Icons and Splash Screen

Place the following image files in the `assets/` directory:

- `icon.png` - App icon (1024x1024px)
- `adaptive-icon.png` - Android adaptive icon (1024x1024px)
- `splash.png` - Splash screen image (1284x2778px)
- `favicon.png` - Web favicon (48x48px)
- `notification-icon.png` - Android notification icon (96x96px, transparent)

You can generate these using [Expo's asset generator](https://github.com/expo/expo/tree/main/packages/%40expo/image-utils).

## Development

### Start the Development Server

From the project root or mobile directory:

```bash
# Start Expo development server
pnpm --filter @project/mobile start

# Or directly in mobile directory
cd packages/mobile
pnpm start
```

### Run on iOS

```bash
pnpm --filter @project/mobile ios
```

Or press `i` in the Expo dev tools to open iOS Simulator.

### Run on Android

```bash
pnpm --filter @project/mobile android
```

Or press `a` in the Expo dev tools to open Android Emulator.

### Development Workflow

1. **Start the backend**: `pnpm dev` in the project root
2. **Start Expo**: `pnpm --filter @project/mobile start`
3. **Run the app**: Choose iOS or Android
4. The app will connect to `http://localhost:5173` in development mode

**Important**: Make sure the web dev server is running at `http://localhost:5173` before launching the mobile app in development mode.

## How It Works

### WebView Integration

The app uses `react-native-webview` to display the web application in a full-screen native view. The WebView:

- Loads the web app from `localhost:5173` (dev) or production URL
- Enables JavaScript and DOM storage
- Shares cookies with native storage
- Supports back/forward navigation gestures (iOS)

### Push Notification Flow

1. **Native side** (`App.tsx`):
   - Requests notification permissions on app launch
   - Registers for Expo Push Tokens
   - Listens for incoming notifications
   - Provides a message handler for WebView communication

2. **Web side** (`packages/frontend/src/shared/lib/nativeApp.ts`):
   - Detects if running in native app via `window.isNativeApp`
   - Calls `window.requestPushToken()` to request the token
   - Receives token via `pushToken` custom event
   - Automatically triggered after successful authentication

3. **Bridge communication**:
   - Web → Native: `window.ReactNativeWebView.postMessage()`
   - Native → Web: `webViewRef.current?.postMessage()`
   - Uses JSON messages with `type` field for routing

### Token Registration After Authentication

The push token is automatically requested and logged after successful sign-in:

- **Email/Password**: `SignInForm.tsx` calls `handlePushTokenAfterAuth()`
- **OAuth**: `AuthCallbackPage.tsx` calls `handlePushTokenAfterAuth()`

The token is logged to the console. To actually register it with your backend:

1. Create a backend API endpoint (e.g., `POST /api/user/push-token`)
2. Uncomment and update the API call in `nativeApp.ts`:

```typescript
await apiClient.post('api/user/push-token', {
  json: {
    token: response.token,
    platform: response.platform,
  },
});
```

## Building for Production

### iOS

1. **Create a build**:

```bash
eas build --platform ios
```

2. **Submit to App Store**:

```bash
eas submit --platform ios
```

### Android

1. **Create a build**:

```bash
eas build --platform android
```

2. **Submit to Google Play**:

```bash
eas submit --platform android
```

### Alternative: Build Locally

For local builds (requires native development environment):

```bash
# iOS
eas build --platform ios --local

# Android
eas build --platform android --local
```

## Testing Push Notifications

**Important Note for SDK 54**: Push notifications are **not available in Expo Go on Android** starting from SDK 53+. You must create a **development build** to test push notifications on Android. iOS push notifications also require a physical device.

### Using Expo Push Notifications Tool

1. Get your Expo Push Token from the app logs
2. Go to [Expo Push Notification Tool](https://expo.dev/notifications)
3. Enter your token and send a test notification

### Using Your Backend

Send a POST request to Expo's push notification service:

```bash
curl -H "Content-Type: application/json" \
     -X POST https://exp.host/--/api/v2/push/send \
     -d '{
       "to": "ExponentPushToken[YOUR_TOKEN]",
       "title": "Test Notification",
       "body": "This is a test notification"
     }'
```

### Backend Push Notification Authentication

The backend automatically sends push notifications via Expo's API. For production apps, add authentication:

1. **Get Expo Access Token**:
   - Go to [https://expo.dev](https://expo.dev)
   - Login to your account
   - Go to Account Settings → Access Tokens
   - Create a new token with push notification permissions

2. **Add to Backend Environment**:

```bash
# packages/backend/.env
EXPO_ACCESS_TOKEN=your-expo-access-token-here
```

**Without token**: Expo allows sending but with rate limits (suitable for development/testing)
**With token**: Full production support with higher limits and better reliability

The backend (`packages/backend/src/features/notification/notificationWorker.ts`) will automatically use the token if available.

## Troubleshooting

### WebView not loading

- Ensure the web dev server is running at `http://localhost:5173`
- Check that your computer and mobile device are on the same network
- For Android emulator, use `http://10.0.2.2:5173` instead of `localhost`
- For iOS simulator, `localhost` should work

### Push notifications not working

- **Device check**: Push notifications require a physical device (won't work in simulators)
- **Permissions**: Make sure notification permissions are granted
- **Firebase**: Verify certificate files are in place and that `app.json` includes `googleServicesFile` entries (use `app-with-google-services-file.json`)
- **iOS**: Check APNs certificate is uploaded to Firebase
- **Android**: Verify `google-services.json` package name matches `app.json`
- **EAS Project ID**: Ensure project ID in `app.json` is correct

### Build errors

- Run `pnpm install` to ensure dependencies are up to date
- Clear Expo cache: `expo start -c`
- For iOS: `cd ios && pod install && cd ..`
- For Android: `cd android && ./gradlew clean && cd ..`

## File Structure

```
packages/mobile/
├── App.tsx                 # Main app component with WebView and notifications
├── app.json               # Expo configuration (without Google Services)
├── app-with-google-services-file.json  # Expo config with googleServicesFile entries
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── assets/                # App icons and splash screen
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   ├── favicon.png
│   └── notification-icon.png
└── certificates/          # Firebase configuration files
    ├── README.md
    ├── GoogleService-Info.plist  # iOS (add this)
    └── google-services.json      # Android (add this)
```

## Native API Documentation

### Available in Web Context

When the web app is running inside the native mobile wrapper, these globals are available:

```typescript
// Check if running in native app
window.isNativeApp; // true

// Get native platform
window.nativePlatform; // 'ios' | 'android'

// Request push token
window.requestPushToken(); // void

// Listen for token response
window.addEventListener('pushToken', (event: CustomEvent) => {
  const { token, platform } = event.detail;
  // Send the token to the backend; do not log it or send it to analytics.
  savePushToken(token, platform);
});
```

### Helper Functions

Use the utilities in `packages/frontend/src/shared/lib/nativeApp.ts`:

```typescript
import {
  isNativeApp,
  getNativePlatform,
  requestPushToken,
  handlePushTokenAfterAuth,
} from '@/shared/lib/nativeApp';

// Check if native
if (isNativeApp()) {
  const platform = getNativePlatform(); // 'ios' | 'android' | null
}

// Request token with promise
const response = await requestPushToken();
await savePushToken(response.token, response.platform);

// Auto-handle after auth (already integrated)
handlePushTokenAfterAuth();
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Apple Push Notification Service](https://developer.apple.com/documentation/usernotifications)
