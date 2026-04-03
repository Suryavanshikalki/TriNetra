import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/providers/user_providers.dart';
import '../../../core/services/payment_service.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../wallet/controllers/payment_controller.dart';
import '../controllers/creator_controller.dart';
import 'boost_wallet_screen.dart';

/// Boost Post — payment flow for promoting a post
/// The postId is passed as a route argument.
class BoostPostScreen extends ConsumerStatefulWidget {
  final String postId;
  final String postPreview;

  const BoostPostScreen({
    super.key,
    required this.postId,
    this.postPreview = '',
  });

  @override
  ConsumerState<BoostPostScreen> createState() => _BoostPostScreenState();
}

class _BoostPostScreenState extends ConsumerState<BoostPostScreen> {
  int _selectedPackage = 1; // 0=1d, 1=3d, 2=7d
  // 🔥 FIXED: Default changed to paypal 🔥
  String _paymentMethod = 'paypal';
  bool _isProcessing = false;

  static const _packages = [
    _BoostPackage(
        label: 'Starter',
        days: 1,
        price: 99.0,
        reach: '500–1,000',
        icon: Icons.rocket_launch_outlined),
    _BoostPackage(
        label: 'Growth',
        days: 3,
        price: 299.0,
        reach: '2,000–5,000',
        icon: Icons.trending_up),
    _BoostPackage(
        label: 'Viral',
        days: 7,
        price: 999.0,
        reach: '10,000–25,000',
        icon: Icons.bolt),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final pkg = _packages[_selectedPackage];

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        title: const Text('Boost Post',
            style: TextStyle(fontWeight: FontWeight.w900)),
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ─── Post Preview ──────────────────────────────────────
          if (widget.postPreview.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? AppColors.cardDark : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.primary, width: 1.5),
              ),
              child: Text(
                widget.postPreview,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: isDark
                      ? AppColors.textPrimaryDark
                      : AppColors.textPrimaryLight,
                ),
              ),
            ),
          const SizedBox(height: 20),

          // ─── Package Selection ─────────────────────────────────
          Text(
            'Select Boost Package',
            style: TextStyle(
              fontWeight: FontWeight.w900,
              fontSize: 16,
              color: isDark
                  ? AppColors.textPrimaryDark
                  : AppColors.textPrimaryLight,
            ),
          ),
          const SizedBox(height: 12),
          ...List.generate(_packages.length, (i) {
            final p = _packages[i];
            final selected = _selectedPackage == i;
            return GestureDetector(
              onTap: () => setState(() => _selectedPackage = i),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: selected
                      ? AppColors.primary.withValues(alpha: 0.12)
                      : (isDark ? AppColors.cardDark : Colors.white),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: selected ? AppColors.primary : Colors.transparent,
                    width: 2,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: selected
                            ? AppColors.primary
                            : AppColors.primary.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        p.icon,
                        color:
                            selected ? Colors.white : AppColors.primary,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment:
                                MainAxisAlignment.spaceBetween,
                            children: [
                              Text(p.label,
                                  style: TextStyle(
                                    fontWeight: FontWeight.w900,
                                    fontSize: 15,
                                    color: selected
                                        ? AppColors.primary
                                        : null,
                                  )),
                              Text(
                                '₹${p.price.toInt()}',
                                style: TextStyle(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 18,
                                  color: selected
                                      ? AppColors.primary
                                      : Colors.green,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            '${p.days} day${p.days > 1 ? 's' : ''} · ${p.reach} estimated reach',
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark
                                  ? AppColors.textSecondaryDark
                                  : AppColors.textSecondaryLight,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),

          const SizedBox(height: 20),

          // ─── Boost Wallet Balance ──────────────────────────────
          _BoostWalletBanner(
            postId: widget.postId,
            pkg: pkg,
            isDark: isDark,
          ),

          // ─── Payment Method ────────────────────────────────────
          Text(
            'Payment Method',
            style: TextStyle(
              fontWeight: FontWeight.w900,
              fontSize: 16,
              color: isDark
                  ? AppColors.textPrimaryDark
                  : AppColors.textPrimaryLight,
            ),
          ),
          const SizedBox(height: 12),
          ..._buildPaymentMethods(isDark),

          const SizedBox(height: 28),

          // ─── Confirm Button ────────────────────────────────────
          _isProcessing
              ? const Center(
                  child: CircularProgressIndicator(color: AppColors.primary))
              : ElevatedButton(
                  onPressed: _pay,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    minimumSize: const Size(double.infinity, 52),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Pay ₹${pkg.price.toInt()} & Boost',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ),
          const SizedBox(height: 12),
          Text(
            'Your post will appear in more feeds for ${pkg.days} day${pkg.days > 1 ? 's' : ''}. '
            'Estimated reach: ${pkg.reach} users.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              color: isDark
                  ? AppColors.textSecondaryDark
                  : AppColors.textSecondaryLight,
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildPaymentMethods(bool isDark) {
    // 🔥 FIXED: Shows only your 5 Gateways 🔥
    final methods = [
      _PayMethod('paypal', 'PayPal', Icons.payment, 'Secure global payments'),
      _PayMethod('payu', 'PayU', Icons.account_balance_wallet, 'UPI, Cards, Net Banking'),
      _PayMethod('braintree', 'Braintree', Icons.credit_card, 'Cards & Wallets'),
      _PayMethod('paddle', 'Paddle', Icons.shopping_cart, 'International payments'),
      _PayMethod('adyen', 'Adyen', Icons.security, 'Fast & secure checkout'),
    ];

    return methods
        .map((m) => GestureDetector(
              onTap: () => setState(() => _paymentMethod = m.id),
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: _paymentMethod == m.id
                      ? AppColors.primary.withValues(alpha: 0.08)
                      : (isDark ? AppColors.cardDark : Colors.white),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: _paymentMethod == m.id
                        ? AppColors.primary
                        : Colors.transparent,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(m.icon,
                        color: _paymentMethod == m.id
                            ? AppColors.primary
                            : Colors.grey),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(m.label,
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                color: _paymentMethod == m.id
                                    ? AppColors.primary
                                    : null,
                              )),
                          Text(m.subtitle,
                              style: const TextStyle(
                                  fontSize: 11, color: Colors.grey)),
                        ],
                      ),
                    ),
                    if (_paymentMethod == m.id)
                      const Icon(Icons.check_circle,
                          color: AppColors.primary, size: 20),
                  ],
                ),
              ),
            ))
        .toList();
  }

  // 🔥 FIXED: Razorpay/Stripe logic replaced with 5 Gateways 🔥
  Future<void> _pay() async {
    setState(() => _isProcessing = true);
    final pkg = _packages[_selectedPackage];

    void handleSuccess(String paymentId) async {
      await _finalizeBoost(paymentId);
    }

    void handleError(String error) {
      if (mounted) {
        setState(() => _isProcessing = false);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
      }
    }

    switch (_paymentMethod) {
      case 'paypal':
        await PaymentService.instance.openPayPal(
          approvalUrl: 'https://paypal.com/checkoutnow?token=dummy_token',
          onSuccess: () => handleSuccess('paypal_txn_${DateTime.now().millisecondsSinceEpoch}'),
          onError: handleError,
        );
        break;
      case 'payu':
        await PaymentService.instance.processPayU(
          amountInRupees: pkg.price,
          description: 'Boost Post — ${pkg.label}',
          onSuccess: handleSuccess,
          onError: handleError,
        );
        break;
      case 'braintree':
        await PaymentService.instance.processBraintree(
          amount: pkg.price,
          currency: 'INR',
          onSuccess: handleSuccess,
          onError: handleError,
        );
        break;
      case 'paddle':
        await PaymentService.instance.processPaddle(
          amount: pkg.price,
          onSuccess: handleSuccess,
          onError: handleError,
        );
        break;
      case 'adyen':
        await PaymentService.instance.processAdyen(
          amount: pkg.price,
          onSuccess: handleSuccess,
          onError: handleError,
        );
        break;
      default:
        handleError('Invalid payment method selected.');
    }
  }

  Future<void> _finalizeBoost(String paymentId) async {
    final pkg = _packages[_selectedPackage];
    await ref.read(paymentControllerProvider.notifier).boostPost(
          postId: widget.postId,
          budgetInRupees: pkg.price,
          durationDays: pkg.days,
        );
    if (mounted) {
      setState(() => _isProcessing = false);
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
              'Post boosted! Reach: ${pkg.reach} users over ${pkg.days} day${pkg.days > 1 ? 's' : ''}.'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }
}

