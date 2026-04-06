import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTIC FEEDBACK
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/services/sentry_service.dart'; // 🔥 CRASH TRACKING
import '../../../core/services/logrocket_service.dart'; // 🔥 ANALYTICS TRACKING
import '../../../core/services/payment_service.dart'; // 🔥 100% ASLI PAYMENTS
import '../../auth/controllers/auth_controller.dart';
import '../../wallet/controllers/payment_controller.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER BOOST WALLET (Facebook Ads Manager Standard)
// 100% REAL: 5 Gateways, AWS Synced, Premium Haptics, No Dummies
// ==============================================================

/// Boost Budget Wallet — top-up screen
class BoostWalletScreen extends ConsumerStatefulWidget {
  const BoostWalletScreen({super.key});

  @override
  ConsumerState<BoostWalletScreen> createState() => _BoostWalletScreenState();
}

class _BoostWalletScreenState extends ConsumerState<BoostWalletScreen> {
  int _selectedPkg = 1;
  String _paymentMethod = 'payu'; // 🔥 Default for India (Can switch to paypal)
  bool _isProcessing = false;

  static const _packages = [
    _TopUpPackage(amount: 500, bonus: 0, label: 'Starter'),
    _TopUpPackage(amount: 1000, bonus: 50, label: 'Popular'),
    _TopUpPackage(amount: 5000, bonus: 500, label: 'Pro'),
  ];

  @override
  void initState() {
    super.initState();
    LogRocketService.instance.logPageView('Boost_Wallet_TopUp_Screen');
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    // 🔥 Watch actual balance from Provider
    final balance = ref.watch(boostWalletBalanceProvider);
    final pkg = _packages[_selectedPkg];

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        title: const Text('Boost Wallet', style: TextStyle(fontWeight: FontWeight.w900)),
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: isDark ? Colors.white : Colors.black87),
          onPressed: () {
            HapticFeedback.selectionClick();
            Navigator.pop(context);
          },
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ─── Balance Card (Retained 100%) ──────────────────────
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1877F2), Color(0xFF0A4FCC)],
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.account_balance_wallet, color: Colors.white70, size: 18),
                    SizedBox(width: 8),
                    Text('Boost Wallet Balance', style: TextStyle(color: Colors.white70, fontSize: 13)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '₹${balance.toStringAsFixed(2)}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 40,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -1,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Spend on post boosts. Never expires.',
                  style: TextStyle(color: Colors.white60, fontSize: 12),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),
          Text(
            'Select Top-Up Amount',
            style: TextStyle(
              fontWeight: FontWeight.w900,
              fontSize: 16,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            ),
          ),
          const SizedBox(height: 12),

          // ─── Package Cards (Retained Layout) ───────────────────
          Row(
            children: List.generate(_packages.length, (i) {
              final p = _packages[i];
              final selected = _selectedPkg == i;
              return Expanded(
                child: GestureDetector(
                  onTap: () {
                    HapticFeedback.selectionClick();
                    setState(() => _selectedPkg = i);
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: selected
                          ? AppColors.primary.withOpacity(0.12)
                          : (isDark ? AppColors.cardDark : Colors.white),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: selected ? AppColors.primary : Colors.transparent,
                        width: 2,
                      ),
                    ),
                    child: Column(
                      children: [
                        if (i == 1)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.orange,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text('Popular', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w700)),
                          )
                        else
                          const SizedBox(height: 16),
                        const SizedBox(height: 4),
                        Text(
                          p.label,
                          style: TextStyle(
                            fontSize: 11,
                            color: selected ? AppColors.primary : Colors.grey,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          '₹${p.amount}',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: selected ? AppColors.primary : (isDark ? Colors.white : Colors.black87),
                          ),
                        ),
                        if (p.bonus > 0)
                          Text(
                            '+₹${p.bonus} bonus',
                            style: const TextStyle(fontSize: 10, color: Colors.green, fontWeight: FontWeight.w700),
                          )
                        else
                          const SizedBox(height: 14),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),

          const SizedBox(height: 20),

          // ─── Payment Method ────────────────────────────────────
          Text(
            'Secure Payment Method',
            style: TextStyle(
              fontWeight: FontWeight.w900,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            ),
          ),
          const SizedBox(height: 8),
          
          _MethodRow(
            selected: _paymentMethod,
            isDark: isDark,
            onChanged: (m) {
              HapticFeedback.selectionClick();
              setState(() => _paymentMethod = m);
            },
          ),

          const SizedBox(height: 28),

          // ─── Total & CTA ───────────────────────────────────────
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? AppColors.cardDark : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: isDark ? AppColors.dividerDark : AppColors.dividerLight),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Top-up amount', style: TextStyle(color: isDark ? Colors.white70 : Colors.black87)),
                    Text('₹${pkg.amount}', style: TextStyle(fontWeight: FontWeight.w700, color: isDark ? Colors.white : Colors.black)),
                  ],
                ),
                if (pkg.bonus > 0) ...[
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Bonus credits', style: TextStyle(color: Colors.green)),
                      Text('+₹${pkg.bonus}', style: const TextStyle(color: Colors.green, fontWeight: FontWeight.w700)),
                    ],
                  ),
                ],
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Divider(height: 1),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('You get', style: TextStyle(fontWeight: FontWeight.w900)),
                    Text('₹${pkg.totalCredits}', style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.green, fontSize: 18)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          _isProcessing
              ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
              : ElevatedButton(
                  onPressed: _topUp,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    minimumSize: const Size(double.infinity, 52),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  child: Text(
                    'Pay ₹${pkg.amount} & Add ₹${pkg.totalCredits} to Wallet',
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white),
                  ),
                ),

          const SizedBox(height: 16),
          const Center(
            child: Text(
              'Boost Wallet balance never expires. No hidden fees.',
              style: TextStyle(fontSize: 11, color: Colors.grey),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  // 🔥 100% ASLI PAYMENT PROCESSING (NO DUMMY TOKENS)
  Future<void> _topUp() async {
    HapticFeedback.mediumImpact();
    setState(() => _isProcessing = true);
    final pkg = _packages[_selectedPkg];

    // Securely get User details for PayU processing
    final user = ref.read(currentUserProvider);
    final userPhone = user?.phoneNumber ?? '9999999999';
    final userEmail = user?.uid != null ? '${user!.uid}@trinetra.app' : 'user@trinetra.app';
    final userName = user?.displayName ?? 'TriNetra User';

    void handleSuccess(String paymentId) async {
      // Hit actual AWS backend via Payment Controller
      final ok = await ref.read(paymentControllerProvider.notifier).topUpBoostWallet(
            amount: pkg.totalCredits.toDouble(),
            paymentId: paymentId,
            paymentMethod: _paymentMethod,
          );
          
      if (mounted) {
        setState(() => _isProcessing = false);
        if (ok) {
          HapticFeedback.lightImpact(); // Success Vibe
          LogRocketService.instance.track('WALLET_TOPUP_SUCCESS', properties: {
            'amount': pkg.amount,
            'bonus': pkg.bonus,
            'method': _paymentMethod,
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('✅ ₹${pkg.totalCredits} securely added to your Boost Wallet!'), backgroundColor: Colors.green),
          );
          Navigator.pop(context);
        }
      }
    }

    void handleError(String err) {
      if (mounted) {
        setState(() => _isProcessing = false);
        HapticFeedback.heavyImpact(); // Error Vibe
        SentryService.instance.captureMessage('Wallet TopUp Failed: $err');
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(err), backgroundColor: AppColors.error));
      }
    }

    // 🚀 ROUTE TO REAL 5 GATEWAYS
    try {
      SentryService.instance.addBreadcrumb('Initiating Wallet TopUp for ₹${pkg.amount} via $_paymentMethod');
      
      switch (_paymentMethod) {
        case 'paypal':
          await PaymentService.instance.processPayPal(
            amount: pkg.amount.toDouble(),
            onSuccess: handleSuccess,
            onError: handleError,
          );
          break;
        case 'payu':
          await PaymentService.instance.processPayU(
            amountInRupees: pkg.amount.toDouble(),
            userEmail: userEmail,
            userPhone: userPhone,
            firstName: userName,
            onSuccess: handleSuccess,
            onError: handleError,
          );
          break;
        case 'braintree':
          await PaymentService.instance.processBraintree(
            amount: pkg.amount.toDouble(),
            onSuccess: handleSuccess,
            onError: handleError,
          );
          break;
        case 'paddle':
          await PaymentService.instance.processPaddle(
            amount: pkg.amount.toDouble(),
            onSuccess: handleSuccess,
            onError: handleError,
          );
          break;
        case 'adyen':
          await PaymentService.instance.processAdyen(
            amount: pkg.amount.toDouble(),
            onSuccess: handleSuccess,
            onError: handleError,
          );
          break;
        default:
          handleError('TriNetra Security: Invalid payment method selected.');
      }
    } catch (e, st) {
      SentryService.instance.captureException(e, stackTrace: st);
      handleError('System error during TopUp checkout.');
    }
  }
}

