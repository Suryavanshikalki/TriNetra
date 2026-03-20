# TriNetra Super-App — PRD & Architecture

## Original Problem Statement
Build a Flutter Super-App named 'TriNetra' — a 100% exact, high-performance clone of Facebook 2026 standards with massive native upgrades. Single Flutter codebase targeting Android, iOS, Windows, Mac, Linux, and Web simultaneously.

## Project Status: Phase 1 Complete

### Architecture
- **Stack**: Flutter 3.41 (Dart 3.5), Firebase, Google Gemini AI
- **State Management**: flutter_riverpod 2.6.1
- **Navigation**: go_router 14.8.1
- **Platforms**: Android, iOS, Web (PWA), Windows, macOS, Linux
- **Monitoring**: Sentry + LogRocket + Firebase Crashlytics
- **Payments**: Razorpay + Stripe + PayPal (framework ready)

### What's Been Implemented (Phase 1 — Feb 2026)

#### Core Infrastructure
- Flutter 6-platform boilerplate with all platform directories (android/ios/web/linux/macos/windows)
- `pubspec.yaml` — 218 dependencies resolved successfully
- `firebase_options.dart` — compile-time config via `--dart-define` (no hardcoded keys)
- `app_config.dart` — all 14+ secrets managed via GitHub Actions Secrets
- `theme_config.dart` — complete Dark/Light Material 3 theme system
- `app_colors.dart` — TriNetra brand color system (Facebook 2026 standard)
- `analysis_options.yaml` — strict code quality rules

#### Services Layer
- `firebase_service.dart` — Firebase Auth, Firestore, Storage, Analytics, Crashlytics, FCM
- `gemini_service.dart` — Translation, Chat AI, Caption Generator, Comment Summarizer
- `sentry_service.dart` — Error tracking, performance monitoring, user context
- `logrocket_service.dart` — Session replay (web JS + native event tracking)

#### Auth Flow (Complete)
- `splash_screen.dart` — Premium animated TriNetra eye logo reveal
- `login_screen.dart` — Facebook-style login with Language + Theme toggle
- `phone_input_screen.dart` — Country code picker + phone validation
- `otp_verify_screen.dart` — 6-digit Pinput OTP with countdown timer
- `auth_controller.dart` — Riverpod StateNotifier with Firebase Phone Auth + Firestore user creation

#### Feed & Social (Phase 1 UI)
- `home_screen.dart` — 5-tab IndexedStack navigation
- `feed_screen.dart` — Infinite scroll + pull-to-refresh + lazy loading
- `post_card.dart` — Post with header, images, translate button, boost button
- `reaction_widget.dart` — 6 animated reactions (Like, Love, Haha, Wow, Sad, Angry)
- `create_post_bar.dart` — Post creation with AI Assist button
- `story_bar.dart` — 24h Stories horizontal scroll
- `bottom_nav.dart` — Facebook-style bottom navigation with dot indicator
- `trinetra_app_bar.dart` — Top bar with Messenger, Notifications, Search

#### Localization
- `app_en.arb` — English (40+ strings)
- `app_hi.arb` — Hindi (40+ strings)
- `l10n.yaml` — Flutter gen-l10n configuration
- Auto-generated: `app_localizations.dart`, `app_localizations_en.dart`, `app_localizations_hi.dart`

#### CI/CD Pipeline
- `.github/workflows/main.yml` — Full 6-platform build + deploy
  - 7 jobs: build-web, build-android, build-ios, build-macos, build-windows, build-linux, create-release
  - Parses FIREBASE_CONFIG JSON → extracts per-platform keys → injects via `--dart-define`
  - Web → Firebase Hosting auto-deploy (trinetra.web.app)
  - Artifacts: .apk, .ipa, .dmg, .exe/.zip, .deb as GitHub Releases

