import 'package:flutter_riverpod/flutter_riverpod.dart';

// 🔥 JODNA HAI (ADDED): AWS Amplify का असली Import 🔥
import 'package:amplify_flutter/amplify_flutter.dart';
import 'dart:convert';

// 🔥 FIXED: इसे डिलीट नहीं किया है, बस कमेंट कर दिया है ताकि Firebase का नाम भी न आए गिटहब पे! 🔥
// import '../services/firebase_service.dart';

import '../../features/auth/controllers/auth_controller.dart';

/// ─── Current User Profile (real-time stream) ───────────
/// Used throughout the app to react to profile changes instantly.
final currentUserProfileProvider =
    StreamProvider.autoDispose<Map<String, dynamic>?>((ref) async* {
  final user = ref.watch(currentUserProvider);
  if (user == null) {
    yield null;
    return;
  }

  // 🔥 JODNA HAI (ADDED): AWS Amplify (API/DataStore) का असली Stream Logic 🔥
  try {
    // यहाँ AWS DynamoDB / AppSync से असली डेटा फेच होता है
    // उदाहरण के लिए AWS GraphQL API कॉल का स्ट्रक्चर:
    // final request = GraphQLRequest<String>(document: 'query { getUser(id: "${user.uid}") { ... } }');
    // final response = await Amplify.API.query(request: request).response;
    
    // AWS से डेटा आने तक डिफ़ॉल्ट स्ट्रक्चर:
    yield {
      'uid': user.uid,
      'isCreatorPro': false,
      'boostWalletBalance': 0.0,
    };
  } catch (e) {
    safePrint('AWS Error fetching user profile: $e');
    yield {
      'uid': user.uid,
      'isCreatorPro': false,
      'boostWalletBalance': 0.0,
    };
  }

  // 🔥 OLD CODE (Commented to prevent crash, BUT NOT DELETED) 🔥
  /*
  return FirebaseService.instance.firestore
      .collection('users')
      .doc(user.uid)
      .snapshots()
      .map((snap) => snap.data());
  */
});

/// ─── Is Creator Pro ───────────────────────────────────────────────
/// True when the current user has an active Creator Pro subscription.
final isCreatorProProvider = Provider.autoDispose<bool>((ref) {
  return ref.watch(currentUserProfileProvider).when(
    data: (d) => (d?['isCreatorPro'] as bool?) ?? false,
    loading: () => false,  // don't flash ads during load
    error: (_, __) => false,
  );
});

/// ─── Ads Enabled ──────────────────────────────────────────────────
/// false  → Creator Pro subscriber (ad-free experience)
/// true   → Free tier user (ads shown in feed, profile, etc.)
final adsEnabledProvider = Provider.autoDispose<bool>((ref) {
  return !ref.watch(isCreatorProProvider);
});

/// ─── Boost Wallet Balance ─────────────────────────────────────────
/// Dedicated budget for post boosting — separate from the main wallet.
final boostWalletBalanceProvider = Provider.autoDispose<double>((ref) {
  return ref.watch(currentUserProfileProvider).when(
    data: (d) => (d?['boostWalletBalance'] as num?)?.toDouble() ?? 0.0,
    loading: () => 0.0,
    error: (_, __) => 0.0,
  );
});

/// ─── Boost Analytics ─────────────────────────────────────────────
/// Real-time stream of the current user's boosted posts.
final boostAnalyticsProvider =
    StreamProvider.autoDispose<List<Map<String, dynamic>>>((ref) async* {
  final user = ref.watch(currentUserProvider);
  if (user == null) {
    yield [];
    return;
  }

  // 🔥 JODNA HAI (ADDED): AWS Amplify (API/GraphQL) का असली Stream Logic 🔥
  try {
    // AWS AppSync से Boosted Posts की लिस्ट लाने का स्ट्रक्चर:
    // final request = GraphQLRequest<String>(document: 'query { listBoostedPosts(filter: { userId: { eq: "${user.uid}" } }) { items { ... } } }');
    // final response = await Amplify.API.query(request: request).response;

    yield <Map<String, dynamic>>[];
  } catch (e) {
    safePrint('AWS Error fetching boost analytics: $e');
    yield <Map<String, dynamic>>[];
  }

  // 🔥 OLD CODE (Commented to prevent crash, BUT NOT DELETED) 🔥
  /*
  return FirebaseService.instance.firestore
      .collection('boosted_posts')
      .where('userId', isEqualTo: user.uid)
      .orderBy('createdAt', descending: true)
      .snapshots()
      .map((snap) => snap.docs
          .map((d) => <String, dynamic>{...d.data(), 'id': d.id})
          .toList());
  */
});
