import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../../core/constants/app_colors.dart';
import '../controllers/payment_controller.dart';
import '../models/transaction_model.dart';

/// Full Transaction History Screen
class TransactionHistoryScreen extends ConsumerWidget {
  const TransactionHistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = ref.watch(paymentControllerProvider);

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
        title: Text(
          'Transaction History',
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
          : state.transactions.isEmpty
              ? const _EmptyState()
              : RefreshIndicator(
                  onRefresh: () =>
                      ref.read(paymentControllerProvider.notifier).refresh(),
                  color: AppColors.primary,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: state.transactions.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (_, index) => _TransactionCard(
                      t: state.transactions[index],
                      isDark: isDark,
                    ),
                  ),
                ),
    );
  }
}

class _TransactionCard extends StatelessWidget {
  final TransactionModel t;
  final bool isDark;

  const _TransactionCard({required this.t, required this.isDark});

  // 🔥 FIXED: displayName का लॉजिक यहीं स्क्रीन में डाल दिया है ताकि कोई एरर न आए 🔥
  String _getTypeName(TransactionType type) {
    switch (type) {
      case TransactionType.upiPayment: return 'UPI Payment';
      case TransactionType.adBoost: return 'Boost Post';
      case TransactionType.subscription: return 'Creator Pro';
      case TransactionType.marketplaceSale: return 'Marketplace Sale';
      case TransactionType.coinEarned: return 'Coins Earned';
      case TransactionType.coinRedeemed: return 'Coins Redeemed';
      case TransactionType.refund: return 'Refund';
      case TransactionType.payoutReceived: return 'Payout Received';
      case TransactionType.payoutRequested: return 'Payout Requested';
      default: return 'Payment';
    }
  }

  @override
  Widget build(BuildContext context) {
    final isCredit = t.isCredit;
    final statusColor = t.status == TransactionStatus.completed
        ? AppColors.success
        : t.status == TransactionStatus.failed
            ? AppColors.error
            : AppColors.warning;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: (isCredit ? AppColors.success : AppColors.error)
                  .withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              _typeIcon(t.type),
              color: isCredit ? AppColors.success : AppColors.error,
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 🔥 FIXED: यहाँ t.type.displayName को बदलकर _getTypeName(t.type) कर दिया है 🔥
                Text(
                  _getTypeName(t.type),
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                    color: isDark
                        ? AppColors.textPrimaryDark
                        : AppColors.textPrimaryLight,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  t.description,
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark
                        ? AppColors.textSecondaryDark
                        : AppColors.textSecondaryLight,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        t.status.name.toUpperCase(),
                        style: TextStyle(
                          color: statusColor,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      timeago.format(t.createdAt),
                      style: TextStyle(
                        fontSize: 11,
                        color: isDark
                            ? AppColors.textSecondaryDark
                            : AppColors.textSecondaryLight,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${isCredit ? '+' : '-'}₹${t.amount.toStringAsFixed(2)}',
                style: TextStyle(
                  color: isCredit ? AppColors.success : AppColors.error,
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                ),
              ),
              Text(
                t.currency,
                style: TextStyle(
                  fontSize: 11,
                  color: isDark
                      ? AppColors.textSecondaryDark
                      : AppColors.textSecondaryLight,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  IconData _typeIcon(TransactionType type) {
    switch (type) {
      case TransactionType.upiPayment: return Icons.phone_android;
      case TransactionType.adBoost: return Icons.rocket_launch;
      case TransactionType.subscription: return Icons.verified;
      case TransactionType.coinEarned: return Icons.monetization_on;
      case TransactionType.coinRedeemed: return Icons.redeem;
      case TransactionType.marketplaceSale: return Icons.storefront;
      default: return Icons.payment;
    }
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.receipt_long_outlined, size: 64, color: Colors.grey[400]),
          const SizedBox(height: 16),
          const Text(
            'No Transactions Yet',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
          Text(
            'Your payment history will appear here',
            style: TextStyle(color: Colors.grey[600], fontSize: 14),
          ),
        ],
      ),
    );
  }
}
