# TriNetra Super-App — Product Requirements Document

**Last Updated:** February 2026  
**Platform:** Flutter (Android, iOS, Web, Windows, macOS, Linux)  
**Architecture:** Flutter Frontend + FastAPI Backend (Python) + Firebase (Firestore + Auth + Storage + FCM)

---

## Overview
TriNetra is India's ultimate social super-app combining:
- Social Feed (Facebook-style, real-time Firestore)
- Messenger (real-time chat with Firestore streams)
- TriNetra Pay (Wallet + UPI integration)
- Marketplace
- Refer & Earn (TriNetra Coins)
- AI Features (Gemini translate + chatbot via Emergent LLM Key)
- 6-platform support (Android, iOS, Web, Windows, macOS, Linux)

---

## Architecture

### Frontend (Flutter)
- State Management: flutter_riverpod
- Navigation: go_router (with in-page IndexedStack for bottom nav)
- Themes: Light/Dark, persisted in SharedPreferences
- Localization: en + hi (Devanagari)

### Backend (FastAPI)
- `/api/health` — health check
- `/api/ai/translate` — text translation via Gemini (Emergent LLM Key)
- `/api/ai/chat` — TriNetra AI chatbot via Gemini (Emergent LLM Key)

### Firebase
- Auth: Phone OTP (firebase_auth)
- Database: Cloud Firestore (real-time streams)
  - Collections: posts, conversations, conversations/{id}/messages, users
- Storage: firebase_storage (media uploads)
- FCM: firebase_messaging (push notifications)
- Analytics: firebase_analytics
- Crashlytics: firebase_crashlytics

### Monitoring
- Sentry: wraps runApp in SentryFlutter.init, captures all unhandled exceptions
- LogRocket: user session replay

---

## Phase 1 — COMPLETED
- [x] 6-platform boilerplate scaffold
- [x] Firebase initialization (config via --dart-define)
- [x] Splash Screen with animation
- [x] OTP Login (Phone Auth + Firestore user profile upsert)
- [x] Theme (Light/Dark) with persistence
- [x] Localization (English + Hindi)
- [x] CI/CD configuration

---

## Phase 2 — P0 COMPLETED (Feb 2026)

### Navigation Wiring
- [x] Bottom nav updated: Home | Messenger | Market | Wallet | Menu
- [x] MessengerListScreen wired to Tab 1 (was Friends placeholder)
- [x] WalletScreen wired to Tab 3 (was Reels placeholder)
- [x] MarketplaceScreen moved to Tab 2
- [x] Profile + Referral accessible from Menu tab (5th tab)

### Real-time Firebase
- [x] FeedController — Firestore real-time stream for posts
- [x] MessengerController — Firestore real-time stream for conversations
- [x] ChatController — Firestore real-time stream for messages per conversation

### Profile Screen (rebuilt from stub)
- [x] Firestore-backed user data (profileDataProvider, userPostsProvider)
- [x] Avatar with initials fallback, verified badge
- [x] Stats: Posts, Followers, Following with formatted counts
- [x] Bio display + Edit Profile bottom sheet
- [x] Posts grid (3-column with media preview)
- [x] About tab (phone, bio, creator status)
- [x] Follow/Message buttons for other users

### AI Features (LIVE — Emergent LLM Key)
- [x] AI Translate button in PostCard
  - Auto-detects Hindi/English direction
  - Calls /api/ai/translate on backend
  - Verified: "Hello, how are you?" -> "नमस्ते, आप कैसे हैं?"
- [x] TriNetra AI Chatbot (AIChatScreen)
  - Accessible from TriNetraAppBar (sparkle icon)
  - Calls /api/ai/chat on backend
  - Typing indicator + suggested prompts
- [x] Backend AI endpoints live (Gemini 2.5 Flash)

### Advanced Sentry
- [x] SentryFlutter.init wraps runApp via appRunner callback
- [x] Screenshots, view hierarchy, breadcrumbs, profiles enabled
- [x] DSN via --dart-define SENTRY_DSN (inject via GitHub Secrets)

### Google Search SEO
- [x] Title: "TriNetra - The Ultimate Super-App | Connect, Share & Grow"
- [x] Rich meta description + keywords + robots directives
- [x] Open Graph tags (Facebook/LinkedIn sharing)
- [x] Twitter/X Card tags
- [x] JSON-LD Structured Data (WebApplication schema)
- [x] Canonical URL, preconnect hints, PWA meta tags

