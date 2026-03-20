# TriNetra Super-App

> **A 100% Production-Grade Social Super-App — Facebook 2026 Standard**
> 6 Platforms. One Codebase. Powered by Flutter 3.41 & Firebase.

[![Flutter](https://img.shields.io/badge/Flutter-3.41-blue?logo=flutter)](https://flutter.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange?logo=firebase)](https://firebase.google.com)
[![Platforms](https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20Web%20%7C%20Windows%20%7C%20macOS%20%7C%20Linux-green)](https://trinetra.web.app)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

---

## Live App
- **Web (PWA):** https://trinetra.web.app
- **Android APK:** Available in [GitHub Releases](https://github.com/trinetra-technologies/trinetra/releases)
- **Windows EXE / macOS DMG / Linux DEB:** Available in [GitHub Releases](https://github.com/trinetra-technologies/trinetra/releases)

---

## Features

### Phase 1 (Completed)
- [x] Premium Animated Splash Screen with TriNetra Eye Logo
- [x] Firebase Phone OTP Login (exactly like Facebook)
- [x] Dynamic Dark/Light Mode
- [x] Hindi + English Localization
- [x] AI-Powered Post Translation (Gemini)
- [x] Facebook-style Feed with Stories, Post Cards
- [x] 6 Animated Reactions (Like, Love, Haha, Wow, Sad, Angry)
- [x] Boost Post Button
- [x] CI/CD — Builds all 6 platforms via GitHub Actions
- [x] Auto-deploy Web PWA to Firebase Hosting
- [x] GitHub Releases with .apk, .exe, .dmg, .deb artifacts

### Phase 2 (In Progress)
- [ ] Real-time Firebase Chat (Messenger)
- [ ] HD WebRTC Audio/Video Calling
- [ ] Groups & Pages
- [ ] Marketplace
- [ ] Profile Lock & Privacy Controls

### Phase 3 (Planned)
- [ ] TriNetra Pay (Razorpay + Stripe + PayPal)
- [ ] Creator Studio (70/30 Revenue Split)
- [ ] Creator Pro Subscription (100% Revenue + Blue Badge)
- [ ] PDF Viewer & Documents in Chat
- [ ] Universal Media Player
- [ ] AI Image Generation
- [ ] AdMob + AppLovin + Meta Ads integration

---

## Architecture

```
trinetra/
├── lib/
│   ├── main.dart              # Entry: Sentry + Firebase + LogRocket init
│   ├── app.dart               # MaterialApp, Router, Theme, Locale
│   ├── firebase_options.dart  # Platform-specific Firebase config
│   ├── core/
│   │   ├── config/            # AppConfig, ThemeConfig
│   │   ├── constants/         # AppColors
│   │   └── services/          # Firebase, Gemini, Sentry, LogRocket
│   ├── features/
│   │   ├── auth/              # Splash, Login, Phone, OTP, AuthController
│   │   ├── feed/              # FeedScreen, PostCard, Reactions, Stories
│   │   ├── home/              # HomeScreen (indexed navigation)
│   │   ├── messenger/         # Real-time chat (stub)
│   │   ├── marketplace/       # Buy/Sell (stub)
│   │   └── profile/           # User profile (stub)
│   ├── shared/widgets/        # BottomNav, AppBar
│   └── l10n/                  # AppLocalizations (EN + HI)
├── l10n/                      # .arb translation files
├── web/                       # PWA manifest.json, index.html
├── .github/workflows/         # CI/CD — 6-platform builds + Firebase deploy
├── fastlane/                  # App Store + Play Store automation
├── snap/                      # Linux Snap Store (Snapcraft)
├── flatpak/                   # Linux Flathub (Flatpak)
└── firebase.json              # Firebase Hosting config
```

---

## GitHub Actions Secrets Required

| Secret | Description |
|--------|-------------|
| `FIREBASE_CONFIG` | Firebase web config JSON (from Firebase Console) |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account for Hosting deploy |
| `GEMINI_API_KEY` | Google Gemini API key for AI features |
| `SENTRY_DSN` | Sentry.io DSN for error tracking |
| `RAZORPAY_KEY_ID` | Razorpay key for payments |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `PAYPAL_CLIENT_ID` | PayPal client ID |
| `PAYPAL_SECRET` | PayPal secret |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `AWS_ACCESS_KEY` | AWS S3 access key |
| `AWS_SECRET_KEY` | AWS S3 secret key |
| `LOGROCKET_APP_ID` | LogRocket App ID |
| `ANDROID_KEYSTORE_BASE64` | Android signing keystore (base64) |
| `ANDROID_STORE_PASSWORD` | Android keystore password |
| `ANDROID_KEY_ALIAS` | Android key alias |
| `ANDROID_KEY_PASSWORD` | Android key password |
| `GOOGLE_PLAY_JSON_KEY` | Google Play service account JSON |
| `APP_STORE_CONNECT_API_KEY_PATH` | Apple App Store Connect API key |

---

## Local Development Setup

```bash
# 1. Install Flutter 3.41+
https://docs.flutter.dev/get-started/install

# 2. Clone the repo
git clone https://github.com/YOUR_USERNAME/trinetra.git
cd trinetra

# 3. Install dependencies
flutter pub get

# 4. Add your Firebase config
# Replace android/app/google-services.json
# Replace ios/Runner/GoogleService-Info.plist

# 5. Run the app
flutter run -d chrome  # Web
flutter run -d android # Android
flutter run -d macos   # macOS

# 6. Run with API keys
flutter run --dart-define=GEMINI_API_KEY=your_key \
            --dart-define=FIREBASE_WEB_API_KEY=your_firebase_key
```

---

## Contributing

This is a proprietary project by TriNetra Technologies.

---

**Built with Flutter. Powered by Firebase & AI. Made in India.**
