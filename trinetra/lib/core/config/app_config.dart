import 'package:flutter_dotenv/flutter_dotenv.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER APP CONFIGURATION (Facebook 2026 Standard)
// Dual-Engine: Appwrite + Cloudflare | 6-in-1 AI | WhatsApp 2.0
// ==============================================================

class AppConfig {
  AppConfig._();

  // ─── 1. APP IDENTITY (6-Platform Ready) ──────────────────────
  static const String appName = 'TriNetra';
  static const String appPackageId = 'com.trinetra.app';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';
  
  // Dual-Engine URLs
  static const String appWebUrl = 'https://trinetra.pages.dev'; // Cloudflare Pages
  static const String cloudflareWorkerUrl = String.fromEnvironment('CLOUDFLARE_WORKER_URL');

  // ─── 2. THE 6-IN-1 MASTER AI BRAIN (Point 11) ─────────────────
  static String get openAiApiKey => const String.fromEnvironment('OPENAI_API_KEY');
  static String get geminiApiKey => const String.fromEnvironment('GEMINI_API_KEY');
  static String get deepSeekApiKey => const String.fromEnvironment('DEEPSEEK_API_KEY');
  static String get metaAiKey => const String.fromEnvironment('META_API_KEY');
  static String get groqApiKey => const String.fromEnvironment('GROQ_API_KEY');

  // ─── 3. WHATSAPP 2.0 CALLING ENGINE (ZegoCloud - Point 5) ─────
  static String get zegoAppId => const String.fromEnvironment('ZEGOCLOUD_APP_ID');
  static String get zegoAppSign => const String.fromEnvironment('ZEGOCLOUD_APP_SIGN');

  // ─── 4. THE ECONOMY - 5 REAL GATEWAYS (Point 6) ───────────────
  static String get paypalClientId => const String.fromEnvironment('PAYPAL_CLIENT_ID');
  static String get payuMerchantKey => const String.fromEnvironment('PAYU_MERCHANT_KEY');
  static String get braintreeToken => const String.fromEnvironment('BRAINTREE_TOKEN');
  static String get paddleApiKey => const String.fromEnvironment('PADDLE_KEY');
  static String get adyenApiKey => const String.fromEnvironment('ADYEN_KEY');

  // ─── 5. SECURITY, CRASH TRACKING & DUAL-ENGINE ────────────────
  static String get sentryDsn => const String.fromEnvironment('SENTRY_DSN');
  
  // Appwrite Configuration
  static String get appwriteEndpoint => const String.fromEnvironment('APPWRITE_ENDPOINT');
  static String get appwriteProjectId => const String.fromEnvironment('APPWRITE_PROJECT_ID');

  // ─── 6. TRINETRA MASTER PRICING ENGINE (From Blueprint) ───────
  
  // A. Boost & Revenue Models (Point 6)
  static const double freeBoostTriNetraCut = 0.70; // 70% to Platform
  static const double freeBoostUserCut = 0.30;     // 30% to User
  
  static const double paidBoostPrice = 349.0;      // ₹349/day (25/75 Split)
  static const double paidBoostProPrice = 799.0;   // ₹799/day (100% User)
  static const double autoBoostProPrice = 28000.0; // ₹28,000/month

  // B. 6-in-1 Master AI Tiers (Point 11)
  static const double aiChatbotPaid = 2499.0;      // ₹2499/month
  static const double aiAgenticPaid = 2999.0;      // ₹2999/month
  static const double aiSuperAgenticPaid = 9999.0; // ₹9999/month (Human-Brain)
  static const double aiOsCreatorPaid = 79999.0;   // ₹79999/month (5000 Premium Credits)

  // C. Auto-Escalation Complaint System (Point 4)
  static const double autoEscalationSystemPrice = 30000.0; // ₹30,000/month
}