---

## Phase 3 — P1 COMPLETED (Feb 2026)

### Dual-Mode Creator System
- [x] Creator Studio Dashboard (`lib/features/creator/screens/creator_studio_screen.dart`)
  - 70/30 revenue split visualization (Free tier)
  - 100% revenue for Creator Pro
  - Earnings overview: Your Earnings, Pending Payout, Paid Out
  - Post performance stats (views, ad impressions, CPM)
  - Payout request form (UPI ID or PayPal email)
  - Payout history with status chips
- [x] Creator Pro Subscription (`lib/features/creator/screens/creator_pro_screen.dart`)
  - Monthly: ₹799/month | Yearly: ₹7,999/year (save 17%)
  - Blue Verification Badge activation on payment
  - Features: 100% revenue, Ad-free browsing, Priority support
  - Feature comparison table (Free vs Pro)
  - Payment: Razorpay (native) or Stripe (dummy)
- [x] Creator Controller (`lib/features/creator/controllers/creator_controller.dart`)
  - Firestore-backed: `creator_analytics/{userId}` collection
  - Revenue split: 30% free, 100% Pro (`AppConfig.creatorRevenueCut`)
  - Payout requests written to `payout_requests` Firestore collection
  - Creator Pro activation: updates `users/{userId}` with badge + expiry

### Global Payments
- [x] Payment Service (`lib/core/services/payment_service.dart`)
  - **Razorpay (REAL)**: Android/iOS native checkout, key via `RAZORPAY_KEY_ID` secret
  - **PayPal (REAL)**: URL-based checkout, `PAYPAL_CLIENT_ID` via GitHub Secrets
  - **Stripe (DUMMY)**: UI + initialization, pending `STRIPE_PUBLISHABLE_KEY`
  - UPI deep links (PhonePe, Google Pay, Paytm, BHIM)
- [x] Boost Post Flow (`lib/features/creator/screens/boost_post_screen.dart`)
  - Packages: ₹99/1d, ₹299/3d, ₹999/7d with estimated reach
  - Payment selector: Razorpay, PayPal, Stripe
  - Integrated with `PaymentController.boostPost()`
- [x] Backend payment endpoints:
  - `POST /api/payment/stripe_intent` (structural, pending Stripe account)
  - `POST /api/creator/payout_request`
  - `GET /api/creator/stats/{user_id}`

### Google AdMob (REAL — pub-6356591837262295)
- [x] Ads Config (`lib/core/config/ads_config.dart`)
  - Publisher ID: `pub-6356591837262295` (from app-ads.txt)
  - Ad unit IDs injectable via `--dart-define` (Google test IDs as fallback)
  - AppLovin + Meta Ads structural placeholders
- [x] Ads Service (`lib/core/services/ads_service.dart`)
  - `AdsService.initialize()` — Google Mobile Ads SDK init (mobile-only)
  - `TriNetraBannerAd` widget — auto-lifecycle management
  - Interstitial preloading + `trackPostView()` for auto-show every 10 views
- [x] Feed integration: Banner ad slot every 5 posts (`_FeedAdSlot`)
- [x] AndroidManifest.xml: AdMob `APPLICATION_ID` meta-data added
  - NOTE: Replace test App ID `ca-app-pub-3940256099942544~3347511713` with real ID

### AWS S3 Media Upload
- [x] AWS Service (`lib/core/services/aws_service.dart`)
  - Flutter → POST `/api/aws/upload` → FastAPI → S3
  - Supports images, videos, PDFs
  - Returns CDN URL
