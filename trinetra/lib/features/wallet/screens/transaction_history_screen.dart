import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTICS
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../../core/constants/app_colors.dart';
import '../../../core/services/logrocket_service.dart'; // 🔥 ASLI TRACKING
import '../controllers/payment_controller.dart';
import '../models/transaction_model.dart';

// ==============================================================
// 👁️🔥 TRINETRA WALLET HISTORY (Blueprint Point 6)
// 100% REAL: Web Safe Opacity, Haptics, LogRocket Tracking
// ==============================================================

class TransactionHistoryScreen extends ConsumerStatefulWidget {
  const TransactionHistoryScreen({super.key});

  @override
  ConsumerState<TransactionHistoryScreen> createState() => _TransactionHistoryScreenState();
}

class _TransactionHistoryScreenState extends ConsumerState<TransactionHistoryScreen> {
  
  @override
  void initState() {
    super.initState();
    // 🔥 ASLI ACTION: Track when user opens their finance ledger
    LogRocketService.instance.track('Transaction_History_Opened');
  }

  Future<void> _handleRefresh() async {
    HapticFeedback.lightImpact(); // 🔥 Premium pull-to-refresh feel
    LogRocketService.instance.track('Transaction_History_Refreshed');
    await ref.read(paymentControllerProvider.notifier).refresh();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final state = ref.watch(paymentControllerProvider);

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
        title: Text(
          'Transaction History',
          style: TextStyle(
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            fontWeight: FontWeight.w900, // TriNetra Bold
            letterSpacing: 0.2,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () {
            HapticFeedback.selectionClick();
            Navigator.pop(context);
          },
        ),
      ),
      body: state.isLoading && state.transactions.isEmpty
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : state.transactions.isEmpty
              ? const _EmptyState()
              : RefreshIndicator(
                  onRefresh: _handleRefresh,
                  color: AppColors.primary,
                  backgroundColor: isDark ? AppColors.cardDark : Colors.white,
                  child: ListView.separated(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
                    itemCount: state.transactions.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (_, index) => _TransactionCard(
                      t: state.transactions[index],
                      isDark: isDark,
                    ),
                  ),
                ),
    );
  }
}

// ─── TRANSACTION CARD ─────────────────────────────────────────────
class _TransactionCard extends StatelessWidget {
  final TransactionModel t;
  final bool isDark;

  const _TransactionCard({required this.t, required this.isDark});

  // 🔥 Smart Type Resolver
  String _getTypeName(TransactionType type) {
    switch (type) {
      case TransactionType.upiPayment: return 'Wallet Top-up (UPI)';
      case TransactionType.adBoost: return 'Post Ad Boost';
      case TransactionType.subscription: return 'Creator Pro / AI Plan';
      case TransactionType.marketplaceSale: return 'Marketplace Sale';
      case TransactionType.coinEarned: return 'Reward Coins Earned';
      case TransactionType.coinRedeemed: return 'Coins Converted to Cash';
      case TransactionType.refund: return 'Refund Received';
      case TransactionType.payoutReceived: return 'Bank Payout Received';
      case TransactionType.payoutRequested: return 'Bank Payout Requested';
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

    return GestureDetector(
      onTap: () {
        HapticFeedback.selectionClick();
        LogRocketService.instance.track('Transaction_Card_Tapped', properties: {'txId': t.id, 'type': t.type.name});
        // TODO: Future Implementation - Open Transaction Detail BottomSheet
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isDark ? AppColors.dividerDark : Colors.grey.withOpacity(0.1)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            // ─── ICON ───
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: (isCredit ? AppColors.success : AppColors.error).withOpacity(0.12), // 🔥 FIXED STABILITY
                shape: BoxShape.circle,
              ),
              child: Icon(
                _typeIcon(t.type),
                color: isCredit ? AppColors.success : AppColors.error,
                size: 24,
              ),
            ),
            const SizedBox(width: 14),
            
            // ─── DETAILS ───
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _getTypeName(t.type),
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 15,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    t.description,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: statusColor.withOpacity(0.12), // 🔥 FIXED STABILITY
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          t.status.name.toUpperCase(),
                          style: TextStyle(
                            color: statusColor,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        timeago.format(t.createdAt, locale: 'en_short'),
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: isDark ? AppColors.textSecondaryDark : Colors.grey[500],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            // ─── AMOUNT ───
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '${isCredit ? '+' : '-'}₹${t.amount.toStringAsFixed(2)}',
                  style: TextStyle(
                    color: isCredit ? AppColors.success : AppColors.error,
                    fontWeight: FontWeight.w900,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  t.currency,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  IconData _typeIcon(TransactionType type) {
    switch (type) {
      case TransactionType.upiPayment: return Icons.account_balance_wallet;
      case TransactionType.adBoost: return Icons.rocket_launch;
      case TransactionType.subscription: return Icons.workspace_premium;
      case TransactionType.coinEarned: return Icons.monetization_on;
      case TransactionType.coinRedeemed: return Icons.currency_exchange;
      case TransactionType.marketplaceSale: return Icons.storefront;
      case TransactionType.payoutReceived: return Icons.account_balance;
      case TransactionType.payoutRequested: return Icons.schedule_send;
      case TransactionType.refund: return Icons.settings_backup_restore;
      default: return Icons.payment;
    }
  }
}

// ─── EMPTY STATE ──────────────────────────────────────────────────
class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.05), // 🔥 FIXED STABILITY
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.receipt_long_rounded, size: 70, color: AppColors.primary.withOpacity(0.5)),
          ),
          const SizedBox(height: 20),
          const Text(
            'No Transactions Yet',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 8),
          Text(
            'Your TriNetra Pay history will appear here',
            style: TextStyle(color: Colors.grey[500], fontSize: 14, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}
