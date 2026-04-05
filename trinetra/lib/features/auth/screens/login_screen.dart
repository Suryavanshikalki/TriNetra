import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:amplify_flutter/amplify_flutter.dart'; // 🔥 ASLI AWS IMPORT
import 'package:sentry_flutter/sentry_flutter.dart'; // 🔥 100% TRACKING

import '../../../core/constants/app_colors.dart';
import '../../../app.dart';
import '../../../shared/widgets/download_app_section.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER GATEKEEPER (Facebook 2026 Standard)
// Blueprint Point 2: 5+1 Logins, No Skip, AWS Cognito Synced
// ==============================================================

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  bool _isLoading = false;

  // 🔥 ASLI AWS SOCIAL LOGIN ENGINE (Google, Apple, Microsoft)
  Future<void> _signInWithSocialWebUI(AuthProvider provider) async {
    setState(() => _isLoading = true);
    try {
      final result = await Amplify.Auth.signInWithWebUI(provider: provider);
      if (result.isSignedIn) {
        if (!mounted) return;
        context.go('/home'); // Asli Facebook-like feed
      }
    } catch (e, stackTrace) {
      safePrint('🚨 Social Auth Error: $e');
      Sentry.captureException(e, stackTrace: stackTrace);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Authentication Failed. Please try again.'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // 🔥 GITHUB LOGIN (Exclusive for AI OS Creators - Point 2)
  Future<void> _signInWithGitHubForAI() async {
    setState(() => _isLoading = true);
    try {
      // Custom Cognito Provider configured in AWS for GitHub
      final result = await Amplify.Auth.signInWithWebUI(provider: const AuthProvider.custom('GitHub'));
      if (result.isSignedIn) {
        if (!mounted) return;
        context.go('/ai_master_dashboard'); // Direct entry to Mode C / OS Creator
      }
    } catch (e, stackTrace) {
      Sentry.captureException(e, stackTrace: stackTrace);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('GitHub Auth Failed.'), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final locale = ref.watch(localeProvider);

    return WillPopScope(
      onWillPop: () async => false, // 🔥 STRICT ENTRY: No Skip Allowed
      child: Scaffold(
        backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
        body: SafeArea(
          child: _isLoading 
            ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
            : Column(
                children: [
                  // ─── Language Toggle (Retained) ─────────────────
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        _LanguageToggle(locale: locale, ref: ref),
                        const SizedBox(width: 8),
                        _ThemeToggle(isDark: isDark, ref: ref),
                      ],
                    ),
                  ),

                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      child: Column(
                        children: [
                          const SizedBox(height: 20),

                          // ─── Logo & Branding (Retained) ─────────
                          _buildBranding(context, isDark),

                          const SizedBox(height: 32),

                          // ─── CTA Buttons (Upgraded to 5 Logins) ─
                          _buildButtons(context, isDark),

                          const SizedBox(height: 24),

                          // ─── Divider (Retained) ────────────────
                          _buildDivider(context, isDark),

                          const SizedBox(height: 24),

                          // ─── GitHub Developer Entry (NEW) ──────
                          _buildGitHubAccess(context, isDark),

                          const SizedBox(height: 24),

                          // ─── Create Account (Retained) ─────────
                          _buildCreateAccount(context, isDark),

                          const SizedBox(height: 24),

                          // ─── Download App Section (Retained) ───
                          const DownloadAppSection(),

                          const SizedBox(height: 24),
                        ],
                      ),
                    ),
                  ),

                  // ─── Footer (Retained) ─────────────────────────
                  _buildFooter(context, isDark),
                ],
              ),
        ),
      ),
    );
  }

  Widget _buildBranding(BuildContext context, bool isDark) {
    return Column(
      children: [
        Container(
          width: 88,
          height: 88,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF1877F2), Color(0xFF0D5FCC)],
            ),
            boxShadow: [
              BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 24, spreadRadius: 4),
            ],
          ),
          child: const Center(
            child: Text(
              'T',
              style: TextStyle(color: Colors.white, fontSize: 44, fontWeight: FontWeight.w900),
            ),
          ),
        ),
        const SizedBox(height: 20),
        Text(
          'TriNetra',
          style: Theme.of(context).textTheme.displayMedium?.copyWith(
            color: AppColors.primary,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Connect with friends and the world\naround you.',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
            height: 1.5,
          ),
        ),
      ],
    );
  }

  Widget _buildButtons(BuildContext context, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // 1. Phone Number (Primary)
        ElevatedButton.icon(
          onPressed: () => context.go('/phone'),
          icon: const Icon(Icons.phone_android, color: Colors.white),
          label: const Text('Log in with Phone Number', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        ),
        const SizedBox(height: 12),

        // 2. Email Login (Real Route, no Snackbars)
        OutlinedButton.icon(
          onPressed: () => context.go('/email'),
          icon: Icon(Icons.email_outlined, color: isDark ? Colors.white : AppColors.textPrimaryLight),
          label: const Text('Log in with Email', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
          style: OutlinedButton.styleFrom(
            foregroundColor: isDark ? Colors.white : AppColors.textPrimaryLight,
            minimumSize: const Size(double.infinity, 52),
            side: BorderSide(color: isDark ? AppColors.dividerDark : AppColors.dividerLight, width: 1.5),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        ),
        const SizedBox(height: 12),

        // 3. Google Login (AWS Cognito Sync)
        ElevatedButton.icon(
          onPressed: () => _signInWithSocialWebUI(AuthProvider.google),
          icon: const Icon(Icons.g_mobiledata, color: Colors.red, size: 28),
          label: const Text('Continue with Google', style: TextStyle(color: Colors.black87, fontSize: 16, fontWeight: FontWeight.w600)),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        ),
        const SizedBox(height: 12),

        // 4. Apple Login
        ElevatedButton.icon(
          onPressed: () => _signInWithSocialWebUI(AuthProvider.apple),
          icon: const Icon(Icons.apple, color: Colors.white, size: 24),
          label: const Text('Continue with Apple', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.black,
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        ),
        const SizedBox(height: 12),

        // 5. Microsoft Login
        OutlinedButton.icon(
          onPressed: () => _signInWithSocialWebUI(const AuthProvider.custom('Microsoft')),
          icon: const Icon(Icons.window, color: Colors.blue),
          label: const Text('Continue with Microsoft', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
          style: OutlinedButton.styleFrom(
            foregroundColor: isDark ? Colors.white : AppColors.textPrimaryLight,
            minimumSize: const Size(double.infinity, 52),
            side: BorderSide(color: isDark ? AppColors.dividerDark : AppColors.dividerLight, width: 1.5),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        ),
      ],
    );
  }

  Widget _buildGitHubAccess(BuildContext context, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.surfaceDark : Colors.grey.shade100,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isDark ? AppColors.dividerDark : AppColors.dividerLight),
      ),
      child: Column(
        children: [
          Text(
            "Developers & OS Creators",
            style: TextStyle(color: isDark ? Colors.white70 : Colors.black54, fontSize: 12, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: _signInWithGitHubForAI,
            icon: const Icon(Icons.code, color: Colors.white),
            label: const Text('Access Master AI via GitHub', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF24292E), // GitHub Dark Color
              minimumSize: const Size(double.infinity, 48),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider(BuildContext context, bool isDark) {
    return Row(
      children: [
        Expanded(child: Divider(color: isDark ? AppColors.dividerDark : AppColors.dividerLight, thickness: 1)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text('OR', style: TextStyle(color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight, fontSize: 13, fontWeight: FontWeight.w600)),
        ),
        Expanded(child: Divider(color: isDark ? AppColors.dividerDark : AppColors.dividerLight, thickness: 1)),
      ],
    );
  }

  Widget _buildCreateAccount(BuildContext context, bool isDark) {
    return Column(
      children: [
        Text("Don't have an account?", style: TextStyle(color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight, fontSize: 14)),
        const SizedBox(height: 12),
        OutlinedButton(
          onPressed: () => context.go('/phone'),
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.accent,
            side: const BorderSide(color: AppColors.accent, width: 1.5),
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
          child: const Text('Create new account', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.accent)),
        ),
      ],
    );
  }

  Widget _buildFooter(BuildContext context, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Text(
        'By continuing, you agree to our Terms of Service\nand Privacy Policy.',
        textAlign: TextAlign.center,
        style: TextStyle(fontSize: 11, color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight, height: 1.5),
      ),
    );
  }
}

// ─── Language Toggle Widget (Retained) ───────────────────────────
class _LanguageToggle extends StatelessWidget {
  final Locale locale;
  final WidgetRef ref;
  const _LanguageToggle({required this.locale, required this.ref});
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        final next = locale.languageCode == 'en' ? 'hi' : 'en';
        ref.read(localeProvider.notifier).setLocale(next);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.primary.withOpacity(0.4)),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.language, size: 14, color: AppColors.primary),
            const SizedBox(width: 4),
            Text(locale.languageCode == 'en' ? 'EN' : 'HI', style: const TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }
}

// ─── Theme Toggle Widget (Retained) ──────────────────────────────
class _ThemeToggle extends StatelessWidget {
  final bool isDark;
  final WidgetRef ref;
  const _ThemeToggle({required this.isDark, required this.ref});
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => ref.read(themeModeProvider.notifier).toggle(),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          border: Border.all(color: isDark ? AppColors.dividerDark : AppColors.dividerLight),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Icon(isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined, size: 16, color: isDark ? AppColors.textSecondaryDark : AppColors.iconLight),
      ),
    );
  }
}
