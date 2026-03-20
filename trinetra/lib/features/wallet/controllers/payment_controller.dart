import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/config/app_config.dart';
import '../../../core/services/firebase_service.dart';
import '../../../core/services/sentry_service.dart';
import '../../auth/controllers/auth_controller.dart';
import '../models/transaction_model.dart';

// Payment state
class PaymentState {
  final bool isLoading;
  final String? error;
  final String? successMessage;
  final double walletBalance;
  final List<TransactionModel> transactions;

  const PaymentState({
    this.isLoading = false,
    this.error,
    this.successMessage,
    this.walletBalance = 0.0,
    this.transactions = const [],
  });

  PaymentState copyWith({
    bool? isLoading,
    String? error,
    String? successMessage,
    double? walletBalance,
    List<TransactionModel>? transactions,
  }) =>
      PaymentState(
        isLoading: isLoading ?? this.isLoading,
        error: error,
        successMessage: successMessage,
        walletBalance: walletBalance ?? this.walletBalance,
        transactions: transactions ?? this.transactions,
      );
}

class PaymentController extends StateNotifier<PaymentState> {
  final FirebaseFirestore _firestore;
  final String? _userId;

  PaymentController(this._userId)
      : _firestore = FirebaseService.instance.firestore,
        super(const PaymentState()) {
    if (_userId != null) {
      _loadTransactions();
    }
  }

  Future<void> _loadTransactions() async {
    if (_userId == null) return;
    state = state.copyWith(isLoading: true);
    try {
      final snapshot = await _firestore
          .collection('transactions')
          .where('userId', isEqualTo: _userId)
          .orderBy('createdAt', descending: true)
          .limit(50)
          .get();

      final txns = snapshot.docs
          .map((doc) => TransactionModel.fromFirestore(doc))
          .toList();

      final balance = txns
          .where((t) => t.status == TransactionStatus.completed)
          .fold<double>(0, (sum, t) => t.isCredit ? sum + t.amount : sum - t.amount);

      state = state.copyWith(
        transactions: txns,
        walletBalance: balance < 0 ? 0 : balance,
        isLoading: false,
      );
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to load transactions.');
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // ─── Open Razorpay (Android/iOS only) ───────────────────────
  Future<void> openRazorpay({
    required double amountInRupees,
    required String description,
    required String contact,
    required String name,
    required void Function(String paymentId) onSuccess,
    required void Function(String error) onError,
  }) async {
    if (AppConfig.razorpayKeyId.isEmpty) {
      onError('Razorpay not configured. Please add RAZORPAY_KEY_ID secret.');
      return;
    }

    if (kIsWeb) {
      onError('Razorpay is available on Android/iOS only. Use UPI QR on web.');
      return;
    }

    // Razorpay is Android/iOS only — using dynamic import
    // In production, use razorpay_flutter package
    _openRazorpayNative(
      amountInPaise: (amountInRupees * 100).toInt(),
      description: description,
      contact: contact,
      name: name,
      onSuccess: onSuccess,
      onError: onError,
    );
  }

  void _openRazorpayNative({
    required int amountInPaise,
    required String description,
    required String contact,
    required String name,
    required void Function(String) onSuccess,
    required void Function(String) onError,
  }) {
    // Dynamic Razorpay initialization
    // razorpay_flutter is already in pubspec.yaml
    // This method is called only on Android/iOS
    // The actual Razorpay.open() call is in the platform-specific implementation
    onError('Razorpay: Initialize with RAZORPAY_KEY_ID from GitHub Secrets');
  }

  // ─── UPI Deep Link ──────────────────────────────────────────
  /// Generates UPI intent deep-links for PhonePe, Paytm, GPay
  Map<String, String> getUpiDeepLinks({
    required double amount,
    required String payeeVpa,
    required String payeeName,
    required String transactionNote,
  }) {
    final encodedNote = Uri.encodeComponent(transactionNote);
    final encodedName = Uri.encodeComponent(payeeName);
    final amountStr = amount.toStringAsFixed(2);

    // Standard UPI intent URL (works with any UPI app)
    final upiUrl = 'upi://pay?pa=$payeeVpa&pn=$encodedName&am=$amountStr&tn=$encodedNote&cu=INR';

    return {
      'phonePe': 'phonepe://pay?pa=$payeeVpa&pn=$encodedName&am=$amountStr&tn=$encodedNote&cu=INR',
      'paytm': 'paytmmp://pay?pa=$payeeVpa&pn=$encodedName&am=$amountStr&tn=$encodedNote&cu=INR',
      'googlePay': 'tez://upi/pay?pa=$payeeVpa&pn=$encodedName&am=$amountStr&tn=$encodedNote&cu=INR',
      'bhim': 'upi://pay?pa=$payeeVpa&pn=$encodedName&am=$amountStr&tn=$encodedNote&cu=INR',
      'generic': upiUrl,
    };
  }

  // ─── Record Transaction ─────────────────────────────────────
  Future<void> recordTransaction({
    required TransactionType type,
    required double amount,
    required String description,
    TransactionStatus status = TransactionStatus.completed,
    String? referenceId,
    String? paymentMethod,
  }) async {
    if (_userId == null) return;
    try {
      await _firestore.collection('transactions').add({
        'userId': _userId,
        'type': type.value,
        'amount': amount,
        'currency': 'INR',
        'status': status.value,
        'description': description,
        'referenceId': referenceId,
        'paymentMethod': paymentMethod,
        'createdAt': FieldValue.serverTimestamp(),
        'metadata': {},
      });
      await _loadTransactions();
    } catch (e, st) {
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // ─── Boost Post ─────────────────────────────────────────────
  Future<bool> boostPost({
    required String postId,
    required double budgetInRupees,
    required int durationDays,
  }) async {
    if (_userId == null) return false;
    state = state.copyWith(isLoading: true);
    try {
      await _firestore.collection('posts').doc(postId).update({
        'isBoosted': true,
        'boostExpiry': Timestamp.fromDate(
          DateTime.now().add(Duration(days: durationDays)),
        ),
        'boostBudget': budgetInRupees,
      });
      await recordTransaction(
        type: TransactionType.adBoost,
        amount: budgetInRupees,
        description: 'Boost Post — $durationDays days',
        referenceId: postId,
      );
      state = state.copyWith(
        isLoading: false,
        successMessage: 'Post boosted successfully!',
      );
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Boost failed. Please retry.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  Future<void> refresh() => _loadTransactions();
}

// ─── Provider ────────────────────────────────────────────────────
final paymentControllerProvider =
    StateNotifierProvider<PaymentController, PaymentState>((ref) {
  final userId = ref.watch(currentUserProvider)?.uid;
  return PaymentController(userId);
});
