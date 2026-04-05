import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:amplify_flutter/amplify_flutter.dart'; // 🔥 ASLI AWS IMPORT

// 🔥 100% CRASH & ANALYTICS TRACKING
import '../../../core/config/app_config.dart';
import '../../../core/services/sentry_service.dart';
import '../../../core/services/logrocket_service.dart';
import '../../auth/controllers/auth_controller.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER CREATOR ECONOMY ENGINE (Facebook 2026 Standard)
// Blueprint Point 6 & 7-10: 70/30, 25/75, and 100% Revenue Splits
// 0% Dummy | 100% AWS AppSync Live Payouts
// ==============================================================

// ─── 1. ASLI CREATOR ANALYTICS MODEL ──────────────────────────────
class CreatorStats {
  final int totalPosts;
  final int totalViews;
  final int totalAdImpressions;
  final double grossAdRevenue;
  final double creatorEarnings; // 30% for free, 100% for Pro
  final double pendingPayout;
  final double paidOut;
  final bool isCreatorPro;
  final List<PayoutRecord> payoutHistory;

  const CreatorStats({
    this.totalPosts = 0,
    this.totalViews = 0,
    this.totalAdImpressions = 0,
    this.grossAdRevenue = 0.0,
    this.creatorEarnings = 0.0,
    this.pendingPayout = 0.0,
    this.paidOut = 0.0,
    this.isCreatorPro = false,
    this.payoutHistory = const [],
  });

  double get cpm => totalAdImpressions > 0 ? (grossAdRevenue / totalAdImpressions) * 1000 : 0;

  factory CreatorStats.fromMap(Map<String, dynamic> d) {
    final history = (d['payoutHistory'] as List?)
            ?.map((e) => PayoutRecord.fromMap(e as Map<String, dynamic>))
            .toList() ?? [];
            
    return CreatorStats(
      totalPosts: d['totalPosts'] ?? 0,
      totalViews: d['totalViews'] ?? 0,
      totalAdImpressions: d['totalAdImpressions'] ?? 0,
      grossAdRevenue: (d['grossAdRevenue'] ?? 0).toDouble(),
      creatorEarnings: (d['creatorEarnings'] ?? 0).toDouble(),
      pendingPayout: (d['pendingPayout'] ?? 0).toDouble(),
      paidOut: (d['paidOut'] ?? 0).toDouble(),
      isCreatorPro: d['isCreatorPro'] ?? false,
      payoutHistory: history,
    );
  }
}

class PayoutRecord {
  final String id;
  final double amount;
  final String method; // 'payu', 'paypal', 'bank_transfer', 'paddle'
  final String status; // 'pending', 'processing', 'paid'
  final DateTime date;

  const PayoutRecord({
    required this.id,
    required this.amount,
    required this.method,
    required this.status,
    required this.date,
  });

  factory PayoutRecord.fromMap(Map<String, dynamic> map) => PayoutRecord(
        id: map['id'] ?? '',
        amount: (map['amount'] ?? 0).toDouble(),
        method: map['method'] ?? 'bank_transfer',
        status: map['status'] ?? 'pending',
        date: map['date'] != null 
            ? DateTime.tryParse(map['date'].toString()) ?? DateTime.now() 
            : DateTime.now(),
      );
}

// ─── 2. CREATOR CONTROLLER STATE ──────────────────────────────────
class CreatorState {
  final CreatorStats? stats;
  final bool isLoading;
  final String? error;
  final String? message;

  const CreatorState({
    this.stats,
    this.isLoading = false,
    this.error,
    this.message,
  });

  CreatorState copyWith({
    CreatorStats? stats,
    bool? isLoading,
    String? error,
    String? message,
  }) => CreatorState(
        stats: stats ?? this.stats,
        isLoading: isLoading ?? this.isLoading,
        error: error,
        message: message,
      );
}

// ─── 3. THE ASLI ECONOMY ENGINE CONTROLLER ────────────────────────
class CreatorController extends StateNotifier<CreatorState> {
  final String? _userId;

  CreatorController(this._userId) : super(const CreatorState()) {
    if (_userId != null) _loadStats();
  }

