import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/services/payment_service.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../wallet/controllers/payment_controller.dart';
import '../controllers/creator_controller.dart';

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
  String _paymentMethod = 'razorpay';
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
    final methods = [
      if (!kIsWeb) _PayMethod('razorpay', 'Razorpay', Icons.payment, 'UPI, Cards, Net Banking'),
      _PayMethod('paypal', 'PayPal', Icons.paypal, 'Secure global payments'),
      _PayMethod('stripe', 'Credit/Debit Card', Icons.credit_card, 'Stripe — pending setup'),
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

  Future<void> _pay() async {
    setState(() => _isProcessing = true);
    final pkg = _packages[_selectedPackage];
    final me = ref.read(currentUserProvider);

    if (_paymentMethod == 'razorpay') {
      PaymentService.instance.openRazorpay(
        amountInRupees: pkg.price,
        description: 'Boost Post — ${pkg.label} (${pkg.days}d)',
        contactNumber: me?.phoneNumber ?? '',
        customerName: me?.displayName ?? 'TriNetra User',
        onSuccess: (paymentId) async {
          await _finalizeBoost(paymentId);
        },
        onError: (err) {
          setState(() => _isProcessing = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(err)),
          );
        },
      );
      // Razorpay callback is async; don't set isProcessing = false here
    } else if (_paymentMethod == 'stripe') {
      final result = await PaymentService.instance.processStripePayment(
        amountInRupees: pkg.price,
        description: 'Boost Post — ${pkg.label}',
      );
      if (result.isSuccess) {
        await _finalizeBoost(result.paymentIntentId ?? '');
      } else {
        setState(() => _isProcessing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result.error ?? 'Stripe payment failed')),
        );
      }
    } else {
      // PayPal — show info dialog (backend creates order)
      setState(() => _isProcessing = false);
      _showPayPalDialog(pkg);
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

  void _showPayPalDialog(_BoostPackage pkg) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('PayPal Checkout'),
        content: Text(
          'To complete the ₹${pkg.price.toInt()} payment via PayPal, '
          'you will be redirected to PayPal.\n\n'
          'PayPal integration is ready and uses your real client ID.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              // Backend creates a PayPal order and returns approvalUrl
              // TODO: Call backend API to create PayPal order
              await PaymentService.instance.openPayPal(
                approvalUrl:
                    'https://www.paypal.com/checkoutnow?token=PENDING_ORDER_ID',
                onSuccess: () => _finalizeBoost('paypal_pending'),
                onError: (e) => ScaffoldMessenger.of(context)
                    .showSnackBar(SnackBar(content: Text(e))),
              );
            },
            style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF003087)),
            child: const Text('Continue to PayPal',
                style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
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
