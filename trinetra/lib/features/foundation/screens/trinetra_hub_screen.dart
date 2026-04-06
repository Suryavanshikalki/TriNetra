import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart'; // 🔥 ASLI DIRECT FILE DOWNLOAD ENGINE

// 🔥 ASLI OTA (AUTO-UPDATE) ENGINE FOR ALL 6 PLATFORMS
import 'package:shorebird_code_push/shorebird_code_push.dart'; 

import '../../../core/constants/app_colors.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../../core/services/sentry_service.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER FOUNDATION (Blueprint Point 1)
// 100% REAL: 2-Sec Splash, Auto-Detect OS, Direct Download, OTA Updates
// ==============================================================

class TriNetraHubScreen extends ConsumerStatefulWidget {
  const TriNetraHubScreen({super.key});

  @override
  ConsumerState<TriNetraHubScreen> createState() => _TriNetraHubScreenState();
}

class _TriNetraHubScreenState extends ConsumerState<TriNetraHubScreen> with SingleTickerProviderStateMixin {
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;
  
  // Asli Shorebird OTA Engine
  final _shorebirdCodePush = ShorebirdCodePush();
  bool _isCheckingForUpdates = true;
  bool _showWebHub = false; // 🔥 Smooth Transition Logic

  @override
  void initState() {
    super.initState();
    SentryService.instance.addBreadcrumb('TriNetra Foundation Hub Loaded');

    _fadeController = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(CurvedAnimation(parent: _fadeController, curve: Curves.easeIn));

    _startFoundationSequence();
  }

  Future<void> _startFoundationSequence() async {
    _fadeController.forward();

    // 1. 🔥 OTA AUTO-UPDATE CHECK IN BACKGROUND (Point 1 Blueprint)
    try {
      final isUpdateAvailable = await _shorebirdCodePush.isNewPatchAvailableForDownload();
      if (isUpdateAvailable) {
        await _shorebirdCodePush.downloadUpdateIfAvailable();
        // Background me update ho jayega bina user ko pareshan kiye
      }
    } catch (e) {
      // Ignore update errors and proceed, track in Sentry silently
      SentryService.instance.captureMessage('OTA Update Check Failed: $e');
    }

    // 2. 🔥 EXACTLY 2 SECONDS SPLASH LOCK (Point 1 Blueprint)
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    // 3. Routing Logic (Gatekeeper Check)
    final authStatus = ref.read(authControllerProvider).status;
    
    // Agar Web par hai, toh UI wahi rahega aur "Download Hub" smoothly dikhega
    // Agar App me hai aur logged in hai, toh Home jayega. Nahi toh Login (Gatekeeper) par.
    if (!kIsWeb) {
      if (authStatus == AuthStatus.authenticated) {
        context.go('/home');
      } else {
        context.go('/login');
      }
    } else {
      setState(() {
        _isCheckingForUpdates = false;
        _showWebHub = true;
      });
    }
  }

  // 🔥 DIRECT FILE DOWNLOAD LOGIC (NO APP STORE!)
  Future<void> _downloadDirectFile(String fileUrl) async {
    final Uri url = Uri.parse(fileUrl);
    if (await canLaunchUrl(url)) {
      // Direct Storage Download Trigger
      await launchUrl(url, mode: LaunchMode.externalApplication);
      SentryService.instance.addBreadcrumb('Direct File Downloaded: $fileUrl');
    } else {
      SentryService.instance.captureMessage('Failed to download direct file: $fileUrl');
    }
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // 🔥 AUTO-DETECT OS LOGIC
    final currentOS = defaultTargetPlatform;
    final isWindows = currentOS == TargetPlatform.windows;
    final isMac = currentOS == TargetPlatform.macOS;
    final isLinux = currentOS == TargetPlatform.linux;
    final isAndroid = currentOS == TargetPlatform.android;
    final isIOS = currentOS == TargetPlatform.iOS;

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      body: Stack(
        children: [
          // ─── BACKGROUND GLOW ───
          Center(
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(color: AppColors.primary.withOpacity(0.05), blurRadius: 100, spreadRadius: 50),
                ],
              ),
            ),
          ),

