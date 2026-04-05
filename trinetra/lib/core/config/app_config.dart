import 'package:flutter_dotenv/flutter_dotenv.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER APP CONFIGURATION (Facebook 2026 Standard)
// 100% AWS | 6-in-1 AI | WhatsApp 2.0 | 5 Payments & Economy
// ==============================================================

class AppConfig {
  AppConfig._();

  // ─── 1. APP IDENTITY (6-Platform Ready) ──────────────────────
  static const String appName = 'TriNetra';
  static const String appPackageId = 'com.trinetra.app';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';
  // 100% AWS Web URL (No Firebase)
  static const String appWebUrl = 'https://trinetra-master.awsapps.com';

  // ─── 2. THE 6-IN-1 MASTER AI BRAIN (Point 11) ─────────────────
  static String get openAiApiKey => dotenv.env['OPENAI_API_KEY'] ?? '';
  static String get geminiApiKey => dotenv.env['GEMINI_API_KEY'] ?? '';
  static String get deepSeekApiKey => dotenv.env['DEEPSEEK_API_KEY'] ?? '';
  static String get metaAiKey => dotenv.env['META_API_KEY'] ?? '';
  static String get groqApiKey => dotenv.env['GROQ_API_KEY'] ?? '';

  // ─── 3. WHATSAPP 2.0 CALLING ENGINE (ZegoCloud - Point 5) ─────
  static String get zegoAppId => dotenv.env['ZEGO_APP_ID'] ?? '';
  static String get zegoServerSecret => dotenv.env['ZEGO_SERVER_SECRET'] ?? '';

  // ─── 4. THE ECONOMY - 5 REAL GATEWAYS (Point 6) ───────────────
  static String get paypalClientId => dotenv.env['PAYPAL_CLIENT_ID'] ?? '';
  static String get payuMerchantKey => dotenv.env['PAYU_MERCHANT_KEY'] ?? '';
  static String get braintreeToken => dotenv.env['BRAINTREE_TOKEN'] ?? '';
  static String get paddleApiKey => dotenv.env['PADDLE_API_KEY'] ?? '';
  static String get adyenApiKey => dotenv.env['ADYEN_API_KEY'] ?? '';

  // ─── 5. SECURITY, CRASH TRACKING & AWS ────────────────────────
  static String get sentryDsn => dotenv.env['SENTRY_DSN'] ?? '';
  static String get logRocketAppId => dotenv.env['LOGROCKET_APP_ID'] ?? '';
  
  static String get awsAccessKey => dotenv.env['AWS_ACCESS_KEY'] ?? '';
  static String get awsSecretKey => dotenv.env['AWS_SECRET_KEY'] ?? '';
  static String get awsRegion => dotenv.env['AWS_REGION'] ?? 'ap-south-1';

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
