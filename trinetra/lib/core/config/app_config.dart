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
  static const String appWebUrl = 'https://trinetra-8b846.web.app';

  // 🔥 Firebase (REMOVED FOR AWS MIGRATION) 🔥

  // ─── AI / Gemini ─────────────────────────────────────────────
  static const String geminiApiKey = String.fromEnvironment(
    'GEMINI_API_KEY',
    defaultValue: '',
  );

  // ─── Payments (AWS Ready - 5 Real Gateways) ──────────────────
  static const String paypalClientId = String.fromEnvironment(
    'PAYPAL_CLIENT_ID',
    defaultValue: '',
  );
  static const String payuMerchantKey = String.fromEnvironment(
    'PAYU_MERCHANT_KEY',
    defaultValue: '',
  );
  static const String braintreeToken = String.fromEnvironment(
    'BRAINTREE_TOKEN',
    defaultValue: '',
  );
  static const String paddleApiKey = String.fromEnvironment(
    'PADDLE_API_KEY',
    defaultValue: '',
  );
  static const String adyenApiKey = String.fromEnvironment(
    'ADYEN_API_KEY',
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
  static const double platformRevenueCut = 0.70;    // 70% to platform (free tier)
  static const double creatorRevenueCut = 0.30;     // 30% to creator (free tier)
  static const double proCreatorRevenueCut = 0.70;  // 70% to creator Pro (30% to platform)

  // ─── Subscription ─────────────────────────────────────────────
  static const double creatorProMonthlyUsd = 9.99;
  static const double creatorProYearlyUsd = 99.99;
  static const double marketplaceFeePercent = 0.05; // 5% fee

  // ─── AppLovin / Meta Audience Network (PLACEHOLDER) ──────────
  // TODO: Replace with production keys when live.
  static const String appLovinSdkKey = String.fromEnvironment(
    'APPLOVIN_SDK_KEY',
    defaultValue: '', // inject via --dart-define when live
  );
  static const String metaAudienceNetworkAppId = String.fromEnvironment(
    'META_AUDIENCE_NETWORK_APP_ID',
    defaultValue: '', // inject via --dart-define when live
  );
}