#### Distribution
- `web/manifest.json` — PWA config (iOS Add to Home Screen)
- `web/index.html` — PWA service worker + install prompt
- `firebase.json` — Firebase Hosting with security headers
- `fastlane/Fastfile` — iOS App Store, Mac App Store, Google Play Store
- `fastlane/Appfile` — App identity config
- `snap/snapcraft.yaml` — Linux Snap Store (Snapcraft)
- `flatpak/com.trinetra.app.yml` — Linux Flathub

#### Android Config
- `android/app/build.gradle.kts` — Package ID: com.trinetra.app, Google Services, Signing, ProGuard
- `android/build.gradle.kts` — Google Services + Crashlytics classpath
- `android/app/proguard-rules.pro` — Rules for Flutter, Firebase, Razorpay, Stripe, Sentry
- `android/app/src/main/AndroidManifest.xml` — Internet, Camera, Storage, Audio permissions
- `android/app/src/main/kotlin/com/trinetra/app/MainActivity.kt` — FlutterActivity

## GitHub Secrets Required (14 total)
```
FIREBASE_CONFIG         — JSON from Firebase Console Web App
FIREBASE_SERVICE_ACCOUNT — For Firebase Hosting deploy
GEMINI_API_KEY          — Google Gemini API key
SENTRY_DSN              — Sentry.io DSN
RAZORPAY_KEY_ID         — Already stored in GitHub
RAZORPAY_KEY_SECRET     — Already stored in GitHub
PAYPAL_CLIENT_ID        — Already stored in GitHub
PAYPAL_SECRET           — Already stored in GitHub
STRIPE_PUBLISHABLE_KEY  — Build from scratch (not yet stored)
AWS_ACCESS_KEY          — Already stored in GitHub
AWS_SECRET_KEY          — Already stored in GitHub
LOGROCKET_APP_ID        — Build from scratch
ANDROID_KEYSTORE_BASE64 — For signed APK (optional for debug)
GOOGLE_PLAY_JSON_KEY    — For Play Store submission
APP_STORE_CONNECT_API_KEY_PATH — For App Store submission
```

## Prioritized Backlog

### P0 — Core Social Features
- [ ] Real-time Firebase Firestore Feed (replace sample data)
- [ ] Firebase Messenger (real-time chat)
- [ ] Post Creation (text, photos, videos)
- [ ] User Profiles (view, edit, lock)
- [ ] Groups & Pages

### P1 — Payments & Monetization
- [ ] TriNetra Pay (Razorpay UPI deep-links for PhonePe/Paytm/GPay)
- [ ] Stripe integration (already planned in CI/CD)
- [ ] Creator Studio dashboard (earnings, reach)
- [ ] 70/30 Revenue Split implementation
- [ ] Creator Pro subscription (Razorpay)
- [ ] Transaction History screen

### P1 — Media & PDF
- [ ] Universal Media Player (video_player + chewie + just_audio)
- [ ] PDF Viewer (syncfusion_flutter_pdfviewer — package already installed)
- [ ] PDF upload in comments & Messenger
- [ ] Save to Device feature

### P1 — AI Features
- [ ] Live AI Translation (connect GeminiService to post cards)
- [ ] TriNetra AI Chatbot (search bar + Messenger)
- [ ] AI Image Generation (Gemini)
- [ ] Voice Message Transcript (STT + Gemini cleanup)
- [ ] Caption Generator in post creation

### P2 — Advanced Features
- [ ] HD WebRTC Audio/Video Calling (flutter_webrtc package ready)
- [ ] WhatsApp-style Attachment Sheet in Messenger
- [ ] 24h Stories (creation + viewer)
- [ ] Marketplace (buy/sell)
- [ ] Reels/Short Videos feed
- [ ] Profile Lock privacy controls
- [ ] Blue Verification Badge (Creator Pro)
- [ ] Ads Setup (AdMob, AppLovin, Meta Ads)
- [ ] Boost Post payment flow

### P2 — Infrastructure
- [ ] AWS S3 media uploads (replace Firebase Storage for large files)
- [ ] LogRocket web JS injection
- [ ] Firebase App Check for security
- [ ] Push notifications (FCM setup complete, UI pending)
