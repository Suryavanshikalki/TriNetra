import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/config/app_config.dart';
import '../controllers/creator_controller.dart';
import '../widgets/boost_analytics_tab.dart';

class CreatorStudioScreen extends ConsumerStatefulWidget {
  const CreatorStudioScreen({super.key});

  @override
  ConsumerState<CreatorStudioScreen> createState() =>
      _CreatorStudioScreenState();
}

class _CreatorStudioScreenState extends ConsumerState<CreatorStudioScreen>
    with SingleTickerProviderStateMixin {
  final _upiController = TextEditingController();
  late TabController _tabController;
  bool _showPayoutForm = false;
  String _payoutMethod = 'upi';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _upiController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final creatorState = ref.watch(creatorControllerProvider);
    final stats = creatorState.stats;

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        title: const Text('Creator Studio',
            style: TextStyle(fontWeight: FontWeight.w900)),
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () =>
                ref.read(creatorControllerProvider.notifier).refresh(),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primary,
          labelColor: AppColors.primary,
          unselectedLabelColor: isDark
              ? AppColors.textSecondaryDark
              : AppColors.textSecondaryLight,
          tabs: const [
            Tab(icon: Icon(Icons.dashboard_outlined, size: 20), text: 'Dashboard'),
            Tab(icon: Icon(Icons.rocket_launch_outlined, size: 20), text: 'Boosts'),
          ],
        ),
      ),
      body: creatorState.isLoading && stats == null
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.primary))
          : TabBarView(
              controller: _tabController,
              children: [
                // ─── Tab 1: Dashboard ──────────────────────
                RefreshIndicator(
                  onRefresh: () =>
                      ref.read(creatorControllerProvider.notifier).refresh(),
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      // ─── Status Banner ──────────────────────────
                      _StatusBanner(
                          isCreatorPro: stats?.isCreatorPro ?? false,
                          isDark: isDark),
                      const SizedBox(height: 16),

                      // ─── Earnings Card ──────────────────────────
                      _EarningsCard(stats: stats, isDark: isDark),
                      const SizedBox(height: 12),

                      // ─── Revenue Split ──────────────────────────
                      _RevenueSplitCard(
                          isCreatorPro: stats?.isCreatorPro ?? false,
                          isDark: isDark),
                      const SizedBox(height: 12),

                      // ─── Stats Grid ─────────────────────────────
                      _StatsGrid(stats: stats, isDark: isDark),
                      const SizedBox(height: 12),

                      // ─── Payout Section ─────────────────────────
                      _PayoutSection(
                        stats: stats,
                        isDark: isDark,
                        showForm: _showPayoutForm,
                        payoutMethod: _payoutMethod,
                        upiController: _upiController,
                        onToggleForm: () =>
                            setState(() => _showPayoutForm = !_showPayoutForm),
                        onMethodChange: (m) =>
                            setState(() => _payoutMethod = m),
                        onRequestPayout: (amount) => _requestPayout(amount),
                      ),
                      const SizedBox(height: 12),

                      // ─── Payout History ─────────────────────────
                      if (stats?.payoutHistory.isNotEmpty == true)
                        _PayoutHistory(
                            history: stats!.payoutHistory, isDark: isDark),

                      // ─── Error / Message ─────────────────────────
                      if (creatorState.error != null)
                        _MessageBanner(
                            text: creatorState.error!, isError: true),
                      if (creatorState.message != null)
                        _MessageBanner(text: creatorState.message!),

                      const SizedBox(height: 32),
                    ],
                  ),
                ),

                // ─── Tab 2: Boost Analytics ────────────────
                const BoostAnalyticsTab(),
              ],
            ),
    );
  }

  Future<void> _requestPayout(double amount) async {
    final dest = _upiController.text.trim();
    if (dest.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Enter your ${_payoutMethod == 'upi' ? 'UPI ID' : 'PayPal email'}.'),
        ),
      );
      return;
    }
    final success = await ref
        .read(creatorControllerProvider.notifier)
        .requestPayout(
          amount: amount,
          method: _payoutMethod,
          destination: dest,
        );
    if (success && mounted) {
      setState(() => _showPayoutForm = false);
      _upiController.clear();
    }
  }
}

