import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/app_config.dart';

/// Unified Payment Service (100% AWS Ready)
///
/// Provider  | Status
/// ─────────────────────────
/// PayPal    | REAL (Uses AppConfig.paypalClientId & url_launcher)
/// UPI Links | REAL
/// PayU      | DUMMY
/// Braintree | DUMMY
/// Paddle    | DUMMY
/// Adyen     | DUMMY
/// Razorpay  | REMOVED
/// Stripe    | REMOVED
class PaymentService {
  PaymentService._();
  static final PaymentService instance = PaymentService._();

  // ─── 1. PayPal (ORIGINAL / REAL) ──────────────────────────────────────────
  /// Opens PayPal checkout in external browser / app.
  Future<void> openPayPal({
    required String approvalUrl,
    required void Function() onSuccess,
    required void Function(String) onError,
  }) async {
    if (AppConfig.paypalClientId.isEmpty) {
      onError('PayPal client ID not configured. Add PAYPAL_CLIENT_ID to GitHub Secrets.');
      return;
    }
    final uri = Uri.parse(approvalUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
      // Note: PayPal success is confirmed via backend webhook
    } else {
      onError('Could not open PayPal. Please try again.');
    }
  }

  // ─── 2. PayU (DUMMY) ────────────────────────────────────────────────────
  Future<void> processPayU({
    required double amountInRupees,
    required String description,
    required void Function(String paymentId) onSuccess,
    required void Function(String error) onError,
  }) async {
    if (kDebugMode) debugPrint('[PayU] DUMMY Payment: ₹$amountInRupees');
    await Future.delayed(const Duration(seconds: 1));
    onSuccess('dummy_payu_txn_${DateTime.now().millisecondsSinceEpoch}');
  }

  // ─── 3. Braintree (DUMMY) ───────────────────────────────────────────────
  Future<void> processBraintree({
    required double amount,
    required String currency,
    required void Function(String transactionId) onSuccess,
    required void Function(String error) onError,
  }) async {
    if (kDebugMode) debugPrint('[Braintree] DUMMY Payment: $amount $currency');
    await Future.delayed(const Duration(seconds: 1));
    onSuccess('dummy_braintree_txn_${DateTime.now().millisecondsSinceEpoch}');
  }

  // ─── 4. Paddle (DUMMY) ──────────────────────────────────────────────────
  Future<void> processPaddle({
    required double amount,
    required void Function(String transactionId) onSuccess,
    required void Function(String error) onError,
  }) async {
    if (kDebugMode) debugPrint('[Paddle] DUMMY Payment: $amount');
    await Future.delayed(const Duration(seconds: 1));
    onSuccess('dummy_paddle_txn_${DateTime.now().millisecondsSinceEpoch}');
  }

  // ─── 5. Adyen (DUMMY) ───────────────────────────────────────────────────
  Future<void> processAdyen({
    required double amount,
    required void Function(String transactionId) onSuccess,
    required void Function(String error) onError,
  }) async {
    if (kDebugMode) debugPrint('[Adyen] DUMMY Payment: $amount');
    await Future.delayed(const Duration(seconds: 1));
    onSuccess('dummy_adyen_txn_${DateTime.now().millisecondsSinceEpoch}');
  }

  // ─── 6. UPI Deep Links (ORIGINAL / REAL) ────────────────────────────────
  Map<String, String> upiDeepLinks({
    required double amountInRupees,
    required String payeeVpa,
    required String payeeName,
    required String note,
  }) {
    final amt = amountInRupees.toStringAsFixed(2);
    final n = Uri.encodeComponent(note);
    final pn = Uri.encodeComponent(payeeName);
    final base = 'pa=$payeeVpa&pn=$pn&am=$amt&tn=$n&cu=INR';
    return {
      'generic': 'upi://pay?$base',
      'phonePe': 'phonepe://pay?$base',
      'googlePay': 'tez://upi/pay?$base',
      'paytm': 'paytmmp://pay?$base',
      'bhim': 'upi://pay?$base',
    };
  }

  Future<bool> launchUpi(String upiUrl) async {
    final uri = Uri.parse(upiUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalNonBrowserApplication);
      return true;
    }
    return false;
  }

  void dispose() {
    // Resources cleared
  }
}
