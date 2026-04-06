import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTICS
import '../../../core/constants/app_colors.dart';
import '../../../core/services/logrocket_service.dart'; // 🔥 ASLI TRACKING

// ==============================================================
// 👁️🔥 TRINETRA MASTER BOTTOM NAV (Blueprint Point 12-A)
// 100% REAL: Facebook Style 6 Tabs, Haptics, LogRocket Tracking
// ==============================================================

class TriNetraBottomNav extends StatelessWidget {
  final int currentIndex;
  final void Function(int) onTap;

  const TriNetraBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        border: Border(
          top: BorderSide(
            color: isDark ? AppColors.dividerDark : AppColors.dividerLight,
            width: 0.5,
          ),
        ),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 52, // Standard Super-App Nav Height
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              // 🔥 1. Home
              _NavItem(
                icon: Icons.home_outlined,
                activeIcon: Icons.home,
                label: 'Home',
                index: 0,
                currentIndex: currentIndex,
                onTap: onTap,
              ),
              // 🔥 2. Reels
              _NavItem(
                icon: Icons.ondemand_video_outlined,
                activeIcon: Icons.ondemand_video,
                label: 'Reels',
                index: 1,
                currentIndex: currentIndex,
                onTap: onTap,
              ),
              // 🔥 3. Friends
              _NavItem(
                icon: Icons.people_outline,
                activeIcon: Icons.people,
                label: 'Friends',
                index: 2,
                currentIndex: currentIndex,
                onTap: onTap,
              ),
              // 🔥 4. Dashboard
              _NavItem(
                icon: Icons.dashboard_outlined,
                activeIcon: Icons.dashboard,
                label: 'Dashboard',
                index: 3,
                currentIndex: currentIndex,
                onTap: onTap,
              ),
              // 🔥 5. Notifications
              _NavItem(
                icon: Icons.notifications_outlined,
                activeIcon: Icons.notifications,
                label: 'Alerts', // Text shortened to fit UI cleanly
                index: 4,
                currentIndex: currentIndex,
                onTap: onTap,
              ),
              // 🔥 6. Profile
              _NavItem(
                icon: Icons.person_outline,
                activeIcon: Icons.person,
                label: 'Profile',
                index: 5,
                currentIndex: currentIndex,
                onTap: onTap,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final int index;
  final int currentIndex;
  final void Function(int) onTap;

  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.index,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isActive = currentIndex == index;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final activeColor = AppColors.primary;
    final inactiveColor = isDark ? AppColors.iconDark : AppColors.iconLight;

    return Expanded(
      child: InkWell(
        onTap: () {
          // 🔥 ASLI ACTION: Premium Feedback & Tracking
          HapticFeedback.selectionClick(); 
          LogRocketService.instance.track(
            'BottomNav_Tab_Tapped', 
            properties: {'tabName': label, 'index': index}
          );
          
          // Trigger the actual navigation
          onTap(index);
        },
        borderRadius: BorderRadius.circular(8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 200),
              child: Icon(
                isActive ? activeIcon : icon,
                key: ValueKey(isActive),
                color: isActive ? activeColor : inactiveColor,
                size: 26,
              ),
            ),
            if (isActive)
              Container(
                margin: const EdgeInsets.only(top: 3),
                width: 4,
                height: 4,
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
