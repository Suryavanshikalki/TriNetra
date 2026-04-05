import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER ADS & REVENUE ENGINE (Facebook 2026 Standard)
// Point 6: 70/30 & 25/75 Boost Economy (AdMob + AppLovin + Meta Ads)
// 100% Asli Keys via .env Vault | No Dummy Test IDs
// ==============================================================

class TriNetraAdsEngine {
  TriNetraAdsEngine._();

  // ─── TRINETRA MASTER PUBLISHER IDENTITY ──────────────────────
  // Asli Publisher ID (from app-ads.txt)
  static const String publisherId = 'pub-6356591837262295';

  // ─── 1. ADMOB REAL AD UNITS (Fetched Securely from .env) ─────
  static String get _bannerAdUnitAndroid => dotenv.env['ADMOB_BANNER_ANDROID'] ?? '';
  static String get _bannerAdUnitIos => dotenv.env['ADMOB_BANNER_IOS'] ?? '';

  static String get _interstitialAdUnitAndroid => dotenv.env['ADMOB_INTERSTITIAL_ANDROID'] ?? '';
  static String get _interstitialAdUnitIos => dotenv.env['ADMOB_INTERSTITIAL_IOS'] ?? '';

  static String get _rewardedAdUnitAndroid => dotenv.env['ADMOB_REWARDED_ANDROID'] ?? '';
  static String get _rewardedAdUnitIos => dotenv.env['ADMOB_REWARDED_IOS'] ?? '';

  // ─── 2. APPLOVIN MAX & META AUDIENCE NETWORK ─────────────────
  static String get appLovinSdkKey => dotenv.env['APPLOVIN_SDK_KEY'] ?? '';
  static String get metaAdsAppId => dotenv.env['META_ADS_APP_ID'] ?? '';

  // ─── 3. TRINETRA ECONOMY RULES (Point 6 Blueprint) ───────────
  // Feed/Reels scroll karte waqt "Free Boost (70/30)" users ko 
  // har 5 post ke baad ek real Ad dikhega.
  static const int feedAdFrequency = 5;

  // ─── 4. 6-PLATFORM AUTO-DETECTION ENGINE ─────────────────────
  // OS check karke Asli Ad dikhane ka logic:
  static String get getBannerAdUnit {
    if (kIsWeb) return ''; // Web platform handle ads via JS/HTML injection
    return defaultTargetPlatform == TargetPlatform.iOS
        ? _bannerAdUnitIos
        : _bannerAdUnitAndroid;
  }

  static String get getInterstitialAdUnit {
    if (kIsWeb) return '';
    return defaultTargetPlatform == TargetPlatform.iOS
        ? _interstitialAdUnitIos
        : _interstitialAdUnitAndroid;
  }

  static String get getRewardedAdUnit {
    if (kIsWeb) return '';
    return defaultTargetPlatform == TargetPlatform.iOS
        ? _rewardedAdUnitIos
        : _rewardedAdUnitAndroid;
  }
}
