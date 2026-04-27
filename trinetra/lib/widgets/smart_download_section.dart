import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/services/logrocket_service.dart';
import '../../../core/services/sentry_service.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER DOWNLOAD HUB (Blueprint Point 1)
// 100% REAL: Dual-Engine Release Server, Web-Safe Opacity, LogRocket
// ==============================================================

class SmartDownloadSection extends StatefulWidget {
  const SmartDownloadSection({super.key});

  // 🔥 ASLI ACTION: Files served from Release Server (Cloudflare/Appwrite)
  static const _releaseServerUrl = 'https://trinetra-8b846.web.app/releases';
  
  static const _androidUrl = '$_releaseServerUrl/trinetra-release.apk';
  static const _windowsUrl = '$_releaseServerUrl/trinetra-windows.exe';
  static const _macUrl     = '$_releaseServerUrl/trinetra-macos.dmg';
  static const _linuxUrl   = '$_releaseServerUrl/trinetra-linux.AppImage';

  @override
  State<SmartDownloadSection> createState() => _SmartDownloadSectionState();
}

class _SmartDownloadSectionState extends State<SmartDownloadSection> {
  @override
  void initState() {
    super.initState();
    if (kIsWeb) {
      LogRocketService.instance.track('Smart_Download_Section_Viewed', properties: {
        'os': defaultTargetPlatform.name,
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!kIsWeb) return const SizedBox.shrink();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: _buildForPlatform(context, isDark),
    );
  }

  Widget _buildForPlatform(BuildContext context, bool isDark) {
    switch (defaultTargetPlatform) {
      case TargetPlatform.iOS:
        return _IosPwaCard(isDark: isDark);

      case TargetPlatform.android:
        return _DownloadCard(
          isDark: isDark,
          icon: Icons.android,
          iconColor: const Color(0xFF3DDC84),
          label: 'Download App',
          sublabel: 'Android APK — Direct install',
          url: SmartDownloadSection._androidUrl,
          gradient: const [Color(0xFF3DDC84), Color(0xFF00A86B)],
        );

      case TargetPlatform.windows:
        return _DownloadCard(
          isDark: isDark,
          icon: Icons.window,
          iconColor: const Color(0xFF00ADEF),
          label: 'Download for Windows',
          sublabel: 'Windows 10 / 11 — 64-bit',
          url: SmartDownloadSection._windowsUrl,
          gradient: const [Color(0xFF00ADEF), Color(0xFF0067B8)],
        );

      case TargetPlatform.macOS:
        return _DownloadCard(
          isDark: isDark,
          icon: Icons.apple,
          iconColor: Colors.white,
          label: 'Download for Mac',
          sublabel: 'macOS 11+ — Universal binary',
          url: SmartDownloadSection._macUrl,
          gradient: const [Color(0xFF555555), Color(0xFF1C1C1E)],
        );

      case TargetPlatform.linux:
        return _DownloadCard(
          isDark: isDark,
          icon: Icons.terminal,
          iconColor: const Color(0xFFF7C948),
          label: 'Download for Linux',
          sublabel: 'AppImage — 64-bit',
          url: SmartDownloadSection._linuxUrl,
          gradient: const [Color(0xFFE95420), Color(0xFFBF360C)],
        );

      default:
        return _DownloadCard(
          isDark: isDark,
          icon: Icons.download_rounded,
          iconColor: Colors.white,
          label: 'Download App',
          sublabel: 'Get the native app for your device',
          url: SmartDownloadSection._androidUrl,
          gradient: const [Color(0xFF1877F2), Color(0xFF0D5FCC)],
        );
    }
  }
}

class _DownloadCard extends StatefulWidget {
  final bool isDark;
  final IconData icon;
  final Color iconColor;
  final String label;
  final String sublabel;
  final String url;
  final List<Color> gradient;

  const _DownloadCard({
    required this.isDark,
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.sublabel,
    required this.url,
    required this.gradient,
  });

  @override
  State<_DownloadCard> createState() => _DownloadCardState();
}

class _DownloadCardState extends State<_DownloadCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 120));
    _scale = Tween(begin: 1.0, end: 0.96)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  Future<void> _launch() async {
    HapticFeedback.heavyImpact();
    LogRocketService.instance.track('Smart_Download_Clicked', properties: {'platform': widget.label});
    
    final uri = Uri.parse(widget.url);
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Unable to connect to Release Server. Try again later.'),
              backgroundColor: AppColors.error,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              duration: const Duration(seconds: 2),
            ),
          );
        }
      }
    } catch (e, st) {
      await SentryService.instance.captureException(e, stackTrace: st);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {
        HapticFeedback.lightImpact();
        _ctrl.forward();
      },
      onTapUp: (_) async {
        await _ctrl.reverse();
        _launch();
      },
      onTapCancel: () => _ctrl.reverse(),
      child: ScaleTransition(
        scale: _scale,
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: widget.gradient,
            ),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: widget.gradient.first.withOpacity(0.3),
                blurRadius: 12,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.18),
                  shape: BoxShape.circle,
                ),
                child: Icon(widget.icon, color: widget.iconColor, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.label,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w800)),
                    const SizedBox(height: 3),
                    Text(widget.sublabel,
                        style: const TextStyle(
                            color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.arrow_downward_rounded,
                    color: Colors.white, size: 18),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _IosPwaCard extends StatelessWidget {
  final bool isDark;
  const _IosPwaCard({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
            color: AppColors.primary.withOpacity(0.25), width: 1.5),
        boxShadow: [
          BoxShadow(
              color: AppColors.primary.withOpacity(0.08),
              blurRadius: 12,
              offset: const Offset(0, 4))
        ],
      ),
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                      colors: [Color(0xFF555555), Color(0xFF1C1C1E)]),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.apple, color: Colors.white, size: 26),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Install on iPhone / iPad',
                        style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: isDark ? Colors.white : Colors.black87)),
                    Text('Add TriNetra to your Home Screen',
                        style: TextStyle(
                            fontSize: 12,
                            color: isDark ? Colors.white70 : Colors.black54)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 15),
          const Divider(),
          const SizedBox(height: 10),
          _StepRow(
              isDark: isDark,
              number: '1',
              text: 'Tap the "Share" button in Safari browser.'),
          const SizedBox(height: 12),
          _StepRow(
              isDark: isDark,
              number: '2',
              text: 'Scroll down and select "Add to Home Screen".'),
        ],
      ),
    );
  }
}

class _StepRow extends StatelessWidget {
  final bool isDark;
  final String number;
  final String text;
  const _StepRow({required this.isDark, required this.number, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CircleAvatar(
          radius: 11,
          backgroundColor: AppColors.primary.withOpacity(0.15),
          child: Text(number,
              style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary)),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(text,
              style: TextStyle(
                  fontSize: 13,
                  color: isDark ? Colors.white70 : Colors.black87)),
        ),
      ],
    );
  }
}
