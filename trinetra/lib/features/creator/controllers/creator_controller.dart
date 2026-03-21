import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import '../../../core/config/app_config.dart';
import '../../../core/services/firebase_service.dart';
import '../../../core/services/sentry_service.dart';
import '../../auth/controllers/auth_controller.dart';

// ─── Creator Analytics Model ──────────────────────────────────────
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

  double get cpm => totalAdImpressions > 0
      ? (grossAdRevenue / totalAdImpressions) * 1000
      : 0;

  factory CreatorStats.fromFirestore(Map<String, dynamic> d) {
    final history = (d['payoutHistory'] as List?)
            ?.map((e) => PayoutRecord.fromMap(e as Map))
            .toList() ??
        [];
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
  final String method; // 'upi', 'paypal'
  final String status; // 'pending', 'processing', 'paid'
  final DateTime date;

  const PayoutRecord({
    required this.id,
    required this.amount,
    required this.method,
    required this.status,
    required this.date,
  });

  factory PayoutRecord.fromMap(Map map) => PayoutRecord(
        id: map['id'] ?? '',
        amount: (map['amount'] ?? 0).toDouble(),
        method: map['method'] ?? 'upi',
        status: map['status'] ?? 'pending',
        date: (map['date'] as Timestamp?)?.toDate() ?? DateTime.now(),
      );
}

// ─── Creator Controller ───────────────────────────────────────────
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
  }) =>
      CreatorState(
        stats: stats ?? this.stats,
        isLoading: isLoading ?? this.isLoading,
        error: error,
        message: message,
        // don't carry over stats if explicitly setting null
      );
}

class CreatorController extends StateNotifier<CreatorState> {
  final FirebaseFirestore _db;
  final String? _userId;

  CreatorController(this._userId)
      : _db = FirebaseService.instance.firestore,
        super(const CreatorState()) {
    if (_userId != null) _loadStats();
  }

  Future<void> _loadStats() async {
    if (_userId == null) return;
    state = state.copyWith(isLoading: true);
    try {
      // creator_analytics doc — created on first activity
      final doc =
          await _db.collection('creator_analytics').doc(_userId).get();

      // Also read user doc for Pro status
      final userDoc = await _db.collection('users').doc(_userId).get();
      final isProFromUser =
          (userDoc.data() ?? {})['isCreatorPro'] as bool? ?? false;

      final data = doc.data() ?? {};
      data['isCreatorPro'] = isProFromUser;

      // Calculate creator's share based on tier
      final gross = (data['grossAdRevenue'] ?? 0).toDouble();
      final share = isProFromUser
          ? gross * AppConfig.proCreatorRevenueCut
          : gross * AppConfig.creatorRevenueCut;
      data['creatorEarnings'] = share;

      // Count posts
      final postsSnap = await _db
          .collection('posts')
          .where('userId', isEqualTo: _userId)
          .count()
          .get();
      data['totalPosts'] = postsSnap.count ?? 0;

      state = state.copyWith(
        stats: CreatorStats.fromFirestore(data),
        isLoading: false,
      );
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to load stats.');
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // ─── Request Payout ───────────────────────────────────────────
  Future<bool> requestPayout({
    required double amount,
    required String method, // 'upi' | 'paypal'
    required String destination, // UPI ID or PayPal email
  }) async {
    if (_userId == null || state.stats == null) return false;
    if (amount < 100) {
      state = state.copyWith(error: 'Minimum payout amount is ₹100.');
      return false;
    }
    if ((state.stats!.pendingPayout) < amount) {
      state = state.copyWith(error: 'Insufficient balance.');
      return false;
    }

    state = state.copyWith(isLoading: true);
    try {
      final ref = _db.collection('payout_requests').doc();
      await ref.set({
        'userId': _userId,
        'amount': amount,
        'method': method,
        'destination': destination,
        'status': 'pending',
        'requestedAt': FieldValue.serverTimestamp(),
      });

      // Deduct from pending balance
      await _db.collection('creator_analytics').doc(_userId).update({
        'pendingPayout': FieldValue.increment(-amount),
        'payoutHistory': FieldValue.arrayUnion([
          {
            'id': ref.id,
            'amount': amount,
            'method': method,
            'status': 'pending',
            'date': Timestamp.now(),
          }
        ]),
      });

      await _loadStats();
      state = state.copyWith(
        isLoading: false,
        message: 'Payout request submitted! Processing within 3–5 business days.',
      );
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Payout request failed.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  // ─── Activate Creator Pro ─────────────────────────────────────
  Future<bool> activateCreatorPro({
    required String paymentId,
    required String planType, // 'monthly' | 'yearly'
  }) async {
    if (_userId == null) return false;
    try {
      final expiryDays = planType == 'yearly' ? 365 : 30;
      await _db.collection('users').doc(_userId).update({
        'isCreatorPro': true,
        'isVerified': true,
        'creatorProPlan': planType,
        'creatorProExpiry': Timestamp.fromDate(
          DateTime.now().add(Duration(days: expiryDays)),
        ),
        'creatorProPaymentId': paymentId,
      });
      await _loadStats();
      return true;
    } catch (e, st) {
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  Future<void> refresh() => _loadStats();
}

// ─── Provider ─────────────────────────────────────────────────────
final creatorControllerProvider =
    StateNotifierProvider<CreatorController, CreatorState>((ref) {
  final userId = ref.watch(currentUserProvider)?.uid;
  return CreatorController(userId);
});
