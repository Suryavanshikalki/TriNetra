import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/constants/app_colors.dart';

/// SmartDownloadSection — Web-only adaptive download / install widget.
///
/// • Returns [SizedBox.shrink] on all native platforms — never shown in APK/IPA.
/// • Detects the underlying OS via [defaultTargetPlatform] and renders
///   the correct download card or iOS PWA instructions.
/// • Uses [url_launcher] to open download links.
class SmartDownloadSection extends StatelessWidget {
  const SmartDownloadSection({super.key});

  // ─── Download links ────────────────────────────────────────────
  /// Android APK served from Firebase Hosting /downloads/ folder.
  static const _androidUrl =
      'https://trinetra-8b846.web.app/downloads/trinetra_latest.apk';

  /// Desktop builds — GitHub Releases (set to '' until artifacts are published).
  static const _windowsUrl = '';
  static const _macUrl     = '';
  static const _linuxUrl   = '';

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
      // ── iOS: PWA instructions, no download link ─────────────────
      case TargetPlatform.iOS:
        return _IosPwaCard(isDark: isDark);

      // ── Android: APK download ────────────────────────────────────
      case TargetPlatform.android:
        return _DownloadCard(
          isDark: isDark,
          icon: Icons.android,
          iconColor: const Color(0xFF3DDC84),
          label: 'Download App',
          sublabel: 'Android APK — Direct install',
          url: _androidUrl,
          gradient: const [Color(0xFF3DDC84), Color(0xFF00A86B)],
          badge: null,
        );

      // ── Windows ──────────────────────────────────────────────────
      case TargetPlatform.windows:
        return _DownloadCard(
          isDark: isDark,
          icon: Icons.window,
          iconColor: const Color(0xFF00ADEF),
          label: 'Download for Windows',
          sublabel: 'Windows 10 / 11 — 64-bit',
          url: _windowsUrl,
          gradient: const [Color(0xFF00ADEF), Color(0xFF0067B8)],
          badge: 'Coming Soon',
        );

      // ── macOS ────────────────────────────────────────────────────
      case TargetPlatform.macOS:
        return _DownloadCard(
          isDark: isDark,
          icon: Icons.apple,
          iconColor: Colors.white,
          label: 'Download for Mac',
          sublabel: 'macOS 11+ — Universal binary',
          url: _macUrl,
          gradient: const [Color(0xFF555555), Color(0xFF1C1C1E)],
          badge: 'Coming Soon',
        );

      // ── Linux ────────────────────────────────────────────────────
      case TargetPlatform.linux:
        return _DownloadCard(
          isDark: isDark,
          icon: Icons.terminal,
          iconColor: const Color(0xFFF7C948),
          label: 'Download for Linux',
          sublabel: '.tar.gz — 64-bit',
          url: _linuxUrl,
          gradient: const [Color(0xFFE95420), Color(0xFFBF360C)],
          badge: 'Coming Soon',
        );

      // ── Fallback ─────────────────────────────────────────────────
      default:
        return _DownloadCard(
          isDark: isDark,
          icon: Icons.download_rounded,
          iconColor: Colors.white,
          label: 'Download App',
          sublabel: 'Get the native app for your device',
          url: _androidUrl,
          gradient: const [Color(0xFF1877F2), Color(0xFF0D5FCC)],
          badge: null,
        );
    }
  }
}

// ─── Download Card ─────────────────────────────────────────────────
class _DownloadCard extends StatefulWidget {
  final bool isDark;
  final IconData icon;
  final Color iconColor;
  final String label;
  final String sublabel;
  final String url;         // empty string == not yet available
  final List<Color> gradient;
  final String? badge;      // null = no badge; 'Coming Soon' / 'Beta'

  const _DownloadCard({
    required this.isDark,
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.sublabel,
    required this.url,
    required this.gradient,
    required this.badge,
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

  bool get _isAvailable => widget.url.isNotEmpty;

  Future<void> _launch() async {
    if (!_isAvailable) {
      _showComingSoon();
      return;
    }
    final uri = Uri.parse(widget.url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      _showComingSoon();
    }
  }

  void _showComingSoon() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('This download will be available soon!'),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _ctrl.forward(),
      onTapUp: (_) async {
        await _ctrl.reverse();
        _launch();
      },
      onTapCancel: () => _ctrl.reverse(),
      child: ScaleTransition(
        scale: _scale,
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            // ── Main card ───────────────────────────────────
            AnimatedOpacity(
              duration: const Duration(milliseconds: 200),
              opacity: _isAvailable ? 1.0 : 0.75,
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
                      color:
                          widget.gradient.first.withValues(alpha: 0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                padding: const EdgeInsets.symmetric(
                    horizontal: 20, vertical: 18),
                child: Row(
                  children: [
                    // Icon bubble
                    Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.18),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(widget.icon,
                          color: widget.iconColor, size: 28),
                    ),
                    const SizedBox(width: 16),

                    // Labels
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.label,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            widget.sublabel,
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Action icon
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        _isAvailable
                            ? Icons.arrow_downward_rounded
                            : Icons.lock_outline_rounded,
                        color: Colors.white,
                        size: 18,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── Badge (top-right) ────────────────────────────
            if (widget.badge != null)
              Positioned(
                top: -8,
                right: 10,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: widget.badge == 'Beta'
                        ? const Color(0xFFFF9800)
                        : const Color(0xFF616161),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Text(
                    widget.badge!,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ─── iOS PWA Instruction Card ──────────────────────────────────────
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
          color: AppColors.primary.withValues(alpha: 0.25),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
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
                    colors: [Color(0xFF555555), Color(0xFF1C1C1E)],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.apple, color: Colors.white, size: 26),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Install on iPhone / iPad',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                    Text(
                      'Add TriNetra to your Home Screen',
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
          const SizedBox(height: 14),
          Divider(
            color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
            height: 1,
          ),
          const SizedBox(height: 14),
          _Step(number: '1', isDark: isDark, icon: Icons.ios_share,
              text: "Tap the Share icon at the bottom of Safari."),
          const SizedBox(height: 10),
          _Step(number: '2', isDark: isDark, icon: Icons.add_box_outlined,
              text: "Scroll down and tap 'Add to Home Screen'."),
          const SizedBox(height: 10),
          _Step(number: '3', isDark: isDark, icon: Icons.check_circle_outline,
              text:
                  "Tap 'Add'. TriNetra is now installed as a native-feeling app."),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const Icon(Icons.lightbulb_outline,
                    color: AppColors.primary, size: 16),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Use Safari for the best PWA experience on iOS.',
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
          ),
        ],
      ),
    );
  }
}

// ─── Numbered step row ─────────────────────────────────────────────
class _Step extends StatelessWidget {
  final String number;
  final IconData icon;
  final String text;
  final bool isDark;

  const _Step({
    required this.number,
    required this.icon,
    required this.text,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 26,
          height: 26,
          decoration: const BoxDecoration(
            color: AppColors.primary,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(number,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w800)),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text(
              text,
              style: TextStyle(
                fontSize: 13,
                height: 1.4,
                color: isDark
                    ? AppColors.textPrimaryDark
                    : AppColors.textPrimaryLight,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
