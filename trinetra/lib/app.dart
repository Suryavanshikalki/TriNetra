import 'package:flutter/material.dart'; // (ठीक किया गया: छोटा 'i')
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/config/theme_config.dart';
import 'core/config/app_config.dart';
import 'features/auth/screens/splash_screen.dart';
import 'features/auth/screens/login_screen.dart';
import 'features/auth/screens/phone_input_screen.dart';
import 'features/auth/screens/otp_verify_screen.dart';
import 'features/home/screens/home_screen.dart';
import 'features/messenger/screens/messenger_list_screen.dart';
import 'features/messenger/screens/chat_screen.dart';
import 'features/wallet/screens/wallet_screen.dart';
import 'features/referral/screens/referral_screen.dart';
import 'features/profile/screens/profile_screen.dart';
import 'features/ai_assistant/screens/ai_chat_screen.dart';
import 'l10n/app_localizations.dart';

// 🚀 पहली लाइन जो जोड़ी गई: अपडेट वाली फाइल को यहाँ बुला लिया
import 'update_helper.dart';

// ─── Theme Mode Provider ─────────────────────────────────────────
final themeModeProvider = StateNotifierProvider<ThemeModeNotifier, ThemeMode>(
  (ref) => ThemeModeNotifier(),
);

class ThemeModeNotifier extends StateNotifier<ThemeMode> {
  ThemeModeNotifier() : super(ThemeMode.system) {
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final value = prefs.getString('theme_mode') ?? 'system';
    state = _fromString(value);
  }

  Future<void> toggle() async {
    final next = state == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    state = next;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('theme_mode', _toString(next));
  }

  Future<void> setMode(ThemeMode mode) async {
    state = mode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('theme_mode', _toString(mode));
  }

  ThemeMode _fromString(String s) {
    switch (s) {
      case 'light': return ThemeMode.light;
      case 'dark': return ThemeMode.dark;
      default: return ThemeMode.system;
    }
  }

  String _toString(ThemeMode m) {
    switch (m) {
      case ThemeMode.light: return 'light';
      case ThemeMode.dark: return 'dark';
      default: return 'system';
    }
  }
}

// ─── Locale Provider ─────────────────────────────────────────────
final localeProvider = StateNotifierProvider<LocaleNotifier, Locale>(
  (ref) => LocaleNotifier(),
);

class LocaleNotifier extends StateNotifier<Locale> {
  LocaleNotifier() : super(const Locale('en')) {
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final code = prefs.getString('locale') ?? 'en';
    state = Locale(code);
  }

  Future<void> setLocale(String languageCode) async {
    state = Locale(languageCode);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('locale', languageCode);
  }
}

// ─── Router ──────────────────────────────────────────────────────
final _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (_, __) => const SplashScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (_, __) => const LoginScreen(),
    ),
    GoRoute(
      path: '/phone',
      builder: (_, __) => const PhoneInputScreen(),
    ),
    GoRoute(
      path: '/otp',
      builder: (context, state) {
        final phone = state.extra as String? ?? '';
        return OtpVerifyScreen(phoneNumber: phone);
      },
    ),
    GoRoute(
      path: '/home',
      builder: (_, __) => const HomeScreen(),
    ),
    GoRoute(
      path: '/messenger',
      builder: (_, __) => const MessengerListScreen(),
    ),
    GoRoute(
      path: '/chat/:conversationId',
      builder: (_, state) {
        final convId = state.pathParameters['conversationId'] ?? '';
        final extra = state.extra as Map<String, String>?;
        return ChatScreen(
          conversationId: convId,
          otherName: extra?['otherName'] ?? '',
          otherAvatar: extra?['otherAvatar'] ?? '',
        );
      },
    ),
    GoRoute(
      path: '/wallet',
      builder: (_, __) => const WalletScreen(),
    ),
    GoRoute(
      path: '/referral',
      builder: (_, __) => const ReferralScreen(),
    ),
    GoRoute(
      path: '/profile/:userId',
      builder: (_, state) =>
          ProfileScreen(userId: state.pathParameters['userId']),
    ),
    GoRoute(
      path: '/ai',
      builder: (_, __) => const AIChatScreen(),
    ),
  ],
  redirect: (context, state) {
    // Redirect logic handled in SplashScreen via auth state
    return null;
  },
);

// ─── Root App Widget ─────────────────────────────────────────────
class TriNetraApp extends ConsumerWidget {
  const TriNetraApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final locale = ref.watch(localeProvider);

    return MaterialApp.router(
      title: AppConfig.appName,
      debugShowCheckedModeBanner: false,
      themeMode: themeMode,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      locale: locale,
      supportedLocales: const [
        Locale('en'),
        Locale('hi'),
      ],
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      routerConfig: _router,
      
      // 🚀 दूसरी लाइन जो जोड़ी गई: ऐप के ऊपर ऑटो-अपडेट का सुरक्षा कवच!
      builder: (context, child) {
        return TriNetraUpdateManager(child: child!);
      },
      
    );
  }
}
