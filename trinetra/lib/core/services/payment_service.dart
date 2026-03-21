import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/app_config.dart';

/// Unified Payment Service
///
/// Provider | Platform | Status
/// ─────────────────────────────────
/// Razorpay | Android/iOS | REAL  (inject RAZORPAY_KEY_ID via GitHub Secrets)
/// PayPal   | All         | REAL  (inject PAYPAL_CLIENT_ID via GitHub Secrets)
/// Stripe   | All         | DUMMY (pending Stripe account — placeholder UI)
class PaymentService {
  PaymentService._();
  static final PaymentService instance = PaymentService._();

  Razorpay? _razorpay;

  // ─── Razorpay ─────────────────────────────────────────────────
  /// Opens Razorpay native checkout (Android/iOS only).
  /// On web or if key not set, returns an error via [onError].
  void openRazorpay({
    required double amountInRupees,
    required String description,
    required String contactNumber,
    required String customerName,
    required void Function(String paymentId) onSuccess,
    required void Function(String error) onError,
  }) {
    if (kIsWeb) {
      onError('Razorpay is not available on Web. Please use PayPal.');
      return;
    }
    if (AppConfig.razorpayKeyId.isEmpty) {
      onError('Razorpay key not configured. Add RAZORPAY_KEY_ID to GitHub Secrets.');
      return;
    }

    // Tear down previous instance
    _razorpay?.clear();
    _razorpay = Razorpay();

    _razorpay!.on(
      Razorpay.EVENT_PAYMENT_SUCCESS,
      (PaymentSuccessResponse response) {
        onSuccess(response.paymentId ?? '');
        _razorpay?.clear();
      },
    );
    _razorpay!.on(
      Razorpay.EVENT_PAYMENT_ERROR,
      (PaymentFailureResponse response) {
        onError(response.message ?? 'Payment cancelled or failed.');
        _razorpay?.clear();
      },
    );
    _razorpay!.on(
      Razorpay.EVENT_EXTERNAL_WALLET,
      (ExternalWalletResponse response) {
        // External wallet (PhonePe, Paytm, etc.) selected
        onSuccess('wallet:${response.walletName}');
        _razorpay?.clear();
      },
    );

    final options = <String, dynamic>{
      'key': AppConfig.razorpayKeyId,
      'amount': (amountInRupees * 100).toInt(), // paise
      'name': 'TriNetra',
      'description': description,
      'prefill': {
        'contact': contactNumber,
        'name': customerName,
      },
      'theme': {'color': '#1877F2'},
      'modal': {
        'ondismiss': onError,
      },
    };

    _razorpay!.open(options);
  }

  // ─── PayPal ───────────────────────────────────────────────────
  /// Opens PayPal checkout in external browser / app.
  /// Requires backend to create a PayPal Order and return approvalUrl.
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
      // Note: PayPal success is confirmed via backend webhook + Firestore listener
    } else {
      onError('Could not open PayPal. Please try again.');
    }
  }

  // ─── Stripe (DUMMY) ───────────────────────────────────────────
  /// Stripe UI placeholder — shows the payment sheet but does NOT process
  /// real payments. Replace STRIPE_PUBLISHABLE_KEY with a live key and
  /// implement a real payment intent backend endpoint.
  Future<StripePaymentResult> processStripePayment({
    required double amountInRupees,
    required String description,
  }) async {
    if (AppConfig.stripePublishableKey.isEmpty) {
      return StripePaymentResult.failure(
        'Stripe key not configured. Add STRIPE_PUBLISHABLE_KEY to GitHub Secrets.',
      );
    }

    // DUMMY: flutter_stripe requires a real Payment Intent client secret
    // from a backend endpoint (POST /api/payment/stripe_intent).
    // This is a structural placeholder.
    if (kDebugMode) {
      debugPrint('[Stripe] DUMMY — amount: ₹$amountInRupees | $description');
      await Future.delayed(const Duration(seconds: 1));
      return StripePaymentResult.success('dummy_stripe_pi_${DateTime.now().millisecondsSinceEpoch}');
    }

    // TODO: Production implementation
    // 1. Call POST /api/payment/stripe_intent → get clientSecret
    // 2. Stripe.instance.initPaymentSheet(paymentSheetData: ...)
    // 3. await Stripe.instance.presentPaymentSheet()
    return StripePaymentResult.failure('Stripe: pending account setup.');
  }

  // ─── UPI Deep Links ───────────────────────────────────────────
  /// Returns a map of UPI deep-link URLs for all major UPI apps.
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

  /// Launch UPI deep link — tries apps in priority order
  Future<bool> launchUpi(String upiUrl) async {
    final uri = Uri.parse(upiUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalNonBrowserApplication);
      return true;
    }
    return false;
  }

  void dispose() {
    _razorpay?.clear();
    _razorpay = null;
  }
}

// ─── Result Types ─────────────────────────────────────────────────
class StripePaymentResult {
  final bool isSuccess;
  final String? paymentIntentId;
  final String? error;

  const StripePaymentResult._({
    required this.isSuccess,
    this.paymentIntentId,
    this.error,
  });

  factory StripePaymentResult.success(String paymentIntentId) =>
      StripePaymentResult._(isSuccess: true, paymentIntentId: paymentIntentId);

  factory StripePaymentResult.failure(String error) =>
      StripePaymentResult._(isSuccess: false, error: error);
}
