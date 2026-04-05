import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'dart:convert';

// 🔥 FIREBASE KHATAM (Commented for reference only) 🔥
// import '../services/firebase_service.dart';

import '../../features/auth/controllers/auth_controller.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER USER PROVIDER (100% AWS AppSync Live)
// Handles: Wallet, 5 Payments Status, 6-in-1 AI Tier, Ads Logic
// ==============================================================

/// ─── 1. Current User Profile (REAL-TIME AWS STREAM) ───────────
final currentUserProfileProvider = StreamProvider.autoDispose<Map<String, dynamic>?>((ref) async* {
  final user = ref.watch(currentUserProvider);
  if (user == null) {
    yield null;
    return;
  }

  // 🔥 100% ASLI AWS APPSYNC SUBSCRIPTION (Real-time update like Facebook)
  try {
    // 1. Pehle database se initial data fetch karo
    final queryReq = GraphQLRequest<String>(
      document: '''query GetTriNetraUser { 
        getUser(id: "${user.uid}") { 
          id isCreatorPro boostWalletBalance currentAiTier isAutoEscalationActive
        } 
      }'''
    );
    final initialResponse = await Amplify.API.query(request: queryReq).response;
    if (initialResponse.data != null) {
      final dataMap = jsonDecode(initialResponse.data!);
      yield dataMap['getUser'];
    }

    // 2. Uske baad AWS ka LIVE Connection (WebSockets) chalu karo
    final subReq = GraphQLRequest<String>(
      document: '''subscription OnUpdateTriNetraUser { 
        onUpdateUser(id: "${user.uid}") { 
          id isCreatorPro boostWalletBalance currentAiTier isAutoEscalationActive
        } 
      }'''
    );
    
    // Jaise hi user PayU/PayPal se payment karega, bina refresh kiye balance update hoga
    final Stream<GraphQLResponse<String>> operation = Amplify.API.subscribe(
      subReq,
      onEstablished: () => safePrint('✅ AWS Live Sync Established for User: ${user.uid}'),
    );

    // Stream the live changes to the app UI
    await for (final event in operation) {
      if (event.data != null) {
        final liveData = jsonDecode(event.data!);
        yield liveData['onUpdateUser'];
      }
    }
  } catch (e) {
    safePrint('🚨 AWS TriNetra Profile Stream Error: $e');
    // Fallback error state (Not dummy, actual error handling)
    yield null;
  }
});

/// ─── 2. Economy: Is Creator Pro (Point 6 Blueprint) ───────────
final isCreatorProProvider = Provider.autoDispose<bool>((ref) {
  return ref.watch(currentUserProfileProvider).when(
    data: (d) => (d?['isCreatorPro'] as bool?) ?? false,
    loading: () => false,  
    error: (_, __) => false,
  );
});

/// ─── 3. Economy: Ads Enabled (70/30 vs 100% User) ─────────────
final adsEnabledProvider = Provider.autoDispose<bool>((ref) {
  // Agar user Pro nahi hai, toh AdMob/AppLovin chalega (70/30 revenue)
  return !ref.watch(isCreatorProProvider);
});

/// ─── 4. Economy: Wallet Balance (PayU/PayPal Sync) ────────────
final boostWalletBalanceProvider = Provider.autoDispose<double>((ref) {
  return ref.watch(currentUserProfileProvider).when(
    data: (d) => (d?['boostWalletBalance'] as num?)?.toDouble() ?? 0.0,
    loading: () => 0.0,
    error: (_, __) => 0.0,
  );
});

/// ─── 5. AI ENGINE: Active AI Tier (Point 11 Blueprint) ────────
final activeAiTierProvider = Provider.autoDispose<String>((ref) {
  return ref.watch(currentUserProfileProvider).when(
    data: (d) => (d?['currentAiTier'] as String?) ?? 'FREE_BASIC', // Fallback to Meta AI basic
    loading: () => 'FREE_BASIC',
    error: (_, __) => 'FREE_BASIC',
  );
});

/// ─── 6. Boost Analytics (REAL-TIME AWS STREAM) ────────────────
final boostAnalyticsProvider = StreamProvider.autoDispose<List<Map<String, dynamic>>>((ref) async* {
  final user = ref.watch(currentUserProvider);
  if (user == null) {
    yield [];
    return;
  }

  // 🔥 100% ASLI AWS LIVE ANALYTICS STREAM
  try {
    final subReq = GraphQLRequest<String>(
      document: '''subscription OnUserBoostsUpdated {
        onUpdateBoost(userId: "${user.uid}") {
          id reach impressions spend amount clicks
        }
      }'''
    );

    final Stream<GraphQLResponse<String>> operation = Amplify.API.subscribe(
      subReq,
      onEstablished: () => safePrint('✅ AWS Analytics Sync Active'),
    );

    await for (final event in operation) {
      if (event.data != null) {
        final rawList = jsonDecode(event.data!)['onUpdateBoost'] as List;
        yield rawList.cast<Map<String, dynamic>>();
      }
    }
  } catch (e) {
    safePrint('🚨 AWS Analytics Stream Error: $e');
    yield [];
  }
});
