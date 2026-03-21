import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../feed/screens/feed_screen.dart';
import '../../marketplace/screens/marketplace_screen.dart';
import '../../messenger/screens/messenger_list_screen.dart';
import '../../wallet/screens/wallet_screen.dart';
import '../../referral/screens/referral_screen.dart';
import '../../profile/screens/profile_screen.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../../shared/widgets/bottom_nav.dart';
import '../../../shared/widgets/trinetra_app_bar.dart';
import '../../../core/constants/app_colors.dart';
import '../../../app.dart';

/// Main Home Screen with 5-tab Facebook-style Navigation
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _currentIndex = 0;

  late final List<Widget> _pages = const [
    FeedScreen(),
    MessengerListScreen(),
    MarketplaceScreen(),
    WalletScreen(),
    _MenuScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _currentIndex == 0 ? const TriNetraAppBar() : null,
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: TriNetraBottomNav(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
}

// ─── Coming Soon Placeholder ──────────────────────────────────────
class _PlaceholderPage extends StatelessWidget {
  final IconData icon;
  final String label;
  const _PlaceholderPage({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).brightness == Brightness.dark
            ? AppColors.cardDark
            : Colors.white,
        elevation: 0,
        title: Text(
          label,
          style: TextStyle(
            color: Theme.of(context).brightness == Brightness.dark
                ? Colors.white
                : Colors.black87,
            fontWeight: FontWeight.w900,
          ),
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 64, color: Colors.grey[300]),
            const SizedBox(height: 16),
            Text(
              label,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Coming soon',
              style: TextStyle(fontSize: 14, color: Colors.grey[500]),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Menu / More Screen ───────────────────────────────────────────
class _MenuScreen extends ConsumerWidget {
  const _MenuScreen();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final user = ref.watch(currentUserProvider);
    final displayName =
        user?.displayName ?? user?.phoneNumber ?? 'TriNetra User';
    final initial =
        displayName.isNotEmpty ? displayName[0].toUpperCase() : 'T';

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
        title: Text(
          'Menu',
          style: TextStyle(
            color: isDark ? Colors.white : Colors.black87,
            fontWeight: FontWeight.w900,
            fontSize: 22,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ─── Profile Card ──────────────────────────────
            _ProfileCard(
              displayName: displayName,
              initial: initial,
              isDark: isDark,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ProfileScreen(userId: user?.uid),
                ),
              ),
            ),

            const SizedBox(height: 20),

            // ─── Features ─────────────────────────────────
            _SectionHeader(title: 'Features', isDark: isDark),
            const SizedBox(height: 8),

            _MenuTile(
              icon: Icons.account_balance_wallet_outlined,
              iconColor: AppColors.primary,
              title: 'TriNetra Pay',
              subtitle: 'Wallet, UPI & Transactions',
              isDark: isDark,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const WalletScreen()),
              ),
            ),
            _MenuTile(
              icon: Icons.monetization_on_outlined,
              iconColor: const Color(0xFFFFD700),
              title: 'Refer & Earn',
              subtitle: 'Earn TriNetra Coins',
              isDark: isDark,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const ReferralScreen()),
              ),
            ),
            _MenuTile(
              icon: Icons.messenger_outline,
              iconColor: const Color(0xFF00B0FF),
              title: 'Messenger',
              subtitle: 'Messages & Calls',
              isDark: isDark,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const MessengerListScreen(),
                ),
              ),
            ),
            _MenuTile(
              icon: Icons.person_outline,
              iconColor: AppColors.accent,
              title: 'Profile',
              subtitle: 'View & edit your profile',
              isDark: isDark,
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ProfileScreen(userId: user?.uid),
                ),
              ),
            ),

            const SizedBox(height: 20),

            // ─── Preferences ──────────────────────────────
            _SectionHeader(title: 'Preferences', isDark: isDark),
            const SizedBox(height: 8),

            _MenuTile(
              icon: isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
              iconColor: Colors.orange,
              title: isDark ? 'Light Mode' : 'Dark Mode',
              subtitle: 'Toggle app theme',
              isDark: isDark,
              onTap: () => ref.read(themeModeProvider.notifier).toggle(),
            ),

            const SizedBox(height: 20),

            // ─── Account ──────────────────────────────────
            _SectionHeader(title: 'Account', isDark: isDark),
            const SizedBox(height: 8),

            _MenuTile(
              icon: Icons.logout,
              iconColor: AppColors.error,
              title: 'Log Out',
              subtitle: 'Sign out of TriNetra',
              isDark: isDark,
              onTap: () =>
                  ref.read(authControllerProvider.notifier).signOut(),
            ),

            const SizedBox(height: 32),
            Center(
              child: Text(
                'TriNetra v1.0.0  •  Made with ❤️ in India',
                style: TextStyle(
                  color: isDark
                      ? AppColors.textSecondaryDark
                      : AppColors.textSecondaryLight,
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}

// ─── Profile Card ─────────────────────────────────────────────────
class _ProfileCard extends StatelessWidget {
  final String displayName;
  final String initial;
  final bool isDark;
  final VoidCallback onTap;

  const _ProfileCard({
    required this.displayName,
    required this.initial,
    required this.isDark,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            CircleAvatar(
              radius: 28,
              backgroundColor: AppColors.primary.withValues(alpha: 0.15),
              child: Text(
                initial,
                style: const TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w900,
                  fontSize: 22,
                ),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    displayName,
                    style: TextStyle(
                      color: isDark ? Colors.white : Colors.black87,
                      fontWeight: FontWeight.w700,
                      fontSize: 17,
                    ),
                  ),
                  Text(
                    'View your profile',
                    style: TextStyle(
                      color: isDark
                          ? AppColors.textSecondaryDark
                          : AppColors.textSecondaryLight,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              size: 16,
              color: isDark
                  ? AppColors.textSecondaryDark
                  : AppColors.textSecondaryLight,
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Section Header ───────────────────────────────────────────────
class _SectionHeader extends StatelessWidget {
  final String title;
  final bool isDark;
  const _SectionHeader({required this.title, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: TextStyle(
        fontWeight: FontWeight.w700,
        fontSize: 15,
        color: isDark ? Colors.white : Colors.black87,
      ),
    );
  }
}

// ─── Menu Tile ────────────────────────────────────────────────────
class _MenuTile extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String subtitle;
  final bool isDark;
  final VoidCallback onTap;

  const _MenuTile({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.subtitle,
    required this.isDark,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 3),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        onTap: onTap,
        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: iconColor.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: iconColor, size: 22),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 15,
            color: isDark ? Colors.white : Colors.black87,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(
            fontSize: 12,
            color: isDark
                ? AppColors.textSecondaryDark
                : AppColors.textSecondaryLight,
          ),
        ),
        trailing: Icon(
          Icons.arrow_forward_ios,
          size: 14,
          color: isDark
              ? AppColors.textSecondaryDark
              : AppColors.textSecondaryLight,
        ),
      ),
    );
  }
}