// ─── Payment Method Row (100% Asli 5 Gateways) ───────────────────
class _MethodRow extends StatelessWidget {
  final String selected;
  final bool isDark;
  final void Function(String) onChanged;
  
  const _MethodRow({
    required this.selected,
    required this.isDark,
    required this.onChanged
  });

  @override
  Widget build(BuildContext context) {
    // Only the 5 Master Gateways
    final methods = [
      ('payu', 'PayU India', Icons.account_balance_wallet),
      ('paypal', 'PayPal', Icons.payment),
      ('braintree', 'Braintree', Icons.credit_card),
      ('paddle', 'Paddle', Icons.shopping_cart),
      ('adyen', 'Adyen', Icons.security),
    ];
    
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: methods.map((m) {
        final isSelected = selected == m.$1;
        return GestureDetector(
          onTap: () => onChanged(m.$1),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 14),
            decoration: BoxDecoration(
              color: isSelected
                  ? AppColors.primary.withOpacity(0.1)
                  : (isDark ? AppColors.cardDark : Colors.white),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: isSelected ? AppColors.primary : (isDark ? AppColors.dividerDark : AppColors.dividerLight),
                width: isSelected ? 1.5 : 1,
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(m.$3, size: 18, color: isSelected ? AppColors.primary : Colors.grey),
                const SizedBox(width: 8),
                Text(m.$2,
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                      color: isSelected ? AppColors.primary : (isDark ? Colors.white70 : Colors.black87),
                    )),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}

// ─── Data ─────────────────────────────────────────────────────────
class _TopUpPackage {
  final int amount;
  final int bonus;
  final String label;
  const _TopUpPackage({required this.amount, required this.bonus, required this.label});
  int get totalCredits => amount + bonus;
}
