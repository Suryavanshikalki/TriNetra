import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../app.dart';
import '../../../shared/widgets/download_app_section.dart';

/// TriNetra Login Screen — Facebook-style premium design
class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final locale = ref.watch(localeProvider);

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      body: SafeArea(
        child: Column(
          children: [
            // ─── Language Toggle ────────────────────────────
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
                    const SizedBox(height: 40),

                    // ─── Logo & Branding ──────────────────────
                    _buildBranding(context, isDark),

                    const SizedBox(height: 40),

                    // ─── CTA Buttons ──────────────────────────
                    _buildButtons(context, isDark),

                    const SizedBox(height: 32),

                    // ─── Divider ─────────────────────────────
                    _buildDivider(context, isDark),

                    const SizedBox(height: 24),

                    // ─── Create Account ──────────────────────
                    _buildCreateAccount(context, isDark),

                    const SizedBox(height: 24),

                    // ─── Download App (Web only, hidden on native) ─
                    const DownloadAppSection(),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),

            // ─── Footer ────────────────────────────────────
            _buildFooter(context, isDark),
          ],
        ),
      ),
    );
  }

  Widget _buildBranding(BuildContext context, bool isDark) {
    return Column(
      children: [
        // Logo
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
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.3),
                blurRadius: 24,
                spreadRadius: 4,
              ),
            ],
          ),
          child: const Center(
            child: Text(
              'T',
              style: TextStyle(
                color: Colors.white,
                fontSize: 44,
                fontWeight: FontWeight.w900,
              ),
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
            color: isDark
                ? AppColors.textSecondaryDark
                : AppColors.textSecondaryLight,
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
        // Log In with Phone
        ElevatedButton(
          onPressed: () => context.go('/phone'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: const Text(
            'Log in with Phone Number',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),

        const SizedBox(height: 12),

        // Log In with Email (coming soon)
        OutlinedButton(
          onPressed: () => _showComingSoon(context),
          style: OutlinedButton.styleFrom(
            foregroundColor: isDark ? Colors.white : AppColors.textPrimaryLight,
            minimumSize: const Size(double.infinity, 52),
            side: BorderSide(
              color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
              width: 1.5,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: const Text(
            'Log in with Email',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDivider(BuildContext context, bool isDark) {
    return Row(
      children: [
        Expanded(
          child: Divider(
            color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
            thickness: 1,
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'OR',
            style: TextStyle(
              color: isDark
                  ? AppColors.textSecondaryDark
                  : AppColors.textSecondaryLight,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        Expanded(
          child: Divider(
            color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
            thickness: 1,
          ),
        ),
      ],
    );
  }

  Widget _buildCreateAccount(BuildContext context, bool isDark) {
    return Column(
      children: [
        Text(
          "Don't have an account?",
          style: TextStyle(
            color: isDark
                ? AppColors.textSecondaryDark
                : AppColors.textSecondaryLight,
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 12),
        OutlinedButton(
          onPressed: () => context.go('/phone'),
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.accent,
            side: const BorderSide(color: AppColors.accent, width: 1.5),
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: const Text(
            'Create new account',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.accent,
            ),
          ),
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
        style: TextStyle(
          fontSize: 11,
          color: isDark
              ? AppColors.textSecondaryDark
              : AppColors.textSecondaryLight,
          height: 1.5,
        ),
      ),
    );
  }

  void _showComingSoon(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Email login coming soon!'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}

// ─── Language Toggle Widget ──────────────────────────────────────
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
          border: Border.all(color: AppColors.primary.withValues(alpha: 0.4)),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.language, size: 14, color: AppColors.primary),
            const SizedBox(width: 4),
            Text(
              locale.languageCode == 'en' ? 'EN' : 'HI',
              style: const TextStyle(
                color: AppColors.primary,
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Theme Toggle Widget ─────────────────────────────────────────
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
          border: Border.all(
            color: isDark
                ? AppColors.dividerDark
                : AppColors.dividerLight,
          ),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Icon(
          isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
          size: 16,
          color: isDark ? AppColors.textSecondaryDark : AppColors.iconLight,
        ),
      ),
    );
  }
}
