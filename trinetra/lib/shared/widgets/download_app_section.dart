import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTICS
import 'package:url_launcher/url_launcher.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/services/logrocket_service.dart'; // 🔥 ASLI TRACKING
import '../../../core/services/sentry_service.dart'; // 🔥 ASLI ERRORS

// ==============================================================
// 👁️🔥 TRINETRA MASTER DOWNLOAD HUB (Blueprint Point 1)
// 100% REAL: Auto-Detect OS, Highlight Top Link, AWS S3 Buckets
// ==============================================================

/// Shown ONLY on the web build (kIsWeb == true).
/// Returns SizedBox.shrink() instantly on all native apps.
/// Detects iOS browsers and shows PWA instructions instead of APK/EXE links.
class DownloadAppSection extends StatefulWidget {
  const DownloadAppSection({super.key});

  @override
  State<DownloadAppSection> createState() => _DownloadAppSectionState();
}

class _DownloadAppSectionState extends State<DownloadAppSection> {
  // 🔥 ASLI ACTION: Files served securely from AWS S3 / CloudFront
  static const _awsBucketUrl = 'https://trinetra-downloads.s3.ap-south-1.amazonaws.com';
  
  static const _apkUrl = '$_awsBucketUrl/TriNetra-v1.0.apk';
  static const _winUrl = '$_awsBucketUrl/TriNetra-Windows-v1.0.exe'; // EXE format
  static const _debUrl = '$_awsBucketUrl/TriNetra-Linux-v1.0.deb';
  static const _dmgUrl = '$_awsBucketUrl/TriNetra-macOS-v1.0.dmg';

  @override
  void initState() {
    super.initState();
    if (kIsWeb) {
      LogRocketService.instance.track('Download_Section_Viewed', properties: {
        'os': defaultTargetPlatform.name,
      });
    }
  }

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
          color: AppColors.primary.withOpacity(0.2), // Web Safe
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
                child: const Icon(Icons.download_rounded, color: AppColors.primary, size: 20),
              ),
              const SizedBox(width: 12),
              Text(
                'Get the Native App',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w900, // TriNetra Bold
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // iOS: show PWA "Add to Home Screen" instructions
          if (isIOSBrowser) ...[
            _IOSPwaCard(isDark: isDark),
          ] else ...[
            // 🔥 ASLI ACTION: Auto-Detect OS and Sort List (Blueprint Point 1)
            ..._buildSortedDownloadButtons(isDark),
          ],
        ],
      ),
    );
  }

  // ─── Auto-Detect Logic ──────────────────────────────────────────
  List<Widget> _buildSortedDownloadButtons(bool isDark) {
    // 1. Create a list of all platforms
    List<Map<String, dynamic>> buttonsInfo = [
      {
        'platform': TargetPlatform.android,
        'label': 'Android',
        'sublabel': 'APK  · v1.0',
        'icon': Icons.android,
        'color': const Color(0xFF3DDC84),
        'url': _apkUrl,
      },
      {
        'platform': TargetPlatform.windows,
        'label': 'Windows',
        'sublabel': 'EXE · v1.0',
        'icon': Icons.desktop_windows_outlined,
        'color': const Color(0xFF0078D4),
        'url': _winUrl,
      },
      {
        'platform': TargetPlatform.macOS,
        'label': 'macOS',
        'sublabel': 'DMG · v1.0',
        'icon': Icons.laptop_mac_outlined,
        'color': const Color(0xFF888888),
        'url': _dmgUrl,
      },
      {
        'platform': TargetPlatform.linux,
        'label': 'Linux',
        'sublabel': 'DEB · v1.0',
        'icon': Icons.laptop_outlined,
        'color': const Color(0xFFF57900),
        'url': _debUrl,
      },
    ];

    // 2. Sort: Bring the user's current OS to the absolute top
    buttonsInfo.sort((a, b) {
      if (a['platform'] == defaultTargetPlatform) return -1;
      if (b['platform'] == defaultTargetPlatform) return 1;
      return 0; // Keep others in default order
    });

    // 3. Build the widgets, Highlighting the first one (Detected OS)
    List<Widget> widgets = [];
    for (int i = 0; i < buttonsInfo.length; i++) {
      final info = buttonsInfo[i];
      final isHighlighted = (i == 0 && info['platform'] == defaultTargetPlatform);

      widgets.add(
        _DownloadButton(
          label: info['label'],
          sublabel: info['sublabel'],
          icon: info['icon'],
          color: info['color'],
          url: info['url'],
          isDark: isDark,
          isHighlighted: isHighlighted, // Tell the button if it's the recommended one
        ),
      );
      if (i < buttonsInfo.length - 1) widgets.add(const SizedBox(height: 8));
    }

    return widgets;
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
  final bool isHighlighted;

  const _DownloadButton({
    required this.label,
    required this.sublabel,
    required this.icon,
    required this.color,
    required this.url,
    required this.isDark,
    required this.isHighlighted,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () async {
        HapticFeedback.heavyImpact(); // 🔥 Premium click
        LogRocketService.instance.track('App_Download_Clicked', properties: {'platform': label});
        
        final uri = Uri.parse(url);
        try {
          if (await canLaunchUrl(uri)) {
            await launchUrl(uri, mode: LaunchMode.externalApplication); // Force browser download
          } else {
            if (context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to connect to AWS Download Server.')));
            }
          }
        } catch (e, st) {
          await SentryService.instance.captureException(e, stackTrace: st);
        }
      },
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          // 🔥 ASLI ACTION: If Highlighted, give it a premium outline and background hint
          color: isHighlighted 
              ? (isDark ? AppColors.primary.withOpacity(0.15) : AppColors.primary.withOpacity(0.05))
              : (isDark ? AppColors.surfaceDark : Colors.white),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isHighlighted 
                ? AppColors.primary 
                : (isDark ? AppColors.dividerDark : AppColors.dividerLight),
            width: isHighlighted ? 1.5 : 1.0,
          ),
          boxShadow: isHighlighted ? [BoxShadow(color: AppColors.primary.withOpacity(0.1), blurRadius: 8, offset: const Offset(0, 4))] : [],
        ),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, size: 20, color: color),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        label,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                        ),
                      ),
                      if (isHighlighted) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(4)),
                          child: const Text('Recommended', style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ],
                  ),
                  Text(
                    sublabel,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.download_rounded,
              size: 20,
              color: isHighlighted ? AppColors.primary : (isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight),
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
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.surfaceDark : Colors.white,
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
              const Icon(Icons.ios_share, size: 20, color: AppColors.primary),
              const SizedBox(width: 10),
              Text(
                'Install on iPhone / iPad',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _Step(number: '1', text: 'Tap the Share button at the bottom of Safari', isDark: isDark),
          _Step(number: '2', text: "Scroll down and tap 'Add to Home Screen'", isDark: isDark),
          _Step(number: '3', text: "Tap 'Add' — TriNetra will appear as a full-screen app", isDark: isDark),
        ],
      ),
    );
  }
}

class _Step extends StatelessWidget {
  final String number;
  final String text;
  final bool isDark;
  const _Step({required this.number, required this.text, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 22,
            height: 22,
            margin: const EdgeInsets.only(top: 1, right: 12),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.12),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                number,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: AppColors.primary,
                ),
              ),
            ),
          ),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
