import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/services/payment_service.dart';
import '../../auth/controllers/auth_controller.dart';
import '../controllers/creator_controller.dart';

class CreatorProScreen extends ConsumerStatefulWidget {
  const CreatorProScreen({super.key});

  @override
  ConsumerState<CreatorProScreen> createState() => _CreatorProScreenState();
}

class _CreatorProScreenState extends ConsumerState<CreatorProScreen> {
  bool _isYearly = false;
  bool _isProcessing = false;
  
  // 🔥 FIXED: Default payment method set to paypal instead of stripe/razorpay 🔥
  String _paymentMethod = 'paypal';

  static const double _monthlyPrice = 799.0;
  static const double _yearlyPrice = 7999.0;

  double get _price => _isYearly ? _yearlyPrice : _monthlyPrice;
  String get _planLabel => _isYearly ? 'Annual' : 'Monthly';

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final creatorState = ref.watch(creatorControllerProvider);

    if (creatorState.stats?.isCreatorPro == true) {
      return _AlreadyProScreen(isDark: isDark);
    }

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0A0A1A) : const Color(0xFFF0F4FF),
      body: CustomScrollView(
        slivers: [
          // ─── Hero Header ───────────────────────────────────────
          SliverAppBar(
            expandedHeight: 240,
            pinned: true,
            backgroundColor: isDark ? AppColors.cardDark : Colors.white,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new, size: 18),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF1A1A2E), Color(0xFF0F3460)],
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                            color: AppColors.premiumGold, width: 3),
                        color: Colors.white10,
                      ),
                      child: const Icon(
                        Icons.verified,
                        color: AppColors.premiumGold,
                        size: 38,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Creator Pro',
                      style: TextStyle(
                        color: AppColors.premiumGold,
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const Text(
                      'Unlock your full creator potential',
                      style: TextStyle(color: Colors.white60, fontSize: 13),
                    ),
                  ],
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // ─── Plan Toggle ───────────────────────────────
                  _PlanToggle(
                    isYearly: _isYearly,
                    isDark: isDark,
                    onToggle: (v) => setState(() => _isYearly = v),
                  ),
                  const SizedBox(height: 16),

                  // ─── Price Card ────────────────────────────────
                  _PriceCard(
                    price: _price,
                    planLabel: _planLabel,
                    isYearly: _isYearly,
                    isDark: isDark,
                  ),
                  const SizedBox(height: 16),

                  // ─── Features List ─────────────────────────────
                  _FeaturesList(isDark: isDark),
                  const SizedBox(height: 16),

                  // ─── Comparison Table ──────────────────────────
                  _ComparisonTable(isDark: isDark),
                  const SizedBox(height: 16),

                  // ─── Payment Method (AWS Ready 5 Gateways) ──────
                  _PaymentMethodSelector(
                    selected: _paymentMethod,
                    isDark: isDark,
                    onChanged: (m) => setState(() => _paymentMethod = m),
                  ),
                  const SizedBox(height: 24),

                  // ─── Subscribe Button ──────────────────────────
                  _isProcessing
                      ? const CircularProgressIndicator(
                          color: AppColors.primary)
                      : SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _subscribe,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.premiumGold,
                              foregroundColor: Colors.black,
                              minimumSize: const Size(0, 52),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                            child: Text(
                              'Subscribe — ₹${_price.toInt()}/${_isYearly ? 'yr' : 'mo'}',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ),
                  const SizedBox(height: 12),
                  Text(
                    'Cancel anytime. Billed in INR. '
                    '${_isYearly ? 'Equivalent to ₹${(_yearlyPrice / 12).toStringAsFixed(0)}/mo — 2 months FREE.' : ''}',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 🔥 FIXED: Razorpay & Stripe removed, 5 New Gateways Added 🔥
  Future<void> _subscribe() async {
    setState(() => _isProcessing = true);

    void handleSuccess(String paymentId) async {
      await _activate(paymentId);
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
          amountInRupees: _price,
          description: 'Creator Pro — $_planLabel',
          onSuccess: handleSuccess,
          onError: handleError,
        );
        break;
      case 'braintree':
        await PaymentService.instance.processBraintree(
          amount: _price,
          currency: 'INR',
          onSuccess: handleSuccess,
          onError: handleError,
        );
        break;
      case 'paddle':
        await PaymentService.instance.processPaddle(
          amount: _price,
          onSuccess: handleSuccess,
          onError: handleError,
        );
        break;
      case 'adyen':
        await PaymentService.instance.processAdyen(
          amount: _price,
          onSuccess: handleSuccess,
          onError: handleError,
        );
        break;
      default:
        handleError('Invalid payment method selected.');
    }
  }

  Future<void> _activate(String paymentId) async {
    final success = await ref
        .read(creatorControllerProvider.notifier)
        .activateCreatorPro(
          paymentId: paymentId,
          planType: _isYearly ? 'yearly' : 'monthly',
        );
    if (mounted) {
      setState(() => _isProcessing = false);
      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Welcome to Creator Pro! Blue badge activated.'),
            backgroundColor: Colors.green,
          ),
        );
      }
    }
  }
}

// ─── Plan Toggle ──────────────────────────────────────────────────
class _PlanToggle extends StatelessWidget {
  final bool isYearly;
  final bool isDark;
  final void Function(bool) onToggle;
  const _PlanToggle(
      {required this.isYearly,
      required this.isDark,
      required this.onToggle});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(30),
      ),
      child: Row(
        children: [
          _Tab('Monthly', !isYearly, () => onToggle(false)),
          _Tab('Yearly  (Save 17%)', isYearly, () => onToggle(true)),
        ],
      ),
    );
  }
}

