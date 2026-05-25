# Push Notification Certificates Setup

This directory should contain your Firebase/Google Services configuration files for push notifications.

## Required Files

### For iOS

**File:** `GoogleService-Info.plist`

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings > General
4. Under "Your apps", click on the iOS app (or add a new iOS app)
5. Download `GoogleService-Info.plist`
6. Place it in this `certificates/` directory

**Bundle Identifier:** Must match the `bundleIdentifier` in `app.json` (currently: `com.yourcompany.templatev4`)

### For Android

**File:** `google-services.json`

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Under "Your apps", click on the Android app (or add a new Android app)
5. Download `google-services.json`
6. Place it in this `certificates/` directory

**Package Name:** Must match the `package` in `app.json` (currently: `com.yourcompany.templatev4`)

## Additional Setup

### iOS APNs Certificate

For iOS push notifications to work, you also need to configure Apple Push Notification service (APNs):

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Create an APNs certificate for your app
3. Upload the certificate to Firebase Console:
   - Firebase Console > Project Settings > Cloud Messaging
   - Under "Apple app configuration", upload your APNs certificate

### Android FCM Setup

Firebase Cloud Messaging (FCM) for Android works out of the box once you add the `google-services.json` file.

## EAS Project ID

Don't forget to update the `projectId` in `app.json`:

```json
"extra": {
  "eas": {
    "projectId": "your-actual-project-id-here"
  }
}
```

Get your EAS project ID by running:

```bash
eas init
```

## Security Note

**IMPORTANT:** These certificate files contain sensitive information and should NEVER be committed to version control.

The `.gitignore` file is configured to exclude:

- `GoogleService-Info.plist`
- `google-services.json`

Only placeholder files and this README are tracked in git.
