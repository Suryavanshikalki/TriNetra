import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:amplify_flutter/amplify_flutter.dart'; // 🔥 THE REAL AWS IMPORT 🔥
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

  // ─── Load or Create (REAL AWS API) ──────────────────────────
  Future<void> _loadOrCreate() async {
    final uid = _userId;
    if (uid == null) return;
    state = state.copyWith(isLoading: true);
    try {
      // 1. AWS GraphQL Query to get referral data
      const getQuery = '''
        query GetReferral(\$id: ID!) {
          getReferral(id: \$id) {
            userId
            referralCode
            referredByUid
            referredUserIds
            totalCoinsEarned
            coinsAvailable
            coinsRedeemed
            createdAt
          }
        }
      ''';

      final request = GraphQLRequest<String>(
        document: getQuery,
        variables: {'id': uid},
      );

      final response = await Amplify.API.query(request: request).response;

      if (response.data != null && jsonDecode(response.data!)['getReferral'] != null) {
        // Data exists in AWS
        final dataMap = jsonDecode(response.data!)['getReferral'];
        state = state.copyWith(
          data: ReferralModel.fromMap(uid, dataMap),
          isLoading: false,
        );
      } else {
        // 2. Create new referral record in AWS
        final code = ReferralModel.generateCode(uid);
        final newReferral = ReferralModel(
          userId: uid,
          referralCode: code,
          createdAt: DateTime.now(),
          coinsAvailable: 0,
        );

        const createMutation = '''
          mutation CreateReferral(\$input: CreateReferralInput!) {
            createReferral(input: \$input) { userId }
          }
        ''';

        final createReq = GraphQLRequest<String>(
          document: createMutation,
          variables: {'input': newReferral.toMap()},
        );

        await Amplify.API.mutate(request: createReq).response;
        state = state.copyWith(data: newReferral, isLoading: false);
      }
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to load AWS referral data.');
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // ─── Apply Referral Code (REAL AWS API) ─────────────────────
  Future<bool> applyReferralCode(String code) async {
    if (_userId == null) return false;
    state = state.copyWith(isLoading: true);
    try {
      // 1. Search for referrer by code in AWS
      const searchQuery = '''
        query ListReferrals(\$code: String!) {
          listReferrals(filter: { referralCode: { eq: \$code } }, limit: 1) {
            items { userId }
          }
        }
      ''';

      final searchReq = GraphQLRequest<String>(
        document: searchQuery,
        variables: {'code': code.toUpperCase()},
      );

      final response = await Amplify.API.query(request: searchReq).response;
      final items = jsonDecode(response.data ?? '{}')['listReferrals']?['items'] as List?;

      if (items == null || items.isEmpty) {
        state = state.copyWith(isLoading: false, error: 'Invalid referral code.');
        return false;
      }

      final referrerId = items.first['userId'];
      if (referrerId == _userId) {
        state = state.copyWith(isLoading: false, error: 'You cannot use your own referral code.');
        return false;
      }

      // 2. Update AWS Database (Mutation)
      const updateMutation = '''
        mutation ApplyReferral(\$referrerId: ID!, \$newUserId: ID!, \$bonus: Int!, \$refBonus: Int!) {
          applyReferralCode(referrerId: \$referrerId, newUserId: \$newUserId, bonus: \$bonus, refBonus: \$refBonus)
        }
      ''';

      final updateReq = GraphQLRequest<String>(
        document: updateMutation,
        variables: {
          'referrerId': referrerId,
          'newUserId': _userId,
          'bonus': ReferralModel.welcomeBonus,
          'refBonus': ReferralModel.coinsPerReferral,
        },
      );

      await Amplify.API.mutate(request: updateReq).response;

      await _loadOrCreate();
      state = state.copyWith(isLoading: false);
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to apply code via AWS.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  // ─── Redeem Coins (REAL AWS API) ────────────────────────────
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
      // AWS Mutation to deduct coins
      const redeemMutation = '''
        mutation RedeemCoins(\$userId: ID!, \$amount: Int!) {
          redeemUserCoins(userId: \$userId, amount: \$amount)
        }
      ''';

      final request = GraphQLRequest<String>(
        document: redeemMutation,
        variables: {
          'userId': _userId,
          'amount': amount,
        },
      );

      await Amplify.API.mutate(request: request).response;
      
      await _loadOrCreate();
      state = state.copyWith(isLoading: false, redeemed: true);
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'AWS Redemption failed.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  // ─── Award Coins (REAL AWS API) ─────────────────────────────
  Future<void> awardCoins(String uid, int amount, String reason) async {
    try {
      // AWS Mutation to add coins
      const awardMutation = '''
        mutation AwardCoins(\$userId: ID!, \$amount: Int!, \$reason: String!) {
          awardUserCoins(userId: \$userId, amount: \$amount, reason: \$reason)
        }
      ''';

      final request = GraphQLRequest<String>(
        document: awardMutation,
        variables: {
          'userId': uid,
          'amount': amount,
          'reason': reason,
        },
      );

      await Amplify.API.mutate(request: request).response;
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
