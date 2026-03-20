import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_colors.dart';
import '../../app.dart';

/// TriNetra Top App Bar — Facebook-style with Messenger, Notifications, Search
class TriNetraAppBar extends ConsumerWidget implements PreferredSizeWidget {
  const TriNetraAppBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(56);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return AppBar(
      backgroundColor: isDark ? AppColors.cardDark : Colors.white,
      elevation: 0,
      titleSpacing: 16,
      title: Text(
        'TriNetra',
        style: TextStyle(
          color: AppColors.primary,
          fontSize: 24,
          fontWeight: FontWeight.w900,
        ),
      ),
      actions: [
        // Theme Toggle
        _CircleIconButton(
          icon: isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
          onTap: () => ref.read(themeModeProvider.notifier).toggle(),
          isDark: isDark,
        ),
        const SizedBox(width: 8),
        // Search / AI
        _CircleIconButton(
          icon: Icons.search,
          onTap: () {},
          isDark: isDark,
        ),
        const SizedBox(width: 8),
        // Messenger
        _CircleIconButton(
          icon: Icons.send_outlined,
          onTap: () {},
          isDark: isDark,
          badge: 3,
        ),
        const SizedBox(width: 8),
        // Notifications
        _CircleIconButton(
          icon: Icons.notifications_none,
          onTap: () {},
          isDark: isDark,
          badge: 12,
        ),
        const SizedBox(width: 12),
      ],
    );
  }
}

class _CircleIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final bool isDark;
  final int? badge;

  const _CircleIconButton({
    required this.icon,
    required this.onTap,
    required this.isDark,
    this.badge,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: isDark ? AppColors.surfaceDark : AppColors.inputBgLight,
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              size: 20,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            ),
          ),
        ),
        if (badge != null && badge! > 0)
          Positioned(
            right: 0,
            top: 0,
            child: Container(
              width: 18,
              height: 18,
              decoration: const BoxDecoration(
                color: AppColors.error,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  badge! > 9 ? '9+' : '$badge',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
