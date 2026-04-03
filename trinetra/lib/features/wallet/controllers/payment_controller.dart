import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/services/sentry_service.dart';
import '../../auth/controllers/auth_controller.dart';
import '../models/transaction_model.dart';

// Payment state
class PaymentState {
  final bool isLoading;
  final String? error;
  final String? successMessage;
  final double walletBalance;
  final double boostWalletBalance;
  final List<TransactionModel> transactions;

  const PaymentState({
    this.isLoading = false,
    this.error,
    this.successMessage,
    this.walletBalance = 0.0,
    this.boostWalletBalance = 0.0,
    this.transactions = const [],
  });

  PaymentState copyWith({
    bool? isLoading,
    String? error,
    String? successMessage,
    double? walletBalance,
    double? boostWalletBalance,
    List<TransactionModel>? transactions,
  }) =>
      PaymentState(
        isLoading: isLoading ?? this.isLoading,
        error: error,
        successMessage: successMessage,
        walletBalance: walletBalance ?? this.walletBalance,
        boostWalletBalance: boostWalletBalance ?? this.boostWalletBalance,
        transactions: transactions ?? this.transactions,
      );
}

class PaymentController extends StateNotifier<PaymentState> {
  final String? _userId;

  PaymentController(this._userId) : super(const PaymentState()) {
    if (_userId != null) {
      _loadTransactions();
    }
  }

  Future<void> _loadTransactions() async {
    if (_userId == null) return;
    state = state.copyWith(isLoading: true);
    try {
      // AWS Loading logic
      await Future.delayed(const Duration(milliseconds: 500));
      state = state.copyWith(
        transactions: [],
        walletBalance: 0.0,
        boostWalletBalance: 0.0,
        isLoading: false,
      );
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Failed to load transactions.');
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  // 🔥 RAZORPAY COMPLETELY REMOVED 🔥

  // ─── UPI Deep Link ──────────────────────────────────────────
  Map<String, String> getUpiDeepLinks({
    required double amount,
    required String payeeVpa,
    required String payeeName,
    required String transactionNote,
  }) {
    final encodedNote = Uri.encodeComponent(transactionNote);
    final encodedName = Uri.encodeComponent(payeeName);
    final amountStr = amount.toStringAsFixed(2);
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
      await Future.delayed(const Duration(milliseconds: 200));
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
      await Future.delayed(const Duration(seconds: 1));
      await recordTransaction(
        type: TransactionType.adBoost,
        amount: budgetInRupees,
        description: 'Boost Post — $durationDays days',
        referenceId: postId,
      );
      state = state.copyWith(isLoading: false, successMessage: 'Post boosted successfully!');
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Boost failed. Please retry.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  Future<void> refresh() => _loadTransactions();

  // ─── Boost Wallet Top-Up ─────────────────────────────────────
  Future<bool> topUpBoostWallet({
    required double amount,
    required String paymentId,
    required String paymentMethod,
  }) async {
    if (_userId == null) return false;
    state = state.copyWith(isLoading: true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await recordTransaction(
        type: TransactionType.payment,
        amount: amount,
        description: 'Boost Wallet Top-up (+₹${amount.toStringAsFixed(0)})',
        referenceId: paymentId,
        paymentMethod: paymentMethod,
      );
      await _loadTransactions();
      state = state.copyWith(isLoading: false, successMessage: '₹${amount.toStringAsFixed(0)} added to Boost Wallet!');
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Top-up failed. Try again.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }

  // ─── Spend from Boost Wallet ─────────────────────────────────
  Future<bool> spendFromBoostWallet({
    required String postId,
    required double amount,
    required int durationDays,
  }) async {
    if (_userId == null) return false;
    if (state.boostWalletBalance < amount) return false;

    state = state.copyWith(isLoading: true);
    try {
      await Future.delayed(const Duration(seconds: 1));
      await recordTransaction(
        type: TransactionType.adBoost,
        amount: amount,
        description: 'Boost Post — $durationDays day${durationDays > 1 ? 's' : ''} (from Boost Wallet)',
        referenceId: postId,
        paymentMethod: 'boost_wallet',
      );
      await _loadTransactions();
      state = state.copyWith(isLoading: false, successMessage: 'Post boosted for $durationDays day${durationDays > 1 ? 's' : ''}!');
      return true;
    } catch (e, st) {
      state = state.copyWith(isLoading: false, error: 'Boost failed. Try again.');
      await SentryService.instance.captureException(e, stackTrace: st);
      return false;
    }
  }
}

// ─── Provider ────────────────────────────────────────────────────
final paymentControllerProvider =
    StateNotifierProvider<PaymentController, PaymentState>((ref) {
  final userId = ref.watch(currentUserProvider)?.uid;
  return PaymentController(userId);
});
