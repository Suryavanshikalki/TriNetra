import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import '../config/ads_config.dart';

// ─── Ads Service ──────────────────────────────────────────────────
/// Manages Google Mobile Ads lifecycle (mobile-only).
/// AppLovin/Meta Ads stubs are included for future activation.
class AdsService {
  AdsService._();
  static final AdsService instance = AdsService._();

  bool _initialized = false;
  InterstitialAd? _interstitialAd;
  int _postViewCount = 0;

  // ─── Initialize ────────────────────────────────────────────────
  Future<void> initialize() async {
    if (kIsWeb || _initialized) return;
    await MobileAds.instance.initialize();
    _initialized = true;
    _preloadInterstitial();
    if (kDebugMode) {
      debugPrint('[AdsService] Google Mobile Ads initialized. Publisher: ${AdsConfig.publisherId}');
    }
  }

  // ─── Interstitial ──────────────────────────────────────────────
  void _preloadInterstitial() {
    InterstitialAd.load(
      adUnitId: AdsConfig.interstitialAdUnit,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _interstitialAd = ad;
          if (kDebugMode) debugPrint('[AdsService] Interstitial pre-loaded');
        },
        onAdFailedToLoad: (error) {
          _interstitialAd = null;
          if (kDebugMode) debugPrint('[AdsService] Interstitial load failed: $error');
        },
      ),
    );
  }

  void showInterstitialIfReady() {
    if (!isAvailable || _interstitialAd == null) return;
    _interstitialAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _preloadInterstitial();
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        ad.dispose();
        _preloadInterstitial();
      },
    );
    _interstitialAd!.show();
    _interstitialAd = null;
  }

  /// Call this each time a post is viewed — shows interstitial every 10 views
  void trackPostView() {
    if (!isAvailable) return;
    _postViewCount++;
    if (_postViewCount % 10 == 0) {
      showInterstitialIfReady();
    }
  }

  // ─── AppLovin Structural Placeholder ─────────────────────────
  /// Activate once AppLovin Max account is registered.
  /// SDK: applovin_max (add to pubspec.yaml when ready)
  Future<void> initializeAppLovin() async {
    if (AdsConfig.appLovinSdkKey.isEmpty) {
      if (kDebugMode) debugPrint('[AdsService] AppLovin: Pending account setup');
      return;
    }
    // TODO: await AppLovinMAX.initialize(AdsConfig.appLovinSdkKey);
  }

  // ─── Meta Audience Network Structural Placeholder ─────────────
  /// Activate once Meta Business account is verified.
  /// SDK: meta_audience_network (add to pubspec.yaml when ready)
  Future<void> initializeMetaAds() async {
    if (AdsConfig.metaAdsAppId.isEmpty) {
      if (kDebugMode) debugPrint('[AdsService] Meta Ads: Pending account setup');
      return;
    }
    // TODO: await AudienceNetwork.init(isForDirectedToChildren: false);
  }

  bool get isAvailable => !kIsWeb && _initialized;
}

// ─── TriNetra Banner Ad Widget ────────────────────────────────────
/// Drop-in banner ad widget with automatic lifecycle management.
/// Returns SizedBox.shrink() on web or when ads are unavailable.
class TriNetraBannerAd extends StatefulWidget {
  const TriNetraBannerAd({super.key});

  @override
  State<TriNetraBannerAd> createState() => _TriNetraBannerAdState();
}

class _TriNetraBannerAdState extends State<TriNetraBannerAd> {
  BannerAd? _bannerAd;
  bool _isLoaded = false;

  @override
  void initState() {
    super.initState();
    if (AdsService.instance.isAvailable) _loadBanner();
  }

  void _loadBanner() {
    _bannerAd = BannerAd(
      adUnitId: AdsConfig.bannerAdUnit,
      size: AdSize.banner,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (_) {
          if (mounted) setState(() => _isLoaded = true);
        },
        onAdFailedToLoad: (ad, error) {
          ad.dispose();
          if (kDebugMode) {
            debugPrint('[AdsService] Banner failed: $error');
          }
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
    if (kIsWeb || !_isLoaded || _bannerAd == null) {
      return const SizedBox.shrink();
    }
    return Container(
      alignment: Alignment.center,
      margin: const EdgeInsets.symmetric(vertical: 8),
      width: _bannerAd!.size.width.toDouble(),
      height: _bannerAd!.size.height.toDouble(),
      child: AdWidget(ad: _bannerAd!),
    );
  }
}