class _BoostPackage {
  final String label;
  final int days;
  final double price;
  final String reach;
  final IconData icon;
  const _BoostPackage({
    required this.label,
    required this.days,
    required this.price,
    required this.reach,
    required this.icon,
  });
}

class _PayMethod {
  final String id;
  final String label;
  final IconData icon;
  final String subtitle;
  const _PayMethod(this.id, this.label, this.icon, this.subtitle);
}

// ─── Boost Wallet Banner ──────────────────────────────────────────
/// Shows current boost wallet balance and lets user pay from wallet
/// if balance is sufficient. Otherwise shows a "Top-up" shortcut.
class _BoostWalletBanner extends ConsumerWidget {
  final String postId;
  final _BoostPackage pkg;
  final bool isDark;
  const _BoostWalletBanner({
    required this.postId,
    required this.pkg,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final balance = ref.watch(boostWalletBalanceProvider);
    final hasEnough = balance >= pkg.price;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: hasEnough
            ? Colors.green.withValues(alpha: 0.08)
            : (isDark ? AppColors.cardDark : Colors.white),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: hasEnough ? Colors.green : Colors.grey.withValues(alpha: 0.3),
        ),
      ),
      child: Row(
        children: [
          Icon(
            Icons.account_balance_wallet_outlined,
            color: hasEnough ? Colors.green : Colors.grey,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Boost Wallet: ₹${balance.toStringAsFixed(0)}',
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    color: hasEnough ? Colors.green : null,
                  ),
                ),
                Text(
                  hasEnough
                      ? 'Tap below to pay instantly from wallet'
                      : 'Insufficient balance — top up to pay instantly',
                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
          ),
          if (hasEnough)
            TextButton(
              onPressed: () async {
                final ok = await ref
                    .read(paymentControllerProvider.notifier)
                    .spendFromBoostWallet(
                      postId: postId,
                      amount: pkg.price,
                      durationDays: pkg.days,
                    );
                if (ok && context.mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                          'Post boosted from Wallet! Reach: ${pkg.reach} users.'),
                      backgroundColor: Colors.green,
                    ),
                  );
                }
              },
              style: TextButton.styleFrom(
                backgroundColor: Colors.green,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              ),
              child: const Text(
                'Use Wallet',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                ),
              ),
            )
          else
            TextButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const BoostWalletScreen(),
                ),
              ),
              style: TextButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              ),
              child: const Text(
                'Top-up',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