class _Tab extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;
  const _Tab(this.label, this.selected, this.onTap);

  @override
  Widget build(BuildContext context) => Expanded(
        child: GestureDetector(
          onTap: onTap,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(vertical: 10),
            decoration: BoxDecoration(
              color: selected ? AppColors.premiumGold : Colors.transparent,
              borderRadius: BorderRadius.circular(26),
            ),
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 13,
                color: selected ? Colors.black : Colors.grey,
              ),
            ),
          ),
        ),
      );
}

// ─── Price Card ───────────────────────────────────────────────────
class _PriceCard extends StatelessWidget {
  final double price;
  final String planLabel;
  final bool isYearly;
  final bool isDark;
  const _PriceCard(
      {required this.price,
      required this.planLabel,
      required this.isYearly,
      required this.isDark});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFFFD700), Color(0xFFFFA500)],
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '₹${price.toInt()}',
              style: const TextStyle(
                fontSize: 40,
                fontWeight: FontWeight.w900,
                color: Colors.black,
              ),
            ),
            Text(
              ' / ${isYearly ? 'year' : 'month'}',
              style: const TextStyle(
                fontSize: 16,
                color: Colors.black54,
              ),
            ),
          ],
        ),
      );
}

// ─── Features List ────────────────────────────────────────────────
class _FeaturesList extends StatelessWidget {
  final bool isDark;
  const _FeaturesList({required this.isDark});

  static const _features = [
    ('Blue Verification Badge', Icons.verified),
    ('100% Ad Revenue (free: 30%)', Icons.monetization_on),
    ('Ad-Free Browsing', Icons.block),
    ('Creator Studio Analytics', Icons.analytics),
    ('Priority Support', Icons.support_agent),
    ('Early Access to New Features', Icons.new_releases),
  ];

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Included with Creator Pro',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 15),
            ),
            const SizedBox(height: 12),
            ..._features.map((f) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Row(
                    children: [
                      Icon(f.$2, color: AppColors.premiumGold, size: 20),
                      const SizedBox(width: 10),
                      Text(f.$1,
                          style: const TextStyle(fontWeight: FontWeight.w500)),
                    ],
                  ),
                )),
          ],
        ),
      );
}

// ─── Comparison Table ─────────────────────────────────────────────
class _ComparisonTable extends StatelessWidget {
  final bool isDark;
  const _ComparisonTable({required this.isDark});

  @override
  Widget build(BuildContext context) => Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Table(
          border: TableBorder.symmetric(
            inside: BorderSide(
              color: isDark ? Colors.white12 : Colors.black12,
            ),
          ),
          columnWidths: const {
            0: FlexColumnWidth(2),
            1: FlexColumnWidth(1),
            2: FlexColumnWidth(1),
          },
          children: [
            _row('Feature', 'Free', 'Pro', isHeader: true),
            _row('Ad Revenue', '30%', '100%'),
            _row('Verification Badge', '✕', '✓'),
            _row('Ad-Free Feed', '✕', '✓'),
            _row('Creator Studio', '✓', '✓'),
            _row('Priority Support', '✕', '✓'),
          ],
        ),
      );

  TableRow _row(String a, String b, String c, {bool isHeader = false}) =>
      TableRow(
        decoration: isHeader
            ? const BoxDecoration(color: AppColors.primary)
            : null,
        children: [a, b, c].map((t) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
            child: Text(
              t,
              textAlign: t == a ? TextAlign.left : TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isHeader ? FontWeight.w700 : FontWeight.w500,
                color: isHeader
                    ? Colors.white
                    : (t == '✓' ? Colors.green : null),
              ),
            ),
          );
        }).toList(),
      );
}

// ─── Payment Method Selector ──────────────────────────────────────
class _PaymentMethodSelector extends StatelessWidget {
  final String selected;
  final bool isDark;
  final void Function(String) onChanged;
  const _PaymentMethodSelector(
      {required this.selected,
      required this.isDark,
      required this.onChanged});

  @override
  Widget build(BuildContext context) {
    // 🔥 FIXED: UI Updated to show only your 5 new Gateways 🔥
    final methods = [
      ('paypal', 'PayPal', Icons.payment),
      ('payu', 'PayU', Icons.account_balance_wallet),
      ('braintree', 'Braintree', Icons.credit_card),
      ('paddle', 'Paddle', Icons.shopping_cart),
      ('adyen', 'Adyen', Icons.security),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Payment Method',
            style: TextStyle(fontWeight: FontWeight.w900)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: methods
              .map((m) => GestureDetector(
                    onTap: () => onChanged(m.$1),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          vertical: 10, horizontal: 12),
                      decoration: BoxDecoration(
                        color: selected == m.$1
                            ? AppColors.primary.withValues(alpha: 0.1)
                            : (isDark ? AppColors.cardDark : Colors.white),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: selected == m.$1
                              ? AppColors.primary
                              : Colors.transparent,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(m.$3,
                              size: 18,
                              color: selected == m.$1
                                  ? AppColors.primary
                                  : Colors.grey),
                          const SizedBox(width: 4),
                          Text(m.$2,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: selected == m.$1
                                    ? AppColors.primary
                                    : null,
                              )),
                        ],
                      ),
                    ),
                  ))
              .toList(),
        ),
      ],
    );
  }
}

// ─── Already Pro Screen ───────────────────────────────────────────
class _AlreadyProScreen extends StatelessWidget {
  final bool isDark;
  const _AlreadyProScreen({required this.isDark});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Creator Pro')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.verified,
                  color: AppColors.premiumGold, size: 72),
              const SizedBox(height: 16),
              const Text(
                'You are already on Creator Pro!',
                style:
                    TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              const Text('Enjoy 100% revenue & your blue badge.'),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Back to Studio'),
              ),
            ],
          ),
        ),
      );
}