          // ─── MAIN CONTENT ───
          Center(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: SingleChildScrollView( // 🔥 Prevent layout overflow
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // 🔥 ASLI UNIVERSAL LOGO (Designed by AI via Canvas)
                    const _TriNetraUniversalLogo(),
                    
                    const SizedBox(height: 24),
                    
                    const Text(
                      'TriNetra',
                      style: TextStyle(
                        fontSize: 42,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2.0,
                        color: AppColors.primary,
                      ),
                    ),
                    
                    const SizedBox(height: 8),
                    
                    Text(
                      'The Ultimate Super App',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.0,
                        color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                      ),
                    ),

                    // 🔥 WEB EXCLUSIVE DOWNLOAD HUB (Point 1 Blueprint)
                    AnimatedSize(
                      duration: const Duration(milliseconds: 600),
                      curve: Curves.easeOutQuart,
                      child: _showWebHub ? Padding(
                        padding: const EdgeInsets.only(top: 40, bottom: 40),
                        child: AnimatedOpacity(
                          opacity: _showWebHub ? 1.0 : 0.0,
                          duration: const Duration(milliseconds: 600),
                          child: Container(
                            padding: const EdgeInsets.all(24),
                            constraints: const BoxConstraints(maxWidth: 400),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.cardDark : AppColors.cardLight,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                              boxShadow: [
                                BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 20, offset: const Offset(0, 10)),
                              ],
                            ),
                            child: Column(
                              children: [
                                Text(
                                  'Download TriNetra For Your Device',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: isDark ? Colors.white : Colors.black,
                                  ),
                                ),
                                const SizedBox(height: 20),
                                
                                // 📱 DIRECT APK DOWNLOAD (Highlighted if Android)
                                _DownloadBtn(
                                  icon: Icons.android, 
                                  title: 'Download .APK File', 
                                  isHighlighted: isAndroid,
                                  onTap: () => _downloadDirectFile('https://trinetra-master.awsapps.com/downloads/TriNetra.apk'),
                                ),
                                
                                // 🍏 iOS PWA LOGIC (Highlighted if iOS)
                                _DownloadBtn(
                                  icon: Icons.apple, 
                                  title: 'Install iOS PWA', 
                                  isHighlighted: isIOS,
                                  onTap: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Tap Share -> "Add to Home Screen" on your iPhone Safari Browser'))
                                    );
                                  },
                                ),
                                
                                // 💻 DIRECT EXE DOWNLOAD (Highlighted if Windows)
                                _DownloadBtn(
                                  icon: Icons.window, 
                                  title: 'Download .EXE File', 
                                  isHighlighted: isWindows,
                                  onTap: () => _downloadDirectFile('https://trinetra-master.awsapps.com/downloads/TriNetra_Setup.exe'),
                                ),
                                
                                // 🍎 DIRECT DMG DOWNLOAD (Highlighted if Mac)
                                _DownloadBtn(
                                  icon: Icons.desktop_mac, 
                                  title: 'Download .DMG File', 
                                  isHighlighted: isMac,
                                  onTap: () => _downloadDirectFile('https://trinetra-master.awsapps.com/downloads/TriNetra_Mac.dmg'),
                                ),
                                
                                // 🐧 DIRECT APPIMAGE DOWNLOAD (Highlighted if Linux)
                                _DownloadBtn(
                                  icon: Icons.terminal, 
                                  title: 'Download .AppImage', 
                                  isHighlighted: isLinux,
                                  onTap: () => _downloadDirectFile('https://trinetra-master.awsapps.com/downloads/TriNetra.AppImage'),
                                ),

                                const SizedBox(height: 20),
                                const Divider(),
                                const SizedBox(height: 10),

                                // 🔥 CONTINUE TO WEB APP BUTTON
                                TextButton.icon(
                                  onPressed: () {
                                    final authStatus = ref.read(authControllerProvider).status;
                                    if (authStatus == AuthStatus.authenticated) {
                                      context.go('/home');
                                    } else {
                                      context.go('/login');
                                    }
                                  },
                                  icon: const Icon(Icons.language, color: AppColors.primary),
                                  label: const Text('Continue to Web Version', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                                )
                              ],
                            ),
                          ),
                        ),
                      ) : const SizedBox(height: 0),
                    )
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── 👁️🔥 THE UNIVERSAL TRINETRA LOGO (Custom Built) ─────────────
class _TriNetraUniversalLogo extends StatelessWidget {
  const _TriNetraUniversalLogo();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 120,
      height: 120,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1877F2), Color(0xFF0D5FCC)], 
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.4),
            blurRadius: 30,
            spreadRadius: 5,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Center(
        child: SizedBox(
          width: 70,
          height: 70,
          child: CustomPaint(painter: _UltimateTriNetraPainter()),
        ),
      ),
    );
  }
}

class _UltimateTriNetraPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final strokePaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round;

    final fillPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final cx = size.width / 2;
    final cy = size.height / 2;

    // 1. The Infinity / Network Loop (Tech Foundation)
    final outerPath = Path()
      ..moveTo(cx - 30, cy)
      ..quadraticBezierTo(cx, cy - 25, cx + 30, cy)
      ..quadraticBezierTo(cx, cy + 25, cx - 30, cy);
    canvas.drawPath(outerPath, strokePaint);

    // 2. The Core AI Eye (Center)
    final innerPath = Path()
      ..moveTo(cx - 15, cy)
      ..quadraticBezierTo(cx, cy - 12, cx + 15, cy)
      ..quadraticBezierTo(cx, cy + 12, cx - 15, cy);
    canvas.drawPath(innerPath, strokePaint..strokeWidth = 2.0);

    // 3. The Vision Pupil
    canvas.drawCircle(Offset(cx, cy), 6, fillPaint);

    // 4. The "Third Eye" / Cloud Uplink (Top Dot)
    canvas.drawCircle(Offset(cx, cy - 24), 4, fillPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// ─── 📲 AUTO-DETECT DOWNLOAD BUTTON WIDGET ──────────────────────
class _DownloadBtn extends StatelessWidget {
  final IconData icon;
  final String title;
  final bool isHighlighted;
  final VoidCallback onTap;

  const _DownloadBtn({
    required this.icon,
    required this.title,
    required this.isHighlighted,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Container(
          decoration: BoxDecoration(
            color: isHighlighted ? AppColors.primary : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isHighlighted ? AppColors.primary : Colors.grey.withOpacity(0.3),
              width: isHighlighted ? 2 : 1,
            ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Icon(icon, color: isHighlighted ? Colors.white : Colors.grey, size: 24),
              const SizedBox(width: 16),
              Text(
                title,
                style: TextStyle(
                  color: isHighlighted ? Colors.white : Colors.grey.shade600,
                  fontWeight: isHighlighted ? FontWeight.bold : FontWeight.w600,
                  fontSize: 15,
                ),
              ),
              const Spacer(),
              if (isHighlighted)
                const Icon(Icons.star, color: Colors.amber, size: 18), 
            ],
          ),
        ),
      ),
    );
  }
}
