/// TriNetra Compile-Time Configuration
/// All sensitive keys are injected via --dart-define in GitHub Actions.
/// Never hardcode secrets in this file.
class AppConfig {
  AppConfig._();

  // ─── App Identity ────────────────────────────────────────────
  static const String appName = 'TriNetra';
  static const String appPackageId = 'com.trinetra.app';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';
  static const String appWebUrl = 'https://trinetra.web.app';

  // ─── Firebase (injected via --dart-define) ──────────────────
  static const String firebaseProjectId = String.fromEnvironment(
    'FIREBASE_PROJECT_ID',
    defaultValue: 'trinetra',
  );
  static const String firebaseWebApiKey = String.fromEnvironment(
    'FIREBASE_WEB_API_KEY',
    defaultValue: '',
  );
  static const String firebaseWebAppId = String.fromEnvironment(
    'FIREBASE_WEB_APP_ID',
    defaultValue: '',
  );
  static const String firebaseAuthDomain = String.fromEnvironment(
    'FIREBASE_AUTH_DOMAIN',
    defaultValue: 'trinetra.firebaseapp.com',
  );
  static const String firebaseStorageBucket = String.fromEnvironment(
    'FIREBASE_STORAGE_BUCKET',
    defaultValue: 'trinetra.appspot.com',
  );
  static const String firebaseMessagingSenderId = String.fromEnvironment(
    'FIREBASE_SENDER_ID',
    defaultValue: '',
  );
  static const String firebaseMeasurementId = String.fromEnvironment(
    'FIREBASE_MEASUREMENT_ID',
    defaultValue: '',
  );
  static const String firebaseAndroidApiKey = String.fromEnvironment(
    'FIREBASE_ANDROID_API_KEY',
    defaultValue: '',
  );
  static const String firebaseAndroidAppId = String.fromEnvironment(
    'FIREBASE_ANDROID_APP_ID',
    defaultValue: '',
  );
  static const String firebaseIosApiKey = String.fromEnvironment(
    'FIREBASE_IOS_API_KEY',
    defaultValue: '',
  );
  static const String firebaseIosAppId = String.fromEnvironment(
    'FIREBASE_IOS_APP_ID',
    defaultValue: '',
  );

  // ─── AI / Gemini ─────────────────────────────────────────────
  static const String geminiApiKey = String.fromEnvironment(
    'GEMINI_API_KEY',
    defaultValue: '',
  );

  // ─── Payments ────────────────────────────────────────────────
  static const String razorpayKeyId = String.fromEnvironment(
    'RAZORPAY_KEY_ID',
    defaultValue: '',
  );
  static const String stripePublishableKey = String.fromEnvironment(
    'STRIPE_PUBLISHABLE_KEY',
    defaultValue: '',
  );
  static const String paypalClientId = String.fromEnvironment(
    'PAYPAL_CLIENT_ID',
    defaultValue: '',
  );

  // ─── Monitoring ──────────────────────────────────────────────
  static const String sentryDsn = String.fromEnvironment(
    'SENTRY_DSN',
    defaultValue: '',
  );
  static const String logRocketAppId = String.fromEnvironment(
    'LOGROCKET_APP_ID',
    defaultValue: '',
  );

  // ─── AWS ─────────────────────────────────────────────────────
  static const String awsAccessKey = String.fromEnvironment(
    'AWS_ACCESS_KEY',
    defaultValue: '',
  );
  static const String awsSecretKey = String.fromEnvironment(
    'AWS_SECRET_KEY',
    defaultValue: '',
  );
  static const String awsS3Bucket = String.fromEnvironment(
    'AWS_S3_BUCKET',
    defaultValue: 'trinetra-media',
  );
  static const String awsRegion = String.fromEnvironment(
    'AWS_REGION',
    defaultValue: 'ap-south-1',
  );

  // ─── AdMob (injected via --dart-define) ─────────────────────
  static const String admobAndroidAppId = String.fromEnvironment(
    'ADMOB_ANDROID_APP_ID',
    defaultValue: 'ca-app-pub-3940256099942544~3347511713', // Google test
  );
  static const String admobIosAppId = String.fromEnvironment(
    'ADMOB_IOS_APP_ID',
    defaultValue: 'ca-app-pub-3940256099942544~1458002511', // Google test
  );

  // ─── API Base URL (native platforms) ─────────────────────────
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: '',
  );

  // ─── Creator Revenue Split ───────────────────────────────────
  static const double platformRevenueCut = 0.70; // 70% to platform
  static const double creatorRevenueCut = 0.30;  // 30% to creator (free tier)
  static const double proCreatorRevenueCut = 1.0; // 100% for Premium tier

  // ─── Subscription ─────────────────────────────────────────────
  static const double creatorProMonthlyUsd = 9.99;
  static const double creatorProYearlyUsd = 99.99;
  static const double marketplaceFeePercent = 0.05; // 5% fee
}