  // 🔥 100% REAL AWS APPSYNC DATA FETCH (No Dummies)
  Future<void> _loadStats() async {
    if (_userId == null) return;
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final request = GraphQLRequest<String>(
        document: '''
          query GetCreatorWallet(\$userId: ID!) {
            getCreatorStats(userId: \$userId) {
              isCreatorPro grossAdRevenue creatorEarnings totalPosts totalViews 
              totalAdImpressions pendingPayout paidOut 
              payoutHistory { id amount method status date }
            }
          }
        ''',
        variables: {'userId': _userId},
      );
      
      final response = await Amplify.API.query(request: request).response;
      
      if (response.data != null) {
        final Map<String, dynamic> data = jsonDecode(response.data!);
        state = state.copyWith(
          stats: CreatorStats.fromMap(data['getCreatorStats'] ?? {}),
          isLoading: false,
        );
      } else {
        throw Exception('Empty Wallet Data Received');
      }
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to securely load wallet stats.');
      SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // ─── 4. ASLI PAYOUT REQUEST TO TRI-NETRA BANK (Point 6 Blueprint)
  Future<bool> requestPayout({
    required double amount,
    required String method, // 'payu', 'paypal', 'bank_transfer'
    required String destination, // Account details
  }) async {
    if (_userId == null || state.stats == null) return false;
    
    if (amount < 100) {
      state = state.copyWith(error: 'TriNetra Economy: Minimum payout amount is ₹100.');
      return false;
    }
    if ((state.stats!.pendingPayout) < amount) {
      state = state.copyWith(error: 'Insufficient TriNetra wallet balance.');
      return false;
    }

    state = state.copyWith(isLoading: true, error: null, message: null);
    
    try {
      // 🔥 ASLI MUTATION TO AWS
      final request = GraphQLRequest<String>(
        document: '''
          mutation ProcessCreatorPayout(\$userId: ID!, \$amount: Float!, \$method: String!, \$dest: String!) {
            requestPayout(userId: \$userId, amount: \$amount, method: \$method, destination: \$dest) {
              status
              message
            }
          }
        ''',
        variables: {
          'userId': _userId,
          'amount': amount,
          'method': method,
          'dest': destination,
        },
      );

      await Amplify.API.query(request: request).response;
      
      // Analytics & Tracking
      LogRocketService.instance.track('PAYOUT_REQUESTED', properties: {'amount': amount, 'method': method});
      SentryService.instance.addBreadcrumb('Payout of ₹$amount requested via $method');

      await _loadStats(); // Refresh real-time balance
      
      state = state.copyWith(
        isLoading: false,
        message: 'TriNetra Payout request submitted! Bank transfer processing within 3-5 business days.',
      );
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Payout request failed securely.');
      SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  // ─── 5. ACTIVATE CREATOR PRO (100% Split Model - Point 9) ───────
  Future<bool> activateCreatorPro({
    required String paymentId,
    required String planType, // 'monthly_799' or 'daily'
  }) async {
    if (_userId == null) return false;
    
    state = state.copyWith(isLoading: true, error: null);
    try {
      // 🔥 ASLI AWS SUBSCRIPTION SYNC
      final request = GraphQLRequest<String>(
        document: '''
          mutation ActivateProTier(\$userId: ID!, \$paymentId: String!, \$planType: String!) {
            upgradeToCreatorPro(userId: \$userId, paymentId: \$paymentId, planType: \$planType) {
              isCreatorPro
            }
          }
        ''',
        variables: {
          'userId': _userId,
          'paymentId': paymentId,
          'planType': planType,
        },
      );
      
      await Amplify.API.query(request: request).response;
      
      // Analytics sync
      LogRocketService.instance.track('CREATOR_PRO_ACTIVATED', properties: {'plan': planType});
      
      await _loadStats(); // Update UI
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to verify Pro Subscription.');
      SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  Future<void> refresh() => _loadStats();
}

// ─── 6. PROVIDERS ─────────────────────────────────────────────────
final creatorControllerProvider = StateNotifierProvider<CreatorController, CreatorState>((ref) {
  final user = ref.watch(currentUserProvider);
  return CreatorController(user?.uid);
});
