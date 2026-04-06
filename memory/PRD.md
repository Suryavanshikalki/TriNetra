# TriNetra Super-App — Product Requirements Document

**Last Updated:** February 2026  
**Platform:** Flutter (Android, iOS, Web, Windows, macOS, Linux)  
**Architecture:** Flutter Frontend + AWS Lambda Backend (Python) + AWS (AppSync + Cognito + S3) + Firebase (Domain Hosting ONLY)

---

## Overview
TriNetra is India's ultimate social super-app combining:
- Social Feed (Facebook-style, real-time AWS AppSync)
- Messenger (real-time chat with AWS AppSync streams)
- TriNetra Pay (Wallet + UPI integration via PayU, PayPal, Braintree, Adyen, Paddle)
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

### Backend (AWS Lambda)
- `/api/health` — health check
- `/api/ai/translate` — text translation via Gemini (Emergent LLM Key)
- `/api/ai/chat` — TriNetra AI chatbot via Gemini (Emergent LLM Key)

### AWS Infrastructure & Firebase
- Auth: Phone OTP (AWS Cognito)
- Database: Amazon DynamoDB (real-time streams via AWS AppSync)
  - Collections: posts, conversations, conversations/{id}/messages, users
- Storage: AWS S3 (media uploads)
- FCM: AWS SNS / Pinpoint (push notifications)
- Analytics: AWS Pinpoint
- Crashlytics: Sentry (Firebase Crashlytics removed)

### Monitoring
- Sentry: wraps runApp in SentryFlutter.init, captures all unhandled exceptions
- LogRocket: user session replay

---

## Phase 1 — COMPLETED
- [x] 6-platform boilerplate scaffold
- [x] AWS Amplify & Firebase Hosting initialization (config via .env / --dart-define)
- [x] Splash Screen with animation
- [x] OTP Login (AWS Cognito Phone Auth + DynamoDB user profile upsert)
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

### Real-time AWS AppSync
- [x] FeedController — AWS AppSync real-time stream for posts
- [x] MessengerController — AWS AppSync real-time stream for conversations
- [x] ChatController — AWS AppSync real-time stream for messages per conversation

### Profile Screen (rebuilt from stub)
- [x] DynamoDB-backed user data (profileDataProvider, userPostsProvider)
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

## Phase 3 — P2 COMPLETED (Feb 2026)

### Ad-Free Logic (Creator Pro)
- [x] `lib/core/providers/user_providers.dart` — single source of truth:
  - `currentUserProfileProvider` — real-time AWS AppSync stream of user doc
  - `isCreatorProProvider` — derived from profile stream
  - `adsEnabledProvider` — `false` for Pro users (ad-free), `true` for free tier
  - `boostWalletBalanceProvider` — real-time boost wallet balance
- [x] `_FeedAdSlot` updated to `ConsumerWidget` — checks `adsEnabledProvider` before rendering
- [x] AppLovin/Meta Ads structural placeholders also respect ad-free flag (via `AdsService`)
- [x] Ad-free activates INSTANTLY after Pro subscription payment (DynamoDB real-time)

### Firebase Dual-Domain Live
- [x] `.firebaserc` created → project: `trinetra-8b846`
- [x] `firebase.json` → explicit `"site": "trinetra-8b846"` + security headers + sitemap/robots content-type
- [x] `app_config.dart` → all defaults updated to `trinetra-8b846`
- [x] Both domains covered by ONE deploy (same default hosting site):
  - Primary: `https://trinetra-8b846.web.app`
  - Secondary: `https://trinetra-8b846.firebaseapp.com` (auto-linked by Firebase)
- [x] CI/CD `main.yml` prints LIVE URLs after each deploy

### Google Search Console & SEO
- [x] `web/index.html` → `<meta name="google-site-verification" content="YOUR_GOOGLE_SEARCH_CONSOLE_CODE">`
  - **NEXT STEP**: Replace `YOUR_GOOGLE_SEARCH_CONSOLE_CODE` with real token from Search Console
- [x] `web/robots.txt` — allows all bots, references sitemap, polite crawl-delay
- [x] `web/sitemap.xml` — 8 URLs with priorities, change frequencies, hreflang tags
  - Canonical URLs point to `https://trinetra-8b846.web.app`
- [x] `firebase.json` configured to serve `sitemap.xml` with correct Content-Type

### Sentry Real Key
- [x] `AppConfig.sentryDsn` uses `defaultValue: ''` (no dummy strings)
- [x] All 6 platform builds in CI pass `--dart-define=SENTRY_DSN=${{ secrets.SENTRY_DSN }}`
- [x] `SentryService` gracefully skips init when DSN is empty (dev mode)
- [x] CI/CD prints whether Sentry DSN is configured on each deploy run

### Boost Budget Wallet
- [x] `BoostWalletScreen` (`lib/features/creator/screens/boost_wallet_screen.dart`)
  - Packages: ₹500, ₹1,000 (+₹50 bonus), ₹5,000 (+₹500 bonus)
  - Payment: PayU India (mobile) or PayPal, Braintree, Adyen, Paddle
  - Balance displayed in real-time from `boostWalletBalanceProvider`
- [x] `PaymentController` enhanced:
  - `topUpBoostWallet()` — credits wallet + records transaction
  - `spendFromBoostWallet()` — atomic batch: deducts balance + boosts post
  - `boostWalletBalance` added to `PaymentState`
- [x] `BoostPostScreen` — `_BoostWalletBanner` widget:
  - Shows current balance
  - "Use Wallet" button if sufficient balance (instant boost, no payment prompt)
  - "Top-up" button if insufficient (navigates to BoostWalletScreen)
- [x] Creator Studio → Menu links to BoostWalletScreen

