import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

// 🔥 ASLI ADS SDKs
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:applovin_max/applovin_max.dart';
import 'package:facebook_audience_network/facebook_audience_network.dart';

// 🔥 ASLI AWS BACKEND
import 'package:amplify_flutter/amplify_flutter.dart';

// ==============================================================
// 👁️🔥 TRINETRA ADS & MONETIZATION SERVICE (Facebook 2026 Standard)
// 100% REAL: AdMob + AppLovin + Meta Ads
// Point 7: Free Boost (70/30 Split) via AWS AppSync
// ==============================================================

class AdsService {
  AdsService._();
  static final AdsService instance = AdsService._();

  bool _initialized = false;
  RewardedAd? _rewardedAd;

  // ─── ASLI KEYS (.env Master Vault से) ─────────────────────────
  static String get _appLovinSdkKey => dotenv.env['APPLOVIN_SDK_KEY'] ?? '';
  
  // OS Detection for Real AdMob Rewarded IDs
  static String get _adMobRewardedId {
    return defaultTargetPlatform == TargetPlatform.iOS 
        ? (dotenv.env['ADMOB_REWARDED_IOS'] ?? '') 
        : (dotenv.env['ADMOB_REWARDED_ANDROID'] ?? '');
  }

  // ─── 1. INITIALIZE ALL 3 NETWORKS (100% REAL) ─────────────────
  Future<void> initializeAllAds() async {
    if (kIsWeb || _initialized) return; // Web handles ads via JS

    try {
      // 1. Initialize Google AdMob
      await MobileAds.instance.initialize();

      // 2. Initialize AppLovin MAX
      if (_appLovinSdkKey.isNotEmpty) {
        await AppLovinMAX.initialize(_appLovinSdkKey);
      }

      // 3. Initialize Meta Audience Network (No Testing IDs allowed)
      await FacebookAudienceNetwork.init(
        iOSAdvertiserTrackingEnabled: true,
      );

      _initialized = true;
      _preloadRewardedAd(); // Background preload for zero wait time
      
      safePrint('🚀 TriNetra: AdMob + AppLovin + Meta Ads 100% LIVE!');
    } catch (e, stackTrace) {
      safePrint('🚨 Ads Initialization Error: $e');
      Sentry.captureException(e, stackTrace: stackTrace); // 0% Firebase, 100% Sentry
    }
  }

  // ─── 2. PRELOAD REWARDED AD (For Free Boost) ───────────────────
  void _preloadRewardedAd() {
    if (!_initialized || _adMobRewardedId.isEmpty) return;
    
    RewardedAd.load(
      adUnitId: _adMobRewardedId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          _rewardedAd = ad;
        },
        onAdFailedToLoad: (LoadAdError error) {
          _rewardedAd = null;
          Sentry.captureMessage('AdMob Preload Failed: ${error.message}');
        },
      ),
    );
  }

  // ─── 3. FREE BOOST LOGIC (Point 7: 70/30 Split via AWS) ────────
  void showRewardAdForBoost({
    required String postId,
    required String userId,
    required VoidCallback onSuccess,
    required VoidCallback onError,
  }) {
    if (_rewardedAd == null) {
      onError();
      _preloadRewardedAd(); 
      return;
    }

    _rewardedAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _preloadRewardedAd(); // Load next ad immediately
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        ad.dispose();
        _preloadRewardedAd();
        onError();
      },
    );

    _rewardedAd!.show(onUserEarnedReward: (AdWithoutView ad, RewardItem reward) async {
      // 🔥 ASLI KAAM: Add watched successfully, hitting AWS AppSync for 70/30 Split
      try {
        final request = GraphQLRequest<String>(
          document: '''
            mutation ApplyFreeBoost(\$postId: ID!, \$userId: ID!) {
              applyTriNetraFreeBoost(postId: \$postId, userId: \$userId) {
                status
                wallet_user_credited
                wallet_trinetra_credited
              }
            }
          ''',
          variables: {
            'postId': postId,
            'userId': userId,
          },
        );
        
        await Amplify.API.query(request: request).response;
        safePrint('✅ TriNetra Economy: Free Boost Applied! (70/30 split saved in AWS)');
        onSuccess();
      } catch (e, stackTrace) {
        safePrint('🚨 AWS Wallet Update Error: $e');
        Sentry.captureException(e, stackTrace: stackTrace);
        onError();
      }
    });

    _rewardedAd = null;
  }
}

// ==============================================================
// 🌟 TRINETRA UNIVERSAL BANNER AD (Auto-Detect OS)
// ==============================================================
class TriNetraBannerAd extends StatefulWidget {
  const TriNetraBannerAd({super.key});

  @override
  State<TriNetraBannerAd> createState() => _TriNetraBannerAdState();
}

class _TriNetraBannerAdState extends State<TriNetraBannerAd> {
  BannerAd? _bannerAd;
  bool _isLoaded = false;

  // OS Detection for Real AdMob Banner IDs
  String get _adMobBannerId {
    return defaultTargetPlatform == TargetPlatform.iOS 
        ? (dotenv.env['ADMOB_BANNER_IOS'] ?? '') 
        : (dotenv.env['ADMOB_BANNER_ANDROID'] ?? '');
  }

  @override
  void initState() {
    super.initState();
    if (AdsService.instance._initialized && _adMobBannerId.isNotEmpty) {
      _loadBanner();
    }
  }

  void _loadBanner() {
    _bannerAd = BannerAd(
      adUnitId: _adMobBannerId,
      size: AdSize.banner,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (_) {
          if (mounted) setState(() => _isLoaded = true);
        },
        onAdFailedToLoad: (ad, LoadAdError error) {
          ad.dispose();
          Sentry.captureMessage('Banner Load Failed: ${error.message}');
        },
      ),
    )..load();
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (kIsWeb || !_isLoaded || _bannerAd == null) return const SizedBox.shrink();
    
    return Container(
      alignment: Alignment.center,
      margin: const EdgeInsets.symmetric(vertical: 8),
      width: _bannerAd!.size.width.toDouble(),
      height: _bannerAd!.size.height.toDouble(),
      child: AdWidget(ad: _bannerAd!),
    );
  }
}
