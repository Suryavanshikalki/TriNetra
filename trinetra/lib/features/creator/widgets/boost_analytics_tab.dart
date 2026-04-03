import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/providers/user_providers.dart';

class BoostAnalyticsTab extends ConsumerWidget {
  const BoostAnalyticsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final boostsAsync = ref.watch(boostAnalyticsProvider);

    return boostsAsync.when(
      loading: () => const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      ),
      error: (e, _) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.orange),
            const SizedBox(height: 12),
            Text('Failed to load boost data',
                style: TextStyle(
                    color: isDark
                        ? AppColors.textSecondaryDark
                        : AppColors.textSecondaryLight)),
          ],
        ),
      ),
      data: (boosts) => boosts.isEmpty
          ? _EmptyState(isDark: isDark)
          : _BoostDashboard(boosts: boosts, isDark: isDark),
    );
  }
}

// ─── Empty State ──────────────────────────────────────────────────
class _EmptyState extends StatelessWidget {
  final bool isDark;
  const _EmptyState({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                // 🔥 FIXED: withOpacity को withValues(alpha:) कर दिया गया है 🔥
                color: AppColors.primary.withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.rocket_launch_outlined,
                  size: 40, color: AppColors.primary),
            ),
            const SizedBox(height: 20),
            Text(
              'No Boosted Posts Yet',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: isDark
                    ? AppColors.textPrimaryDark
                    : AppColors.textPrimaryLight,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Boost a post to amplify your reach.\nYour analytics will appear here.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: isDark
                    ? AppColors.textSecondaryDark
                    : AppColors.textSecondaryLight,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Boost Dashboard ──────────────────────────────────────────────
class _BoostDashboard extends StatelessWidget {
  final List<Map<String, dynamic>> boosts;
  final bool isDark;
  const _BoostDashboard({required this.boosts, required this.isDark});

  @override
  Widget build(BuildContext context) {
    // Aggregate totals
    final totalImpressions = boosts.fold<int>(
        0, (sum, b) => sum + ((b['impressions'] as num?)?.toInt() ?? 0));
    final totalClicks = boosts.fold<int>(
        0, (sum, b) => sum + ((b['clicks'] as num?)?.toInt() ?? 0));
    final ctr = totalImpressions > 0
        ? (totalClicks / totalImpressions * 100)
        : 0.0;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // ─── Summary Row ─────────────────────────────────────────
        Row(
          children: [
            Expanded(
              child: _SummaryCard(
                label: 'Impressions',
                value: _fmt(totalImpressions),
                icon: Icons.visibility_outlined,
                color: AppColors.primary,
                isDark: isDark,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _SummaryCard(
                label: 'Clicks',
                value: _fmt(totalClicks),
                icon: Icons.ads_click,
                color: Colors.green,
                isDark: isDark,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _SummaryCard(
                label: 'Avg CTR',
                value: '${ctr.toStringAsFixed(1)}%',
                icon: Icons.percent,
                color: Colors.orange,
                isDark: isDark,
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // ─── Section Header ──────────────────────────────────────
        Text(
          'Boosted Posts',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: isDark
                ? AppColors.textPrimaryDark
                : AppColors.textPrimaryLight,
          ),
        ),
        const SizedBox(height: 12),

        // ─── Post Cards ──────────────────────────────────────────
        ...boosts.map((b) => _BoostCard(boost: b, isDark: isDark)),
      ],
    );
  }

  String _fmt(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}K';
    return '$n';
  }
}

// ─── Summary Card ─────────────────────────────────────────────────
class _SummaryCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  final bool isDark;

  const _SummaryCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            // 🔥 FIXED 🔥
            color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          )
        ],
      ),
      child: Column(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              // 🔥 FIXED 🔥
              color: color.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 18, color: color),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: isDark
                  ? AppColors.textPrimaryDark
                  : AppColors.textPrimaryLight,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
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

// ─── Boost Post Card ──────────────────────────────────────────────
class _BoostCard extends StatelessWidget {
  final Map<String, dynamic> boost;
  final bool isDark;

  const _BoostCard({required this.boost, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final impressions = (boost['impressions'] as num?)?.toInt() ?? 0;
    final clicks = (boost['clicks'] as num?)?.toInt() ?? 0;
    final ctr = impressions > 0 ? (clicks / impressions * 100) : 0.0;
    final content = (boost['content'] as String?) ?? 'Boosted post';
    final status = (boost['status'] as String?) ?? 'active';
    final budgetTotal = (boost['budgetTotal'] as num?)?.toDouble() ?? 0.0;
    final budgetSpent = (boost['budgetSpent'] as num?)?.toDouble() ?? 0.0;
    final spentPct = budgetTotal > 0 ? (budgetSpent / budgetTotal) : 0.0;

    Color statusColor;
    switch (status) {
      case 'active':
        statusColor = Colors.green;
        break;
      case 'paused':
        statusColor = Colors.orange;
        break;
      default:
        statusColor = Colors.grey;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            // 🔥 FIXED 🔥
            color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          Row(
            children: [
              Expanded(
                child: Text(
                  content,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isDark
                        ? AppColors.textPrimaryDark
                        : AppColors.textPrimaryLight,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  // 🔥 FIXED 🔥
                  color: statusColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  status.toUpperCase(),
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: statusColor,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Metrics row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _MetricChip(
                  label: 'Impressions',
                  value: _fmt(impressions),
                  isDark: isDark),
              _MetricChip(
                  label: 'Clicks',
                  value: _fmt(clicks),
                  isDark: isDark),
              _MetricChip(
                  label: 'CTR',
                  value: '${ctr.toStringAsFixed(1)}%',
                  isDark: isDark),
            ],
          ),
          const SizedBox(height: 12),

          // Budget progress
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Budget',
                style: TextStyle(
                  fontSize: 12,
                  color: isDark
                      ? AppColors.textSecondaryDark
                      : AppColors.textSecondaryLight,
                ),
              ),
              Text(
                '₹${budgetSpent.toStringAsFixed(0)} / ₹${budgetTotal.toStringAsFixed(0)}',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: isDark
                      ? AppColors.textPrimaryDark
                      : AppColors.textPrimaryLight,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: spentPct.clamp(0.0, 1.0),
              backgroundColor: isDark
                  ? AppColors.surfaceDark
                  : AppColors.inputBgLight,
              valueColor:
                  const AlwaysStoppedAnimation<Color>(AppColors.primary),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  String _fmt(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}K';
    return '$n';
  }
}

// ─── Metric Chip ──────────────────────────────────────────────────
class _MetricChip extends StatelessWidget {
  final String label;
  final String value;
  final bool isDark;

  const _MetricChip(
      {required this.label, required this.value, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            color: isDark
                ? AppColors.textPrimaryDark
                : AppColors.textPrimaryLight,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            color: isDark
                ? AppColors.textSecondaryDark
                : AppColors.textSecondaryLight,
          ),
        ),
      ],
    );
  }
}