### CI/CD Final Polish
- [x] All `trinetra` project ID hardcodes replaced with `trinetra-8b846`
- [x] macOS/Windows/Linux builds use `${{ env.FIREBASE_PROJECT_ID || 'trinetra-8b846' }}`
- [x] Firebase deploy step annotated with dual-domain explanation
- [x] `Print Live URLs` step after each web deploy

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
  - Payment: PayU India (native) or PayPal, Braintree, Adyen, Paddle (Global)
- [x] Creator Controller (`lib/features/creator/controllers/creator_controller.dart`)
  - DynamoDB-backed: `creator_analytics/{userId}` collection
  - Revenue split: 30% free, 100% Pro (`AppConfig.creatorRevenueCut`)
  - Payout requests written to `payout_requests` DynamoDB collection
  - Creator Pro activation: updates `users/{userId}` with badge + expiry

### Global Payments
- [x] Payment Service (`lib/core/services/payment_service.dart`)
  - **PayU India (REAL)**: Android/iOS native checkout, key via `PAYU_MERCHANT_KEY` secret
  - **Braintree/Adyen/Paddle (REAL)**: UI + initialization, keys via `BRAINTREE_TOKEN`, `ADYEN_KEY`, `PADDLE_KEY`
  - **PayPal (REAL)**: URL-based checkout, `PAYPAL_CLIENT_ID` via GitHub Secrets
  - UPI deep links (PhonePe, Google Pay, Paytm, BHIM)
- [x] Boost Post Flow (`lib/features/creator/screens/boost_post_screen.dart`)
  - Packages: ₹99/1d, ₹299/3d, ₹999/7d with estimated reach
  - Payment selector: PayU, PayPal, Braintree, Adyen, Paddle
  - Integrated with `PaymentController.boostPost()`
- [x] Backend payment endpoints:
  - `POST /api/payment/payu_intent` (structural, pending PayU account)
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
  - Flutter → POST `/api/aws/upload` → AWS Lambda → S3
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
PAYU_MERCHANT_KEY       — your PayU India Key
BRAINTREE_TOKEN         — your Braintree Token
ADYEN_KEY               — your Adyen Key
PADDLE_KEY              — your Paddle Key
AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_S3_BUCKET, AWS_REGION
ANDROID_KEYSTORE_BASE64, ANDROID_STORE_PASSWORD, ANDROID_KEY_ALIAS, ANDROID_KEY_PASSWORD
GOOGLE_PLAY_JSON_KEY    — service account JSON (base64) [when Play account ready]
APP_STORE_CONNECT_KEY_ID, APP_STORE_CONNECT_ISSUER_ID, APP_STORE_CONNECT_KEY_CONTENT
MATCH_GIT_URL, MATCH_GIT_BASIC_AUTHORIZATION, MATCH_PASSWORD
SNAPCRAFT_STORE_CREDENTIALS [when Snap account ready]
```

### Payments
- [ ] Braintree, Adyen, Paddle integration — keys via GitHub Secrets
- [ ] PayU integration (payu_checkoutpro) — key via GitHub Secrets
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

## Phase 3 P3 — COMPLETED (Feb 2026)
- [x] **Automatic Firebase Deploy**: `main.yml` uses `FIREBASE_SERVICE_ACCOUNT` secret for auto-deploy on every push
- [x] **SEO Go-Live**: `GOOGLE_VERIFICATION_TAG` injected into `web/index.html` via CI/CD python script
- [x] **Boost Analytics Tab**: New "Boosts" tab in Creator Studio with real-time DynamoDB data — shows total Impressions, Clicks, CTR, per-post budget progress, and status badges
- [x] **Profile UI Polish**: Boost Wallet balance badge shown on user's own profile; Blue Verification Badge (Icons.verified) already present
- [x] **Revenue Split (70/30 corrected)**: Free tier 30%/70%, Pro tier 70%/30% — all display strings updated in `_RevenueSplitCard`, `_StatusBanner`, and `AppConfig`
- [x] **Ad/Payment Placeholders**: `AppLovin` and `Meta Audience Network` keys scaffolded in `app_config.dart` and `main.yml` `--dart-define` lists for web and Android builds

## Phase 4 — Backlog (P2)
- [ ] Friends/Social Graph (follow/unfollow via DynamoDB)
- [ ] Reels/Short Video feed
- [ ] Live Streaming (WebRTC)
- [ ] Full Marketplace implementation
- [ ] Group Chat + Voice/Video Calls
- [ ] Live Payments: Replace placeholder PayU/Braintree/Adyen/Paddle/PayPal keys with production keys
- [ ] Live Ads: Integrate AppLovin and Meta Audience Network SDKs with real keys
- [ ] Native platform testing/bug-fixing (Android, iOS, macOS, Windows, Linux)
- [ ] Comments system + Share functionality

---

## Environment Variables
### Flutter (--dart-define)
FIREBASE_PROJECT_ID, FIREBASE_WEB_API_KEY, FIREBASE_WEB_APP_ID,
FIREBASE_AUTH_DOMAIN, FIREBASE_STORAGE_BUCKET, FIREBASE_SENDER_ID,
FIREBASE_MEASUREMENT_ID, FIREBASE_ANDROID_API_KEY, FIREBASE_ANDROID_APP_ID,
FIREBASE_IOS_API_KEY, FIREBASE_IOS_APP_ID, SENTRY_DSN,
PAYU_MERCHANT_KEY, BRAINTREE_TOKEN, ADYEN_KEY, PADDLE_KEY, PAYPAL_CLIENT_ID, API_BASE_URL,
GOOGLE_VERIFICATION_TAG, APPLOVIN_SDK_KEY, META_AUDIENCE_NETWORK_APP_ID

### Backend (.env)
EMERGENT_LLM_KEY, MONGO_URL, DB_NAME
