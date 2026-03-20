import 'package:flutter/material.dart';

/// TriNetra Brand Color System — Facebook 2026 Standard
class AppColors {
  AppColors._();

  // ─── Primary Brand ──────────────────────────────────────────
  static const Color primary = Color(0xFF1877F2);
  static const Color primaryDark = Color(0xFF145DBF);
  static const Color primaryLight = Color(0xFF4599FF);
  static const Color accent = Color(0xFF42B72A);
  static const Color accentDark = Color(0xFF36A420);

  // ─── Light Theme ────────────────────────────────────────────
  static const Color backgroundLight = Color(0xFFF0F2F5);
  static const Color cardLight = Color(0xFFFFFFFF);
  static const Color textPrimaryLight = Color(0xFF050505);
  static const Color textSecondaryLight = Color(0xFF65676B);
  static const Color dividerLight = Color(0xFFE4E6EB);
  static const Color iconLight = Color(0xFF606770);
  static const Color inputBgLight = Color(0xFFF0F2F5);

  // ─── Dark Theme ─────────────────────────────────────────────
  static const Color backgroundDark = Color(0xFF18191A);
  static const Color cardDark = Color(0xFF242526);
  static const Color surfaceDark = Color(0xFF3A3B3C);
  static const Color textPrimaryDark = Color(0xFFE4E6EB);
  static const Color textSecondaryDark = Color(0xFFB0B3B8);
  static const Color dividerDark = Color(0xFF3E4042);
  static const Color iconDark = Color(0xFFB0B3B8);
  static const Color inputBgDark = Color(0xFF3A3B3C);

  // ─── Reactions ──────────────────────────────────────────────
  static const Color reactionLike = Color(0xFF1877F2);
  static const Color reactionLove = Color(0xFFE2264D);
  static const Color reactionHaha = Color(0xFFF7B125);
  static const Color reactionWow = Color(0xFFF7B125);
  static const Color reactionSad = Color(0xFFF7B125);
  static const Color reactionAngry = Color(0xFFE9710F);

  // ─── Status Colors ──────────────────────────────────────────
  static const Color online = Color(0xFF44B700);
  static const Color error = Color(0xFFE53935);
  static const Color warning = Color(0xFFFFB300);
  static const Color success = Color(0xFF43A047);

  // ─── Story Ring Gradient ────────────────────────────────────
  static const List<Color> storyGradient = [
    Color(0xFFE1306C),
    Color(0xFFFD1D1D),
    Color(0xFFF56040),
    Color(0xFFF77737),
    Color(0xFFFCAF45),
  ];

  // ─── Premium / Verified Badge ───────────────────────────────
  static const Color verifiedBlue = Color(0xFF1877F2);
  static const Color premiumGold = Color(0xFFFFD700);
}
