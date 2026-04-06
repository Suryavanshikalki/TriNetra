import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTICS
import '../../../core/constants/app_colors.dart';
import '../../../core/services/logrocket_service.dart'; // 🔥 ASLI TRACKING
import '../widgets/pwa_install_banner.dart';

// ==============================================================
// 👁️🔥 TRINETRA iOS PWA INSTALLER (Blueprint Point 1)
// 100% REAL: Strict iOS Web Only, Safari Focus, LogRocket
// ==============================================================

class PwaInstallScreen extends StatefulWidget {
  const PwaInstallScreen({super.key});

  @override
  State<PwaInstallScreen> createState() => _PwaInstallScreenState();
}

class _PwaInstallScreenState extends State<PwaInstallScreen> {
  @override
  void initState() {
    super.initState();
    // 🔥 ASLI ACTION: Track only iOS Web Users interested in installing
    if (kIsWeb && defaultTargetPlatform == TargetPlatform.iOS) {
      LogRocketService.instance.track('iOS_PWA_Install_Screen_Opened', properties: {
        'platform': 'iOS_Web',
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // 🛡️ ASLI RULE: Render ONLY on Web AND ONLY on iOS.
    // बाकी किसी भी डिवाइस (Android Web, Windows Web, Native) पर यह नहीं दिखेगा।
    if (!kIsWeb || defaultTargetPlatform != TargetPlatform.iOS) {
      return const SizedBox.shrink();
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: isDark ? AppColors.cardDark : Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () {
            HapticFeedback.selectionClick(); // 🔥 Premium Feel
            Navigator.maybePop(context);
          },
        ),
        title: Text(
          'Install on iPhone',
          style: TextStyle(
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            fontSize: 17,
            fontWeight: FontWeight.w900,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),

            // ─── Hero Card (TriNetra Apple Branding) ──────────────────────
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
                    color: AppColors.primary.withOpacity(0.3), // 🔥 FIXED FOR STABILITY
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
                        '👁️', // 🔥 TriNetra Logo
                        style: TextStyle(fontSize: 40),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'TriNetra for iOS',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Bypass the App Store. Install directly on your iPhone.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // ─── Benefits ──────────────────────────────────
            Text(
              'Why Install on iPhone?',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 18,
                color: isDark ? Colors.white : Colors.black87,
              ),
            ),
            const SizedBox(height: 16),

            _BenefitTile(
              icon: Icons.speed_outlined,
              title: 'Native iOS Feel',
              subtitle: 'Runs smoothly like a downloaded App Store app',
              isDark: isDark,
            ),
            _BenefitTile(
              icon: Icons.fullscreen_outlined,
              title: 'No Safari Bars',
              subtitle: 'Enjoy TriNetra in pure Full-Screen mode',
              isDark: isDark,
            ),
            _BenefitTile(
              icon: Icons.notifications_active_outlined,
              title: 'iOS Push Notifications',
              subtitle: 'Get message and feed alerts directly on your lock screen',
              isDark: isDark,
            ),

            const SizedBox(height: 32),

            // ─── Install Banner ────────────────────────────
            const PwaInstallBanner(),

            const SizedBox(height: 24),

            // ─── iOS Specific Manual Instructions ──────────
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
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isDark ? AppColors.dividerDark : Colors.grey.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: AppColors.primary, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 15,
                    color: isDark ? Colors.white : Colors.black87,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
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

// ─── Strict iOS Manual Instructions ───────────────────────────────
class _ManualInstructions extends StatelessWidget {
  final bool isDark;
  const _ManualInstructions({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : const Color(0xFFF8F9FA),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.apple, size: 20, color: Colors.grey),
              const SizedBox(width: 10),
              Text(
                'How to install on iPhone/iPad',
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 14,
                  color: isDark ? Colors.white : Colors.black87,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _Step('Step 1', 'Open TriNetra in the Safari browser', isDark: isDark),
          _Step('Step 2', 'Tap the Share button ⍐ at the bottom of the screen', isDark: isDark),
          _Step('Step 3', 'Scroll down and tap "Add to Home Screen" ➕', isDark: isDark),
          _Step('Step 4', 'Tap "Add" in the top right corner', isDark: isDark),
        ],
      ),
    );
  }
}

class _Step extends StatelessWidget {
  final String stepNumber;
  final String instruction;
  final bool isDark;
  const _Step(this.stepNumber, this.instruction, {required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: '$stepNumber: ',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 13,
                color: isDark ? AppColors.textPrimaryDark : AppColors.primary,
              ),
            ),
            TextSpan(
              text: instruction,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
