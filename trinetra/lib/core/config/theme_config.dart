import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart'; // Isme tumhara 0xFF1877F2 Blue hoga

// ==============================================================
// 👁️🔥 TRINETRA MASTER UI/UX ENGINE (Facebook 2026 Standard)
// 6-Platform Ready | 5 Payments & AI Dialogs | Reels Tab Ready
// ==============================================================

class AppTheme {
  AppTheme._();

  // ─── 🌞 LIGHT THEME (TriNetra Premium) ─────────────────────────
  static ThemeData get light => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorScheme: const ColorScheme.light(
          primary: AppColors.primary,       // TriNetra Blue: 0xFF1877F2
          secondary: AppColors.accent,
          surface: AppColors.cardLight,
          error: AppColors.error,
          onPrimary: Colors.white,
          onSecondary: Colors.white,
          onSurface: AppColors.textPrimaryLight,
        ),
        scaffoldBackgroundColor: AppColors.backgroundLight,
        cardColor: AppColors.cardLight,
        dividerColor: AppColors.dividerLight,
        textTheme: _buildTextTheme(AppColors.textPrimaryLight),
        
        // 📱 AppBar: Facebook Style (Clean & Flat)
        appBarTheme: AppBarTheme(
          backgroundColor: AppColors.cardLight,
          foregroundColor: AppColors.textPrimaryLight,
          elevation: 0,
          surfaceTintColor: Colors.transparent,
          systemOverlayStyle: SystemUiOverlayStyle.dark,
          titleTextStyle: GoogleFonts.roboto( // Standardized for 2026
            fontSize: 22,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.5,
            color: AppColors.primary,
          ),
        ),
        
        // 📌 Bottom Nav: For Home, Reels, AI, Profile
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: AppColors.cardLight,
          selectedItemColor: AppColors.primary,
          unselectedItemColor: AppColors.iconLight,
          showSelectedLabels: true,
          showUnselectedLabels: true,
          selectedLabelStyle: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
          unselectedLabelStyle: TextStyle(fontSize: 12),
          type: BottomNavigationBarType.fixed,
          elevation: 8,
        ),
        
        // 🔘 Buttons: 5 Payments & AI Prompts
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            elevation: 0,
            minimumSize: const Size(double.infinity, 50),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            textStyle: GoogleFonts.roboto(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
        
        // 📝 Text Fields: Chat Box (WhatsApp 2.0) & AI Input
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: AppColors.inputBgLight,
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(24), // Pill shape for modern chat
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(24),
            borderSide: const BorderSide(color: AppColors.primary, width: 2.0),
          ),
        ),

        // 🔥 MISSING IN YOUR CODE: Bottom Sheets (For PayU, AI Menus, Reels options)
        bottomSheetTheme: const BottomSheetThemeData(
          backgroundColor: AppColors.cardLight,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
        ),

        // 🔥 MISSING IN YOUR CODE: Tabs (For Feeds vs MarketPlace)
        tabBarTheme: const TabBarTheme(
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.iconLight,
          indicatorSize: TabBarIndicatorSize.tab,
          indicator: UnderlineTabIndicator(
            borderSide: BorderSide(color: AppColors.primary, width: 3.0),
          ),
        ),
      );

  // ─── 🌙 DARK THEME (TriNetra Premium Dark - OLED Ready) ────────
  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.primary,
          secondary: AppColors.accent,
          surface: AppColors.cardDark,
          error: AppColors.error,
          onPrimary: Colors.white,
          onSecondary: Colors.white,
          onSurface: AppColors.textPrimaryDark,
        ),
        scaffoldBackgroundColor: AppColors.backgroundDark, // OLED Black preferable
        cardColor: AppColors.cardDark,
        dividerColor: AppColors.dividerDark,
        textTheme: _buildTextTheme(AppColors.textPrimaryDark),
        
        appBarTheme: AppBarTheme(
          backgroundColor: AppColors.cardDark,
          foregroundColor: AppColors.textPrimaryDark,
          elevation: 0,
          surfaceTintColor: Colors.transparent,
          systemOverlayStyle: SystemUiOverlayStyle.light,
          titleTextStyle: GoogleFonts.roboto(
            fontSize: 22,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.5,
            color: AppColors.primary,
          ),
        ),
        
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: AppColors.cardDark,
          selectedItemColor: AppColors.primary,
          unselectedItemColor: AppColors.iconDark,
          showSelectedLabels: true,
          showUnselectedLabels: true,
          selectedLabelStyle: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
          unselectedLabelStyle: TextStyle(fontSize: 12),
          type: BottomNavigationBarType.fixed,
          elevation: 8,
        ),
        
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            elevation: 0,
            minimumSize: const Size(double.infinity, 50),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            textStyle: GoogleFonts.roboto(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
        
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: AppColors.inputBgDark,
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(24),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(24),
            borderSide: const BorderSide(color: AppColors.primary, width: 2.0),
          ),
        ),

        bottomSheetTheme: const BottomSheetThemeData(
          backgroundColor: AppColors.cardDark,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
        ),

        tabBarTheme: const TabBarTheme(
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.iconDark,
          indicatorSize: TabBarIndicatorSize.tab,
          indicator: UnderlineTabIndicator(
            borderSide: BorderSide(color: AppColors.primary, width: 3.0),
          ),
        ),
      );

  // ─── 🔠 TYPOGRAPHY (Roboto: The Facebook/Google Standard) ─────
  static TextTheme _buildTextTheme(Color baseColor) => TextTheme(
        displayLarge: GoogleFonts.roboto(fontSize: 32, fontWeight: FontWeight.w900, color: baseColor),
        displayMedium: GoogleFonts.roboto(fontSize: 28, fontWeight: FontWeight.w800, color: baseColor),
        titleLarge: GoogleFonts.roboto(fontSize: 20, fontWeight: FontWeight.w700, color: baseColor),
        titleMedium: GoogleFonts.roboto(fontSize: 16, fontWeight: FontWeight.w600, color: baseColor),
        bodyLarge: GoogleFonts.roboto(fontSize: 15, fontWeight: FontWeight.w400, color: baseColor),
        bodyMedium: GoogleFonts.roboto(fontSize: 14, fontWeight: FontWeight.w400, color: baseColor),
        labelSmall: GoogleFonts.roboto(fontSize: 12, fontWeight: FontWeight.w500, color: baseColor),
      );
}
