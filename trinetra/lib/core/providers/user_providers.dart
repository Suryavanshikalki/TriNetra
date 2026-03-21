import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/firebase_service.dart';
import '../../features/auth/controllers/auth_controller.dart';

/// ─── Current User Firestore Profile (real-time stream) ───────────
/// Used throughout the app to react to profile changes instantly.
final currentUserProfileProvider =
    StreamProvider.autoDispose<Map<String, dynamic>?>((ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return Stream.value(null);
  return FirebaseService.instance.firestore
      .collection('users')
      .doc(user.uid)
      .snapshots()
      .map((snap) => snap.data());
});

/// ─── Is Creator Pro ───────────────────────────────────────────────
/// True when the current user has an active Creator Pro subscription.
/// Updates instantly when Firestore doc changes (e.g. after payment).
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
/// 
/// Every ad widget MUST read this provider before rendering.
/// This is the single source of truth for the ad-free logic.
final adsEnabledProvider = Provider.autoDispose<bool>((ref) {
  return !ref.watch(isCreatorProProvider);
});

/// ─── Boost Wallet Balance ─────────────────────────────────────────
/// Dedicated budget for post boosting — separate from the main wallet.
/// Stored in Firestore: users/{uid}.boostWalletBalance
final boostWalletBalanceProvider = Provider.autoDispose<double>((ref) {
  return ref.watch(currentUserProfileProvider).when(
    data: (d) => (d?['boostWalletBalance'] as num?)?.toDouble() ?? 0.0,
    loading: () => 0.0,
    error: (_, __) => 0.0,
  );
});
