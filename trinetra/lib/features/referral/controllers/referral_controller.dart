import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/services/firebase_service.dart';
import '../../../core/services/sentry_service.dart';
import '../../auth/controllers/auth_controller.dart';
import '../models/referral_model.dart';

class ReferralState {
  final ReferralModel? data;
  final bool isLoading;
  final String? error;
  final bool redeemed;

  const ReferralState({
    this.data,
    this.isLoading = false,
    this.error,
    this.redeemed = false,
  });

  ReferralState copyWith({
    ReferralModel? data,
    bool? isLoading,
    String? error,
    bool? redeemed,
  }) =>
      ReferralState(
        data: data ?? this.data,
        isLoading: isLoading ?? this.isLoading,
        error: error,
        redeemed: redeemed ?? this.redeemed,
      );
}

class ReferralController extends StateNotifier<ReferralState> {
  final FirebaseFirestore _firestore;
  final String? _userId;

  ReferralController(this._userId)
      : _firestore = FirebaseService.instance.firestore,
        super(const ReferralState()) {
    if (_userId != null) _loadOrCreate();
  }

  Future<void> _loadOrCreate() async {
    final uid = _userId;
    if (uid == null) return;
    state = state.copyWith(isLoading: true);
    try {
      final doc = await _firestore.collection('referrals').doc(uid).get();
      if (doc.exists) {
        state = state.copyWith(
          data: ReferralModel.fromFirestore(doc),
          isLoading: false,
        );
      } else {
        // Create referral record for new user
        final code = ReferralModel.generateCode(uid);
        final newReferral = ReferralModel(
          userId: uid,
          referralCode: code,
          createdAt: DateTime.now(),
          coinsAvailable: 0,
        );
        await _firestore
            .collection('referrals')
            .doc(uid)
            .set(newReferral.toFirestore());
        state = state.copyWith(data: newReferral, isLoading: false);
      }
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to load referral data.');
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // ─── Apply Referral Code ────────────────────────────────────
  /// Called when a new user enters a referral code during signup
  Future<bool> applyReferralCode(String code) async {
    if (_userId == null) return false;
    state = state.copyWith(isLoading: true);
    try {
      // Find referrer
      final query = await _firestore
          .collection('referrals')
          .where('referralCode', isEqualTo: code.toUpperCase())
          .limit(1)
          .get();

      if (query.docs.isEmpty) {
        state = state.copyWith(isLoading: false, error: 'Invalid referral code.');
        return false;
      }

      final referrerId = query.docs.first.id;
      if (referrerId == _userId) {
        state = state.copyWith(
          isLoading: false,
          error: 'You cannot use your own referral code.',
        );
        return false;
      }

      final batch = _firestore.batch();

      // Award coins to referrer
      batch.update(
        _firestore.collection('referrals').doc(referrerId),
        {
          'referredUserIds': FieldValue.arrayUnion([_userId]),
          'totalCoinsEarned': FieldValue.increment(ReferralModel.coinsPerReferral),
          'coinsAvailable': FieldValue.increment(ReferralModel.coinsPerReferral),
        },
      );

      // Award welcome bonus to new user
      batch.update(
        _firestore.collection('referrals').doc(_userId),
        {
          'referredByUid': referrerId,
          'totalCoinsEarned': FieldValue.increment(ReferralModel.welcomeBonus),
          'coinsAvailable': FieldValue.increment(ReferralModel.welcomeBonus),
        },
      );

      await batch.commit();
      await _loadOrCreate();
      state = state.copyWith(isLoading: false);
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to apply code.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  // ─── Redeem Coins ───────────────────────────────────────────
  /// Redeem coins as ad credits or request payout
  Future<bool> redeemCoins(int amount) async {
    if (_userId == null || state.data == null) return false;
    if (state.data!.coinsAvailable < amount) return false;
    if (amount < ReferralModel.minimumRedeem) {
      state = state.copyWith(
        error: 'Minimum ${ReferralModel.minimumRedeem} coins required to redeem.',
      );
      return false;
    }

    state = state.copyWith(isLoading: true);
    try {
      await _firestore.collection('referrals').doc(_userId).update({
        'coinsAvailable': FieldValue.increment(-amount),
        'coinsRedeemed': FieldValue.increment(amount),
      });
      await _loadOrCreate();
      state = state.copyWith(isLoading: false, redeemed: true);
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Redemption failed.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  // ─── Award Coins (Internal) ─────────────────────────────────
  /// Award coins for activities (posting, watching ads, etc.)
  Future<void> awardCoins(String uid, int amount, String reason) async {
    try {
      await _firestore.collection('referrals').doc(uid).update({
        'totalCoinsEarned': FieldValue.increment(amount),
        'coinsAvailable': FieldValue.increment(amount),
      });
    } catch (e) {
      // Silently fail — coin awarding is non-critical
    }
  }
}

// ─── Provider ────────────────────────────────────────────────────
final referralControllerProvider =
    StateNotifierProvider<ReferralController, ReferralState>((ref) {
  final userId = ref.watch(currentUserProvider)?.uid;
  return ReferralController(userId);
});
