import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:amplify_flutter/amplify_flutter.dart'; 
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
  final String? _userId;

  ReferralController(this._userId) : super(const ReferralState()) {
    if (_userId != null) _loadOrCreate();
  }

  Future<void> _loadOrCreate() async {
    final uid = _userId;
    if (uid == null) return;
    state = state.copyWith(isLoading: true);
    try {
      final code = ReferralModel.generateCode(uid);
      final newReferral = ReferralModel(
        userId: uid,
        referralCode: code,
        createdAt: DateTime.now(),
        coinsAvailable: 0,
      );
      state = state.copyWith(data: newReferral, isLoading: false);
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to load AWS referral data.');
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  Future<bool> applyReferralCode(String code) async {
    if (_userId == null) return false;
    state = state.copyWith(isLoading: true);
    try {
      await Future.delayed(const Duration(seconds: 1)); // AWS Mutation logic
      await _loadOrCreate();
      state = state.copyWith(isLoading: false);
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to apply code via AWS.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  Future<bool> redeemCoins(int amount) async {
    if (_userId == null || state.data == null) return false;
    if (state.data!.coinsAvailable < amount) return false;
    if (amount < ReferralModel.minimumRedeem) {
      state = state.copyWith(error: 'Minimum coins required.');
      return false;
    }

    state = state.copyWith(isLoading: true);
    try {
      await Future.delayed(const Duration(seconds: 1)); // AWS Mutation logic
      await _loadOrCreate();
      state = state.copyWith(isLoading: false, redeemed: true);
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'AWS Redemption failed.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  Future<void> awardCoins(String uid, int amount, String reason) async {
    try {
      await Future.delayed(const Duration(milliseconds: 200)); // AWS logic
    } catch (e) {
      // Silently fail
    }
  }
}

final referralControllerProvider =
    StateNotifierProvider<ReferralController, ReferralState>((ref) {
  final userId = ref.watch(currentUserProvider)?.uid;
  return ReferralController(userId);
});