- [x] Backend: `POST /api/aws/upload` using `boto3`
  - Keys: `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `AWS_S3_BUCKET`, `AWS_REGION`
  - boto3 installed in requirements.txt

### App Store Distribution
#### Mobile/Mac — Fastlane
- [x] `fastlane/Fastfile` — enhanced with all 3 platforms
  - Android: `build_release`, `deploy_internal`, `deploy_production`
  - iOS: `build_release`, `deploy_testflight`, `deploy_appstore`
  - macOS: `build_release`, `notarize_app`, `deploy_mac_appstore`
  - Helper: `bump_version`
- [x] `fastlane/Appfile` — credential placeholders with required secrets list

#### Linux — Native (NO Fastlane)
- [x] Snap Store: `snap/snapcraft.yaml` + CI job `publish-linux-snap`
- [x] Flathub: `flatpak/com.trinetra.app.yml` + CI job `prepare-flathub-submission`
- [x] Flatpak AppStream metadata: `flatpak/com.trinetra.app.metainfo.xml`
- [x] Desktop entry: `flatpak/com.trinetra.app.desktop`

### CI/CD Updates (`.github/workflows/main.yml`)
- [x] Android build: +4 AdMob dart-defines + PayPal + AWS keys
- [x] iOS build: +4 AdMob dart-defines + PayPal + AWS keys
- [x] Job 8: `deploy-android-playstore` (Fastlane, triggers on `release` branch)
- [x] Job 9: `deploy-ios-testflight` (Fastlane, triggers on `release` branch)
- [x] Job 10: `publish-linux-snap` (Snapcraft, triggers on `release` branch)
- [x] Job 11: `prepare-flathub-submission` (validates + uploads manifest)

### Required GitHub Secrets to Add
```
ADMOB_ANDROID_APP_ID    — ca-app-pub-6356591837262295~XXXXXXXXXX
ADMOB_BANNER_ANDROID    — ca-app-pub-6356591837262295/XXXXXXXXXX
ADMOB_INTERSTITIAL_ANDROID
ADMOB_REWARDED_ANDROID
ADMOB_IOS_APP_ID        — ca-app-pub-6356591837262295~XXXXXXXXXX
ADMOB_BANNER_IOS, ADMOB_INTERSTITIAL_IOS, ADMOB_REWARDED_IOS
PAYPAL_CLIENT_ID        — your PayPal App client ID
AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_S3_BUCKET, AWS_REGION
ANDROID_KEYSTORE_BASE64, ANDROID_STORE_PASSWORD, ANDROID_KEY_ALIAS, ANDROID_KEY_PASSWORD
GOOGLE_PLAY_JSON_KEY    — service account JSON (base64) [when Play account ready]
APP_STORE_CONNECT_KEY_ID, APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_KEY_CONTENT
MATCH_GIT_URL, MATCH_GIT_BASIC_AUTHORIZATION, MATCH_PASSWORD
SNAPCRAFT_STORE_CREDENTIALS [when Snap account ready]
```

### Payments
- [ ] Stripe integration (flutter_stripe) — key via GitHub Secrets
- [ ] Razorpay integration (razorpay_flutter) — key via GitHub Secrets
- [ ] TriNetra Pay backend endpoints

### Ads
- [ ] Google Mobile Ads (AdMob) — Banner/Interstitial/Rewarded
- [ ] Feed ad placements
- [ ] TriNetra Coins from rewarded ads

### AWS Media
- [ ] AWS S3 upload for post media
- [ ] CloudFront CDN delivery

### App Store Distribution
- [ ] Apple App Store + Google Play submission scripts
- [ ] Fastlane CI/CD integration

---

## Phase 4 — Backlog (P2)
- [ ] Friends/Social Graph (follow/unfollow)
- [ ] Reels/Short Video feed
- [ ] Live Streaming (WebRTC)
- [ ] Full Marketplace implementation
- [ ] Group Chat + Voice/Video Calls
- [ ] Creator Pro subscription
- [ ] Comments system + Share functionality
- [ ] Post boost analytics

---

## Environment Variables
### Flutter (--dart-define)
FIREBASE_PROJECT_ID, FIREBASE_WEB_API_KEY, FIREBASE_WEB_APP_ID,
FIREBASE_AUTH_DOMAIN, FIREBASE_STORAGE_BUCKET, FIREBASE_SENDER_ID,
FIREBASE_MEASUREMENT_ID, FIREBASE_ANDROID_API_KEY, FIREBASE_ANDROID_APP_ID,
FIREBASE_IOS_API_KEY, FIREBASE_IOS_APP_ID, SENTRY_DSN,
RAZORPAY_KEY_ID, STRIPE_PUBLISHABLE_KEY, API_BASE_URL

### Backend (.env)
EMERGENT_LLM_KEY, MONGO_URL, DB_NAME
