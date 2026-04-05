import 'package:flutter/material.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER COLOR SYSTEM (Facebook 2026 Standard)
// Includes AI Tiers, Economy Wallet, and Auto-Escalation Colors
// ==============================================================

class AppColors {
  AppColors._();

  // ─── 1. PRIMARY BRAND (Facebook 2026 Core) ──────────────────
  static const Color primary = Color(0xFF1877F2); // The TriNetra Blue
  static const Color primaryDark = Color(0xFF145DBF);
  static const Color primaryLight = Color(0xFF4599FF);
  static const Color accent = Color(0xFF42B72A);  // Success/WhatsApp Green
  static const Color accentDark = Color(0xFF36A420);

  // ─── 2. LIGHT THEME ──────────────────────────────────────────
  static const Color backgroundLight = Color(0xFFF0F2F5);
  static const Color cardLight = Color(0xFFFFFFFF);
  static const Color textPrimaryLight = Color(0xFF050505);
  static const Color textSecondaryLight = Color(0xFF65676B);
  static const Color dividerLight = Color(0xFFE4E6EB);
  static const Color iconLight = Color(0xFF606770);
  static const Color inputBgLight = Color(0xFFF0F2F5);

  // ─── 3. DARK THEME (OLED Optimized) ──────────────────────────
  static const Color backgroundDark = Color(0xFF000000); // True OLED Black
  static const Color cardDark = Color(0xFF242526);
  static const Color surfaceDark = Color(0xFF3A3B3C);
  static const Color textPrimaryDark = Color(0xFFE4E6EB);
  static const Color textSecondaryDark = Color(0xFFB0B3B8);
  static const Color dividerDark = Color(0xFF3E4042);
  static const Color iconDark = Color(0xFFB0B3B8);
  static const Color inputBgDark = Color(0xFF3A3B3C);

  // ─── 4. REACTIONS & STATUS ───────────────────────────────────
  static const Color reactionLike = Color(0xFF1877F2);
  static const Color reactionLove = Color(0xFFE2264D);
  static const Color reactionHaha = Color(0xFFF7B125);
  static const Color reactionWow = Color(0xFFF7B125);
  static const Color reactionSad = Color(0xFFF7B125);
  static const Color reactionAngry = Color(0xFFE9710F);

  static const Color online = Color(0xFF44B700);
  static const Color error = Color(0xFFE53935);
  static const Color warning = Color(0xFFFFB300);
  static const Color success = Color(0xFF43A047);

  // ─── 5. STORY & REELS GRADIENT ───────────────────────────────
  static const List<Color> storyGradient = [
    Color(0xFFE1306C),
    Color(0xFFFD1D1D),
    Color(0xFFF56040),
    Color(0xFFF77737),
    Color(0xFFFCAF45),
  ];

  // ─── 6. THE ECONOMY & TRINETRA PAY (Point 6) ─────────────────
  static const Color walletBalance = Color(0xFF00C853); // Deep Money Green
  static const Color paymentPending = Color(0xFFFFB300);
  static const Color boostPaid = Color(0xFF8E24AA); // Pro Boost Purple

  // ─── 7. THE 6-IN-1 MASTER AI BRAIN (Point 11) ────────────────
  // ₹79,999 OS Creator & ₹9,999 Human-Brain ke liye ultra-premium colors
  static const Color aiChatbot = Color(0xFF00B4D8); // Mode A (Standard)
  static const Color aiAgentic = Color(0xFF6200EA); // Mode B (Deep Purple)
  static const List<Color> aiSuperAgenticGradient = [
    Color(0xFF1A2980), // Mode C (Human Brain - Cosmic Blue/Purple)
    Color(0xFF26D0CE),
  ];
  static const List<Color> aiOsCreatorGradient = [
    Color(0xFFFFD700), // OS Creator (Ultra Gold & Dark Chrome)
    Color(0xFF2C3E50),
  ];

  // ─── 8. AUTO-ESCALATION SYSTEM (Point 4) ─────────────────────
  // ₹30,000/month Complaint tracking tiers
  static const Color escalateLocal = Color(0xFFFFA726); // Level 1 (Orange)
  static const Color escalateCmPm = Color(0xFFEF5350);  // Level 2 (Red)
  static const Color escalateSupremeCourt = Color(0xFFB71C1C); // Level 3 (Deep Blood Red)

  // ─── 9. PREMIUM BADGES ───────────────────────────────────────
  static const Color verifiedBlue = Color(0xFF1877F2);
  static const Color premiumGold = Color(0xFFFFD700);
}