// ─── Status Banner ────────────────────────────────────────────────
class _StatusBanner extends StatelessWidget {
  final bool isCreatorPro;
  final bool isDark;
  const _StatusBanner({required this.isCreatorPro, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: isCreatorPro
            ? const LinearGradient(
                colors: [Color(0xFFFFD700), Color(0xFFFFA500)],
              )
            : LinearGradient(
                colors: [AppColors.primary, AppColors.primaryDark],
              ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Icon(
            isCreatorPro ? Icons.verified : Icons.person_outline,
            color: Colors.white,
            size: 32,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isCreatorPro ? 'Creator Pro' : 'Free Creator',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                Text(
                  isCreatorPro
                      ? '70% revenue share + Blue Verification Badge'
                      : '${(AppConfig.creatorRevenueCut * 100).toInt()}% ad revenue share',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          if (!isCreatorPro)
            TextButton(
              onPressed: () => Navigator.pushNamed(context, '/creator-pro'),
              style: TextButton.styleFrom(
                backgroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              ),
              child: const Text(
                'Upgrade',
                style: TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// ─── Earnings Card ────────────────────────────────────────────────
class _EarningsCard extends StatelessWidget {
  final CreatorStats? stats;
  final bool isDark;
  const _EarningsCard({this.stats, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return _Card(
      isDark: isDark,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _SectionTitle('Earnings Overview', isDark: isDark),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _EarningsTile(
                label: 'Your Earnings',
                value: '₹${(stats?.creatorEarnings ?? 0).toStringAsFixed(2)}',
                icon: Icons.account_balance_wallet,
                color: Colors.green,
                isDark: isDark,
              ),
              _EarningsTile(
                label: 'Pending Payout',
                value: '₹${(stats?.pendingPayout ?? 0).toStringAsFixed(2)}',
                icon: Icons.hourglass_top,
                color: Colors.orange,
                isDark: isDark,
              ),
              _EarningsTile(
                label: 'Paid Out',
                value: '₹${(stats?.paidOut ?? 0).toStringAsFixed(2)}',
                icon: Icons.check_circle_outline,
                color: AppColors.primary,
                isDark: isDark,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── Revenue Split Card ───────────────────────────────────────────
class _RevenueSplitCard extends StatelessWidget {
  final bool isCreatorPro;
  final bool isDark;
  const _RevenueSplitCard(
      {required this.isCreatorPro, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final creatorPct = isCreatorPro ? 70.0 : 30.0;
    final platformPct = isCreatorPro ? 30.0 : 70.0;

    return _Card(
      isDark: isDark,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _SectionTitle('Ad Revenue Split', isDark: isDark),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: SizedBox(
              height: 24,
              child: Row(
                children: [
                  Flexible(
                    flex: creatorPct.toInt(),
                    child: Container(
                      color: Colors.green,
                      child: Center(
                        child: Text(
                          '${creatorPct.toInt()}% You',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Flexible(
                    flex: platformPct.toInt(),
                    child: Container(
                      color: AppColors.primary,
                      child: Center(
                        child: Text(
                          '${platformPct.toInt()}% Platform',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            isCreatorPro
                ? 'Creator Pro: You keep 70% of ad revenue. Platform takes 30%.'
                : 'Free tier: You keep 30% of ad revenue from your posts. Upgrade to Pro for a 70% share.',
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
}

// ─── Stats Grid ───────────────────────────────────────────────────
class _StatsGrid extends StatelessWidget {
  final CreatorStats? stats;
  final bool isDark;
  const _StatsGrid({this.stats, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return _Card(
      isDark: isDark,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _SectionTitle('Performance Stats', isDark: isDark),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 8,
            crossAxisSpacing: 8,
            childAspectRatio: 2.5,
            children: [
              _StatTile('Posts', '${stats?.totalPosts ?? 0}',
                  Icons.article_outlined, isDark),
              _StatTile('Views', _fmt(stats?.totalViews ?? 0),
                  Icons.visibility_outlined, isDark),
              _StatTile('Ad Impressions', _fmt(stats?.totalAdImpressions ?? 0),
                  Icons.ads_click, isDark),
              _StatTile('CPM',
                  '₹${(stats?.cpm ?? 0).toStringAsFixed(2)}',
                  Icons.bar_chart, isDark),
            ],
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

// ─── Payout Section ───────────────────────────────────────────────
class _PayoutSection extends StatelessWidget {
  final CreatorStats? stats;
  final bool isDark;
  final bool showForm;
  final String payoutMethod;
  final TextEditingController upiController;
  final VoidCallback onToggleForm;
  final void Function(String) onMethodChange;
  final void Function(double) onRequestPayout;

  const _PayoutSection({
    this.stats,
    required this.isDark,
    required this.showForm,
    required this.payoutMethod,
    required this.upiController,
    required this.onToggleForm,
    required this.onMethodChange,
    required this.onRequestPayout,
  });

  @override
  Widget build(BuildContext context) {
    final pending = stats?.pendingPayout ?? 0;
    final canRequest = pending >= 100;

    return _Card(
      isDark: isDark,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _SectionTitle('Request Payout', isDark: isDark),
              Text(
                '₹${pending.toStringAsFixed(2)} available',
                style: TextStyle(
                  color: canRequest ? Colors.green : Colors.orange,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          if (!canRequest)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(
                'Minimum ₹100 required. Keep creating to earn more!',
                style: TextStyle(
                  fontSize: 12,
                  color: isDark
                      ? AppColors.textSecondaryDark
                      : AppColors.textSecondaryLight,
                ),
              ),
            ),
          if (canRequest && !showForm) ...[
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: onToggleForm,
                icon: const Icon(Icons.payments_outlined),
                label: const Text('Request Payout'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            ),
          ],
          if (showForm) ...[
            const SizedBox(height: 12),
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(value: 'upi', label: Text('UPI')),
                ButtonSegment(value: 'paypal', label: Text('PayPal')),
              ],
              selected: {payoutMethod},
              onSelectionChanged: (s) => onMethodChange(s.first),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: upiController,
              decoration: InputDecoration(
                labelText: payoutMethod == 'upi'
                    ? 'UPI ID (e.g. name@upi)'
                    : 'PayPal Email',
                filled: true,
                fillColor: isDark
                    ? AppColors.surfaceDark
                    : AppColors.inputBgLight,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: onToggleForm,
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => onRequestPayout(pending),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                    ),
                    child:
                        Text('Withdraw ₹${pending.toStringAsFixed(0)}'),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

// ─── Payout History ───────────────────────────────────────────────
class _PayoutHistory extends StatelessWidget {
  final List<PayoutRecord> history;
  final bool isDark;
  const _PayoutHistory({required this.history, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return _Card(
      isDark: isDark,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _SectionTitle('Payout History', isDark: isDark),
          const SizedBox(height: 8),
          ...history.take(5).map((p) => ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(
                  p.method == 'upi' ? Icons.phone_android : Icons.paypal,
                  color: AppColors.primary,
                ),
                title: Text(
                  '₹${p.amount.toStringAsFixed(2)}',
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
                subtitle:
                    Text(p.method.toUpperCase()),
                trailing: _StatusChip(p.status),
              )),
        ],
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String status;
  const _StatusChip(this.status);

  @override
  Widget build(BuildContext context) {
    final color = status == 'paid'
        ? Colors.green
        : status == 'processing'
            ? Colors.orange
            : Colors.grey;
    return Chip(
      label: Text(status.toUpperCase(),
          style: const TextStyle(fontSize: 10, color: Colors.white)),
      backgroundColor: color,
      padding: EdgeInsets.zero,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );
  }
}

// ─── Shared Helper Widgets ────────────────────────────────────────
class _Card extends StatelessWidget {
  final bool isDark;
  final Widget child;
  const _Card({required this.isDark, required this.child});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: child,
      );
}

class _SectionTitle extends StatelessWidget {
  final String text;
  final bool isDark;
  const _SectionTitle(this.text, {required this.isDark});

  @override
  Widget build(BuildContext context) => Text(
        text,
        style: TextStyle(
          fontWeight: FontWeight.w900,
          fontSize: 15,
          color: isDark
              ? AppColors.textPrimaryDark
              : AppColors.textPrimaryLight,
        ),
      );
}

class _EarningsTile extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  final bool isDark;
  const _EarningsTile({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) => Column(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 4),
          Text(value,
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 16,
                color: isDark
                    ? AppColors.textPrimaryDark
                    : AppColors.textPrimaryLight,
              )),
          Text(label,
              style: TextStyle(
                fontSize: 10,
                color: isDark
                    ? AppColors.textSecondaryDark
                    : AppColors.textSecondaryLight,
              )),
        ],
      );
}

class _StatTile extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final bool isDark;
  const _StatTile(this.label, this.value, this.icon, this.isDark);

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isDark ? AppColors.surfaceDark : AppColors.inputBgLight,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Icon(icon, size: 18, color: AppColors.primary),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(value,
                      style: const TextStyle(
                          fontWeight: FontWeight.w900, fontSize: 14)),
                  Text(label,
                      style: const TextStyle(fontSize: 10),
                      overflow: TextOverflow.ellipsis),
                ],
              ),
            ),
          ],
        ),
      );
}

class _MessageBanner extends StatelessWidget {
  final String text;
  final bool isError;
  const _MessageBanner(this.text, {this.isError = false});

  @override
  Widget build(BuildContext context) => Container(
        margin: const EdgeInsets.only(top: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isError
              ? Colors.red.withValues(alpha: 0.1)
              : Colors.green.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isError ? Colors.red : Colors.green,
          ),
        ),
        child: Text(
          text,
          style: TextStyle(color: isError ? Colors.red : Colors.green),
        ),
      );
}
