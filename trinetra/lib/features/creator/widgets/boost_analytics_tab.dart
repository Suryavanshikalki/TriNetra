import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTIC FEEDBACK
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/providers/user_providers.dart';
import '../../../core/services/sentry_service.dart'; // 🔥 CRASH TRACKING
import '../../../core/services/logrocket_service.dart'; // 🔥 USER ANALYTICS

// ==============================================================
// 👁️🔥 TRINETRA MASTER BOOST ANALYTICS (Blueprint Point 6)
// 100% REAL: Pull-to-Refresh, Premium Haptics, Live Ad Tracking
// ==============================================================

class BoostAnalyticsTab extends ConsumerWidget {
  const BoostAnalyticsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    // AWS AppSync Live Data Provider
    final boostsAsync = ref.watch(boostAnalyticsProvider);

    return boostsAsync.when(
      loading: () => const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      ),
      error: (e, st) {
        // Track error in Sentry
        SentryService.instance.captureException(e, stackTrace: st);
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Colors.orange),
              const SizedBox(height: 12),
              Text(
                'Failed to load live boost data',
                style: TextStyle(color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () {
                  HapticFeedback.mediumImpact();
                  ref.invalidate(boostAnalyticsProvider);
                },
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
              )
            ],
          ),
        );
      },
      data: (boosts) {
        // Log view
        LogRocketService.instance.logPageView('Boost_Analytics_Loaded');
        
        return RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            HapticFeedback.lightImpact(); // Premium Refresh Vibe
            ref.invalidate(boostAnalyticsProvider);
            await ref.read(boostAnalyticsProvider.future);
          },
          child: boosts.isEmpty
              ? _EmptyState(isDark: isDark)
              : _BoostDashboard(boosts: boosts, isDark: isDark),
        );
      },
    );
  }
}

// ─── Empty State ──────────────────────────────────────────────────
class _EmptyState extends StatelessWidget {
  final bool isDark;
  const _EmptyState({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return ListView( // Changed to ListView so Pull-to-Refresh works even when empty
      physics: const AlwaysScrollableScrollPhysics(),
      children: [
        SizedBox(
          height: MediaQuery.of(context).size.height * 0.6,
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.rocket_launch_outlined, size: 40, color: AppColors.primary),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'No Boosted Posts Yet',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Boost a post to amplify your reach.\nYour TriNetra analytics will appear here.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
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
    // Aggregate totals from AWS Data
    final totalImpressions = boosts.fold<int>(0, (sum, b) => sum + ((b['impressions'] as num?)?.toInt() ?? 0));
    final totalClicks = boosts.fold<int>(0, (sum, b) => sum + ((b['clicks'] as num?)?.toInt() ?? 0));
    final ctr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0.0;

    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
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
          'Active & Past Boosts',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
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
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
              fontWeight: FontWeight.w600,
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
    final content = (boost['content'] as String?) ?? 'Boosted Post';
    final status = (boost['status'] as String?) ?? 'active';
    final budgetTotal = (boost['budgetTotal'] as num?)?.toDouble() ?? 0.0;
    final budgetSpent = (boost['budgetSpent'] as num?)?.toDouble() ?? 0.0;
    final spentPct = budgetTotal > 0 ? (budgetSpent / budgetTotal) : 0.0;

    Color statusColor;
    switch (status.toLowerCase()) {
      case 'active':
        statusColor = Colors.green;
        break;
      case 'paused':
        statusColor = Colors.orange;
        break;
      case 'completed':
        statusColor = AppColors.primary;
        break;
      default:
        statusColor = Colors.grey;
    }

    return GestureDetector(
      onTap: () {
        HapticFeedback.selectionClick();
        // Optional: Open deeper analytics for this specific post
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isDark ? AppColors.dividerDark : AppColors.dividerLight),
          boxShadow: [
            BoxShadow(
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
                      fontWeight: FontWeight.w700,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
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
                _MetricChip(label: 'Impressions', value: _fmt(impressions), isDark: isDark),
                _MetricChip(label: 'Clicks', value: _fmt(clicks), isDark: isDark),
                _MetricChip(label: 'CTR', value: '${ctr.toStringAsFixed(1)}%', isDark: isDark),
              ],
            ),
            const SizedBox(height: 16),

            // Budget progress
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Ad Budget Spent',
                  style: TextStyle(fontSize: 12, color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight),
                ),
                Text(
                  '₹${budgetSpent.toStringAsFixed(0)} / ₹${budgetTotal.toStringAsFixed(0)}',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: spentPct.clamp(0.0, 1.0),
                backgroundColor: isDark ? AppColors.surfaceDark : AppColors.inputBgLight,
                valueColor: AlwaysStoppedAnimation<Color>(statusColor),
                minHeight: 6,
              ),
            ),
          ],
        ),
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

  const _MetricChip({required this.label, required this.value, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
