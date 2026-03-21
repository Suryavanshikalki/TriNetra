import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/constants/app_colors.dart';

/// Shown ONLY on the web build (kIsWeb == true).
/// Returns SizedBox.shrink() instantly on all native apps.
/// Detects iOS browsers and shows PWA instructions instead of APK/EXE links.
class DownloadAppSection extends StatelessWidget {
  const DownloadAppSection({super.key});

  // Files are served from Firebase Hosting at /downloads/
  static const _apkUrl = '/downloads/TriNetra.apk';
  static const _winUrl = '/downloads/TriNetra-Windows.zip';
  static const _debUrl = '/downloads/TriNetra.deb';
  static const _dmgUrl = '/downloads/TriNetra.dmg';

  @override
  Widget build(BuildContext context) {
    // Completely invisible on native (Android / iOS / macOS / Windows / Linux) apps
    if (!kIsWeb) return const SizedBox.shrink();

    final isDark = Theme.of(context).brightness == Brightness.dark;
    // Flutter web correctly reports TargetPlatform.iOS for Safari on iPhone/iPad
    final isIOSBrowser = defaultTargetPlatform == TargetPlatform.iOS;

    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : const Color(0xFFF0F7FF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.primary.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.download_rounded,
                    color: AppColors.primary, size: 20),
              ),
              const SizedBox(width: 12),
              Text(
                'Get the Native App',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: isDark
                      ? AppColors.textPrimaryDark
                      : AppColors.textPrimaryLight,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // iOS: show PWA "Add to Home Screen" instructions
          if (isIOSBrowser) ...[
            _IOSPwaCard(isDark: isDark),
          ] else ...[
            // All other platforms: show download buttons
            _DownloadButton(
              label: 'Android',
              sublabel: 'APK  · v1.0',
              icon: Icons.android,
              color: const Color(0xFF3DDC84),
              url: _apkUrl,
              isDark: isDark,
            ),
            const SizedBox(height: 8),
            _DownloadButton(
              label: 'Windows',
              sublabel: 'EXE · v1.0',
              icon: Icons.desktop_windows_outlined,
              color: const Color(0xFF0078D4),
              url: _winUrl,
              isDark: isDark,
            ),
            const SizedBox(height: 8),
            _DownloadButton(
              label: 'Linux',
              sublabel: 'DEB · v1.0',
              icon: Icons.laptop_outlined,
              color: const Color(0xFFF57900),
              url: _debUrl,
              isDark: isDark,
            ),
            const SizedBox(height: 8),
            _DownloadButton(
              label: 'macOS',
              sublabel: 'DMG · v1.0',
              icon: Icons.laptop_mac_outlined,
              color: const Color(0xFF888888),
              url: _dmgUrl,
              isDark: isDark,
            ),
          ],
        ],
      ),
    );
  }
}

// ─── Single Download Button ───────────────────────────────────────
class _DownloadButton extends StatelessWidget {
  final String label;
  final String sublabel;
  final IconData icon;
  final Color color;
  final String url;
  final bool isDark;

  const _DownloadButton({
    required this.label,
    required this.sublabel,
    required this.icon,
    required this.color,
    required this.url,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () async {
        final uri = Uri.parse(url);
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri);
        }
      },
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
        decoration: BoxDecoration(
          color: isDark ? AppColors.surfaceDark : Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, size: 18, color: color),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: isDark
                          ? AppColors.textPrimaryDark
                          : AppColors.textPrimaryLight,
                    ),
                  ),
                  Text(
                    sublabel,
                    style: TextStyle(
                      fontSize: 11,
                      color: isDark
                          ? AppColors.textSecondaryDark
                          : AppColors.textSecondaryLight,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.download_outlined,
              size: 18,
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

// ─── iOS PWA Instructions ─────────────────────────────────────────
class _IOSPwaCard extends StatelessWidget {
  final bool isDark;
  const _IOSPwaCard({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? AppColors.surfaceDark : Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.ios_share, size: 18, color: AppColors.primary),
              const SizedBox(width: 8),
              Text(
                'Install on iPhone / iPad',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: isDark
                      ? AppColors.textPrimaryDark
                      : AppColors.textPrimaryLight,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          _Step(
              number: '1',
              text: 'Tap the Share button at the bottom of Safari',
              isDark: isDark),
          _Step(
              number: '2',
              text: "Scroll down and tap 'Add to Home Screen'",
              isDark: isDark),
          _Step(
              number: '3',
              text: "Tap 'Add' — TriNetra will appear as a full-screen app",
              isDark: isDark),
        ],
      ),
    );
  }
}

class _Step extends StatelessWidget {
  final String number;
  final String text;
  final bool isDark;
  const _Step(
      {required this.number, required this.text, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 20,
            height: 20,
            margin: const EdgeInsets.only(top: 1, right: 10),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                number,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
            ),
          ),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 12,
                color: isDark
                    ? AppColors.textSecondaryDark
                    : AppColors.textSecondaryLight,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
