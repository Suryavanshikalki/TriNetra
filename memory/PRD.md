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

## Phase 3 — PENDING (P1/Next)

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
