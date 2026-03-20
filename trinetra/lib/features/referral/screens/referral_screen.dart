import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:share_plus/share_plus.dart';
import '../../../core/constants/app_colors.dart';
import '../../auth/controllers/auth_controller.dart';
import '../controllers/referral_controller.dart';
import '../models/referral_model.dart';

/// TriNetra Coins — Refer & Earn Screen
class ReferralScreen extends ConsumerStatefulWidget {
  const ReferralScreen({super.key});

  @override
  ConsumerState<ReferralScreen> createState() => _ReferralScreenState();
}

class _ReferralScreenState extends ConsumerState<ReferralScreen> {
  final TextEditingController _codeController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = ref.watch(referralControllerProvider);
    final data = state.data;

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
        title: Text(
          'Refer & Earn',
          style: TextStyle(
            color: isDark
                ? AppColors.textPrimaryDark
                : AppColors.textPrimaryLight,
            fontWeight: FontWeight.w700,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: state.isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primary))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // ─── Coins Banner ──────────────────────────
                  _CoinsBanner(
                    coins: data?.coinsAvailable ?? 0,
                    isDark: isDark,
                  ),

                  const SizedBox(height: 16),

                  // ─── Referral Code Card ─────────────────────
                  if (data != null) ...[
                    _ReferralCodeCard(
                      code: data.referralCode,
                      totalReferrals: data.totalReferrals,
                      isDark: isDark,
                    ),

                    const SizedBox(height: 16),

                    // ─── Stats Row ──────────────────────────
                    _StatsRow(data: data, isDark: isDark),

                    const SizedBox(height: 16),
                  ],

                  // ─── Enter Code (for new users) ─────────────
                  _EnterCodeCard(
                    controller: _codeController,
                    isDark: isDark,
                    onApply: _applyCode,
                  ),

                  const SizedBox(height: 16),

                  // ─── Redeem Section ─────────────────────────
                  if ((data?.coinsAvailable ?? 0) > 0)
                    _RedeemCard(
                      coins: data?.coinsAvailable ?? 0,
                      valueInRupees: data?.availableValueInRupees ?? 0,
                      canRedeem: data?.canRedeem ?? false,
                      isDark: isDark,
                      onRedeem: () => _redeem(data!),
                    ),

                  const SizedBox(height: 16),

                  // ─── How It Works ────────────────────────────
                  _HowItWorks(isDark: isDark),
                ],
              ),
            ),
    );
  }

  Future<void> _applyCode(String code) async {
    if (code.trim().isEmpty) return;
    final success = await ref
        .read(referralControllerProvider.notifier)
        .applyReferralCode(code.trim());
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(success
              ? 'Code applied! You earned ${ReferralModel.welcomeBonus} TriNetra Coins!'
              : ref.read(referralControllerProvider).error ?? 'Invalid code'),
          backgroundColor: success ? AppColors.success : AppColors.error,
        ),
      );
      if (success) _codeController.clear();
    }
  }

  Future<void> _redeem(ReferralModel data) async {
    if (!data.canRedeem) return;
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Redeem Coins'),
        content: Text(
          'Redeem ${data.coinsAvailable} coins for ₹${data.availableValueInRupees.toStringAsFixed(2)} in ad credits?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              final success = await ref
                  .read(referralControllerProvider.notifier)
                  .redeemCoins(data.coinsAvailable);
              if (mounted && success) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Coins redeemed as Ad Credits!'),
                    backgroundColor: AppColors.success,
                  ),
                );
              }
            },
            child: const Text('Redeem'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }
}

// ─── Coins Banner ─────────────────────────────────────────────────
class _CoinsBanner extends StatelessWidget {
  final int coins;
  final bool isDark;

  const _CoinsBanner({required this.coins, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFFD700), Color(0xFFFFA000)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFFD700).withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          const Icon(Icons.monetization_on, color: Colors.white, size: 48),
          const SizedBox(height: 8),
          Text(
            '$coins',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 48,
              fontWeight: FontWeight.w900,
            ),
          ),
          const Text(
            'TriNetra Coins',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '1 Coin = ₹${ReferralModel.coinValueInRupees} Ad Credit',
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
        ],
      ),
    );
  }
}

// ─── Referral Code Card ───────────────────────────────────────────
class _ReferralCodeCard extends StatelessWidget {
  final String code;
  final int totalReferrals;
  final bool isDark;

