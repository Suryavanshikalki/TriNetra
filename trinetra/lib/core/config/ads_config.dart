import 'package:flutter/foundation.dart';

/// AdMob Configuration
/// Publisher: pub-6356591837262295 (from app-ads.txt)
///
/// NOTE: App IDs in AndroidManifest.xml and Info.plist are NOT injectable via
/// --dart-define (native code reads them before Dart runs).
/// Replace the test App IDs in those files with your real ones from the
/// AdMob dashboard: console.admob.google.com
/// Your publisher account: pub-6356591837262295
class AdsConfig {
  AdsConfig._();

  // ─── Publisher ───────────────────────────────────────────────
  static const String publisherId = 'pub-6356591837262295';

  // ─── Test App IDs (hardcoded in manifest files) ──────────────
  /// Replace in android/app/src/main/AndroidManifest.xml
  static const String testAndroidAppId =
      'ca-app-pub-3940256099942544~3347511713';

  /// Replace in ios/Runner/Info.plist (GADApplicationIdentifier)
  static const String testIosAppId =
      'ca-app-pub-3940256099942544~1458002511';

  // ─── Banner Ad Units ─────────────────────────────────────────
  static const String bannerAdUnitAndroid = String.fromEnvironment(
    'ADMOB_BANNER_ANDROID',
    defaultValue: 'ca-app-pub-3940256099942544/6300978111', // Google test
  );
  static const String bannerAdUnitIos = String.fromEnvironment(
    'ADMOB_BANNER_IOS',
    defaultValue: 'ca-app-pub-3940256099942544/2934735716', // Google test
  );

  // ─── Interstitial Ad Units ───────────────────────────────────
  static const String interstitialAdUnitAndroid = String.fromEnvironment(
    'ADMOB_INTERSTITIAL_ANDROID',
    defaultValue: 'ca-app-pub-3940256099942544/1033173712', // Google test
  );
  static const String interstitialAdUnitIos = String.fromEnvironment(
    'ADMOB_INTERSTITIAL_IOS',
    defaultValue: 'ca-app-pub-3940256099942544/4411468910', // Google test
  );

  // ─── Rewarded Ad Units ───────────────────────────────────────
  static const String rewardedAdUnitAndroid = String.fromEnvironment(
    'ADMOB_REWARDED_ANDROID',
    defaultValue: 'ca-app-pub-3940256099942544/5224354917', // Google test
  );
  static const String rewardedAdUnitIos = String.fromEnvironment(
    'ADMOB_REWARDED_IOS',
    defaultValue: 'ca-app-pub-3940256099942544/1712485313', // Google test
  );

  // ─── AppLovin Structural Placeholder ─────────────────────────
  /// TODO: Replace when AppLovin account is ready.
  /// Required SDK: applovin_max (add to pubspec.yaml)
  /// dart-define: APPLOVIN_SDK_KEY
  static const String appLovinSdkKey = String.fromEnvironment(
    'APPLOVIN_SDK_KEY',
    defaultValue: '',
  );

  // ─── Meta Audience Network Structural Placeholder ─────────────
  /// TODO: Replace when Meta Ads account is ready.
  /// dart-define: META_ADS_APP_ID
  static const String metaAdsAppId = String.fromEnvironment(
    'META_ADS_APP_ID',
    defaultValue: '',
  );

  // ─── Ad Frequency ────────────────────────────────────────────
  /// Show a banner ad every N posts in the feed
  static const int feedAdFrequency = 5;

  // ─── Platform Helpers ────────────────────────────────────────
  static String get bannerAdUnit =>
      defaultTargetPlatform == TargetPlatform.iOS
          ? bannerAdUnitIos
          : bannerAdUnitAndroid;

  static String get interstitialAdUnit =>
      defaultTargetPlatform == TargetPlatform.iOS
          ? interstitialAdUnitIos
          : interstitialAdUnitAndroid;

  static String get rewardedAdUnit =>
      defaultTargetPlatform == TargetPlatform.iOS
          ? rewardedAdUnitIos
          : rewardedAdUnitAndroid;
}
