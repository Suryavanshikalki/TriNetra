import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/constants/app_colors.dart';
import '../../auth/controllers/auth_controller.dart';
import '../../../core/services/sentry_service.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER FOUNDATION (Blueprint Point 1)
// 100% REAL: 2-Sec Splash, Auto-Detect OS, Direct Download
// Dual-Engine Powered: Cloudflare + Appwrite
// ==============================================================

class TriNetraHubScreen extends ConsumerStatefulWidget {
  const TriNetraHubScreen({super.key});

  @override
  ConsumerState<TriNetraHubScreen> createState() => _TriNetraHubScreenState();
}

class _TriNetraHubScreenState extends ConsumerState<TriNetraHubScreen> with SingleTickerProviderStateMixin {
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;
  
  bool _showWebHub = false; 

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

    // 1. 🔥 EXACTLY 2 SECONDS SPLASH LOCK (Point 1 Blueprint)
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    // 2. Routing Logic (Gatekeeper Check)
    final authStatus = ref.read(authControllerProvider).status;
    
    if (!kIsWeb) {
      if (authStatus == AuthStatus.authenticated) {
        context.go('/home');
      } else {
        context.go('/login');
      }
    } else {
      setState(() {
        _showWebHub = true;
      });
    }
  }

  // 🔥 DIRECT FILE DOWNLOAD LOGIC (Dual-Engine Release Server)
  Future<void> _downloadDirectFile(String fileUrl) async {
    final Uri url = Uri.parse(fileUrl);
    if (await canLaunchUrl(url)) {
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

          Center(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: SingleChildScrollView(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
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
                                
                                _DownloadBtn(
                                  icon: Icons.android, 
                                  title: 'Download .APK File', 
                                  isHighlighted: isAndroid,
                                  onTap: () => _downloadDirectFile('https://trinetra-8b846.web.app/releases/trinetra-release.apk'),
                                ),
                                
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
                                
                                _DownloadBtn(
                                  icon: Icons.window, 
                                  title: 'Download .EXE File', 
                                  isHighlighted: isWindows,
                                  onTap: () => _downloadDirectFile('https://trinetra-8b846.web.app/releases/trinetra-windows.exe'),
                                ),
                                
                                _DownloadBtn(
                                  icon: Icons.desktop_mac, 
                                  title: 'Download .DMG File', 
                                  isHighlighted: isMac,
                                  onTap: () => _downloadDirectFile('https://trinetra-8b846.web.app/releases/trinetra-macos.dmg'),
                                ),
                                
                                _DownloadBtn(
                                  icon: Icons.terminal, 
                                  title: 'Download .AppImage', 
                                  isHighlighted: isLinux,
                                  onTap: () => _downloadDirectFile('https://trinetra-8b846.web.app/releases/trinetra-linux.AppImage'),
                                ),

                                const SizedBox(height: 20),
                                const Divider(),
                                const SizedBox(height: 10),

                                TextButton.icon(
                                  onPressed: () {
                                    final authStatus = ref.read(authControllerProvider).status;
                                    if (authStatus == AuthStatus.authenticated) {
                                      context.go('/home');
                                    } else {
                                      context.go('/login');
                                    }
                                  }, 
                                  icon: const Icon(Icons.web, size: 18), 
                                  label: const Text('Continue to Web Version', style: TextStyle(fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ) : const SizedBox.shrink(),
                    ),
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

class _TriNetraUniversalLogo extends StatelessWidget {
  const _TriNetraUniversalLogo();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 100,
      height: 100,
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: AppColors.primary.withOpacity(0.4), blurRadius: 20, offset: const Offset(0, 8)),
        ],
      ),
      child: const Icon(Icons.remove_red_eye_rounded, color: Colors.white, size: 60),
    );
  }
}

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
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Material(
        color: isHighlighted ? AppColors.primary : (isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05)),
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                Icon(icon, color: isHighlighted ? Colors.white : AppColors.primary),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: isHighlighted ? Colors.white : (isDark ? Colors.white : Colors.black),
                    ),
                  ),
                ),
                if (isHighlighted)
                  const Icon(Icons.star, color: Colors.white, size: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