  const _ReferralCodeCard({
    required this.code,
    required this.totalReferrals,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Text(
            'Your Referral Code',
            style: TextStyle(
              fontSize: 14,
              color: isDark
                  ? AppColors.textSecondaryDark
                  : AppColors.textSecondaryLight,
            ),
          ),
          const SizedBox(height: 12),
          // Code display
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppColors.primary.withValues(alpha: 0.3),
                style: BorderStyle.solid,
              ),
            ),
            child: Text(
              code,
              style: const TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.w900,
                color: AppColors.primary,
                letterSpacing: 4,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            '$totalReferrals friends joined with your code',
            style: TextStyle(
              fontSize: 13,
              color: isDark
                  ? AppColors.textSecondaryDark
                  : AppColors.textSecondaryLight,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.copy, size: 16),
                  label: const Text('Copy'),
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: code));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Code copied!')),
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    side: const BorderSide(color: AppColors.primary),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.share, size: 16),
                  label: const Text('Share'),
                  onPressed: () => Share.share(
                    'Join TriNetra — India\'s Premium Social Super-App!\n'
                    'Use my referral code: $code and get 50 TriNetra Coins FREE!\n'
                    'Download: https://trinetra.web.app',
                    subject: 'Join TriNetra with my code: $code',
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── Stats Row ────────────────────────────────────────────────────
class _StatsRow extends StatelessWidget {
  final ReferralModel data;
  final bool isDark;

  const _StatsRow({required this.data, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _StatCard(
            label: 'Total Referred',
            value: '${data.totalReferrals}',
            icon: Icons.people_outline,
            color: AppColors.primary,
            isDark: isDark,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _StatCard(
            label: 'Total Earned',
            value: '${data.totalCoinsEarned}',
            icon: Icons.star_outline,
            color: const Color(0xFFFFD700),
            isDark: isDark,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _StatCard(
            label: 'Redeemed',
            value: '${data.coinsRedeemed}',
            icon: Icons.redeem,
            color: AppColors.accent,
            isDark: isDark,
          ),
        ),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  final bool isDark;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
          ),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 10,
              color: isDark
                  ? AppColors.textSecondaryDark
                  : AppColors.textSecondaryLight,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Enter Code Card ──────────────────────────────────────────────
class _EnterCodeCard extends StatelessWidget {
  final TextEditingController controller;
  final bool isDark;
  final void Function(String) onApply;

  const _EnterCodeCard({
    required this.controller,
    required this.isDark,
    required this.onApply,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Have a referral code?',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: controller,
                  textCapitalization: TextCapitalization.characters,
                  decoration: InputDecoration(
                    hintText: 'Enter code (e.g. TNABC123)',
                    filled: true,
                    fillColor: isDark
                        ? AppColors.surfaceDark
                        : AppColors.inputBgLight,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                onPressed: () => onApply(controller.text),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accent,
                  minimumSize: const Size(80, 48),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('Apply'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── Redeem Card ──────────────────────────────────────────────────
class _RedeemCard extends StatelessWidget {
  final int coins;
  final double valueInRupees;
  final bool canRedeem;
  final bool isDark;
  final VoidCallback onRedeem;

  const _RedeemCard({
    required this.coins,
    required this.valueInRupees,
    required this.canRedeem,
    required this.isDark,
    required this.onRedeem,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Redeem Coins',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 15,
                  color: isDark
                      ? AppColors.textPrimaryDark
                      : AppColors.textPrimaryLight,
                ),
              ),
              Text(
                '₹${valueInRupees.toStringAsFixed(2)} value',
                style: const TextStyle(
                  color: AppColors.success,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            canRedeem
                ? 'Redeem $coins coins as Ad Credits or request payout to UPI'
                : 'Need ${ReferralModel.minimumRedeem - coins} more coins to redeem (min ${ReferralModel.minimumRedeem} coins)',
            style: TextStyle(
              fontSize: 13,
              color: isDark
                  ? AppColors.textSecondaryDark
                  : AppColors.textSecondaryLight,
            ),
          ),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: canRedeem ? onRedeem : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.accent,
              minimumSize: const Size(double.infinity, 44),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text('Redeem Now'),
          ),
        ],
      ),
    );
  }
}

// ─── How It Works ─────────────────────────────────────────────────
class _HowItWorks extends StatelessWidget {
  final bool isDark;
  const _HowItWorks({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'How it works',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
          ),
          const SizedBox(height: 12),
          _Step(
            step: '1',
            title: 'Share your code',
            desc: 'Share your unique referral code with friends',
            color: AppColors.primary,
          ),
          _Step(
            step: '2',
            title: 'Friend joins TriNetra',
            desc: 'They sign up using your code',
            color: AppColors.accent,
          ),
          _Step(
            step: '3',
            title: 'Both earn coins',
            desc: 'You get ${ReferralModel.coinsPerReferral} coins, they get ${ReferralModel.welcomeBonus} welcome coins',
            color: const Color(0xFFFFD700),
          ),
          _Step(
            step: '4',
            title: 'Redeem rewards',
            desc: 'Use coins for Ad boosts or UPI payout (₹${ReferralModel.coinValueInRupees}/coin)',
            color: AppColors.success,
          ),
        ],
      ),
    );
  }
}

class _Step extends StatelessWidget {
  final String step;
  final String title;
  final String desc;
  final Color color;

  const _Step({
    required this.step,
    required this.title,
    required this.desc,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                step,
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.w900,
                  fontSize: 13,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: const TextStyle(
                        fontWeight: FontWeight.w700, fontSize: 14)),
                Text(desc,
                    style: TextStyle(
                        fontSize: 12, color: Colors.grey[600])),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
