import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../widgets/pwa_install_banner.dart';

/// PWA Install Screen — shown when the user wants to install the web app
/// as a native-feeling Progressive Web App on their device.
///
/// Only rendered on web builds (kIsWeb). Returns SizedBox on native.
class PwaInstallScreen extends StatelessWidget {
  const PwaInstallScreen({super.key});

  @override
  Widget build(BuildContext context) {
    if (!kIsWeb) return const SizedBox.shrink();

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: Text(
          'Install TriNetra',
          style: TextStyle(
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            fontSize: 17,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),

            // ─── Hero Card ─────────────────────────────────
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF1877F2), Color(0xFF0D5FCC)],
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: const BoxDecoration(
                      color: Colors.white24,
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Text(
                        'T',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 40,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'TriNetra',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Install for the full native experience',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // ─── Benefits ──────────────────────────────────
            Text(
              'Why Install?',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 17,
                color: isDark ? Colors.white : Colors.black87,
              ),
            ),
            const SizedBox(height: 14),

            _BenefitTile(
              icon: Icons.speed_outlined,
              title: 'Faster Performance',
              subtitle: 'Loads instantly from your home screen',
              isDark: isDark,
            ),
            _BenefitTile(
              icon: Icons.offline_bolt_outlined,
              title: 'Works Offline',
              subtitle: 'Browse cached content without internet',
              isDark: isDark,
            ),
            _BenefitTile(
              icon: Icons.fullscreen_outlined,
              title: 'Full-Screen Experience',
              subtitle: 'No browser bars — just the app',
              isDark: isDark,
            ),
            _BenefitTile(
              icon: Icons.notifications_outlined,
              title: 'Push Notifications',
              subtitle: 'Stay updated with real-time alerts',
              isDark: isDark,
            ),

            const SizedBox(height: 28),

            // ─── Install Banner ────────────────────────────
            const PwaInstallBanner(),

            const SizedBox(height: 20),

            // ─── Manual Instructions ───────────────────────
            _ManualInstructions(isDark: isDark),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

// ─── Benefit Tile ─────────────────────────────────────────────────
class _BenefitTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final bool isDark;

  const _BenefitTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: AppColors.primary, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                    color: isDark ? Colors.white : Colors.black87,
                  ),
                ),
                Text(
                  subtitle,
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
    );
  }
}

// ─── Manual Instructions ──────────────────────────────────────────
class _ManualInstructions extends StatelessWidget {
  final bool isDark;
  const _ManualInstructions({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : const Color(0xFFF8F9FA),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.info_outline,
                  size: 16, color: AppColors.primary),
              const SizedBox(width: 8),
              Text(
                'Manual Install Instructions',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 13,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _Step('Chrome / Edge',
              'Tap the ⋮ menu → "Add to Home Screen" or "Install App"',
              isDark: isDark),
          _Step('Safari (iOS)',
              'Tap the Share button → "Add to Home Screen"',
              isDark: isDark),
          _Step('Firefox',
              'Tap the ⋮ menu → "Install" option',
              isDark: isDark),
        ],
      ),
    );
  }
}

class _Step extends StatelessWidget {
  final String browser;
  final String instruction;
  final bool isDark;
  const _Step(this.browser, this.instruction, {required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: '$browser: ',
              style: TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 12,
                color:
                    isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
              ),
            ),
            TextSpan(
              text: instruction,
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
    );
  }
}
