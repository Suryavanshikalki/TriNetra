import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTICS
import '../../../core/constants/app_colors.dart';
import '../../../core/services/logrocket_service.dart'; // 🔥 ASLI TRACKING
import '../pwa_helper.dart';

// ==============================================================
// 👁️🔥 TRINETRA iOS PWA BANNER (Blueprint Point 1)
// 100% REAL: Strict iOS Web Only, Haptics, LogRocket, TriNetra Logo
// ==============================================================

class PwaInstallBanner extends StatefulWidget {
  final bool dismissible;

  const PwaInstallBanner({
    super.key,
    this.dismissible = true,
  });

  @override
  State<PwaInstallBanner> createState() => _PwaInstallBannerState();
}

class _PwaInstallBannerState extends State<PwaInstallBanner>
    with SingleTickerProviderStateMixin {
  bool _visible = true;
  bool _installing = false;
  late AnimationController _animController;
  late Animation<double> _slideAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _slideAnim = Tween<double>(begin: 80.0, end: 0.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOut),
    );
    
    // 🛡️ सिर्फ iOS वेब पर ही बैनर का एनीमेशन चालू होगा
    if (kIsWeb && defaultTargetPlatform == TargetPlatform.iOS) {
      _animController.forward();
      LogRocketService.instance.track('iOS_PWA_Banner_Displayed');
    }
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  Future<void> _install() async {
    HapticFeedback.heavyImpact(); // 🔥 Premium Button Feel
    LogRocketService.instance.track('iOS_PWA_Install_Clicked');
    
    setState(() => _installing = true);
    
    // 🍏 iOS Safari PWA Prompt Trigger / Helper
    await PwaHelper.instance.triggerInstallPrompt();
    
    if (mounted) setState(() => _installing = false);
  }

  void _dismiss() {
    HapticFeedback.selectionClick();
    LogRocketService.instance.track('iOS_PWA_Banner_Dismissed');
    
    _animController.reverse().then((_) {
      if (mounted) setState(() => _visible = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    // 🛡️ ASLI RULE: Render ONLY on Web AND ONLY on iOS.
    if (!kIsWeb || defaultTargetPlatform != TargetPlatform.iOS || !_visible) {
      return const SizedBox.shrink();
    }

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return AnimatedBuilder(
      animation: _slideAnim,
      builder: (_, child) {
        return Transform.translate(
          offset: Offset(0, _slideAnim.value),
          child: child,
        );
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? AppColors.cardDark : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: AppColors.primary.withOpacity(0.3), // 🔥 FIXED STABILITY
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.08),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            // ─── TriNetra Branding Icon ─────────────────────────
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1877F2), Color(0xFF0D5FCC)],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: Text(
                  '👁️', // 🔥 ASLI TRINETRA LOGO
                  style: TextStyle(fontSize: 22),
                ),
              ),
            ),
            const SizedBox(width: 12),

            // ─── Text (iOS Targeted) ───────────────────────────
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Install TriNetra iOS',
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 14,
                      color: isDark ? Colors.white : Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Add to iPhone Home Screen',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),

            // ─── Install Button ────────────────────────────────
            ElevatedButton(
              onPressed: _installing ? null : _install,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                minimumSize: const Size(0, 36),
                padding: const EdgeInsets.symmetric(horizontal: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                elevation: 0, // Flat premium look
              ),
              child: _installing
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text(
                      'Install',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                    ),
            ),

            // ─── Dismiss Button ────────────────────────────────
            if (widget.dismissible) ...[
              const SizedBox(width: 4),
              IconButton(
                icon: Icon(
                  Icons.close,
                  size: 18,
                  color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                ),
                onPressed: _dismiss,
                constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                padding: EdgeInsets.zero,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
