import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/services/appwrite_service.dart';
import 'core/services/gemini_service.dart';
import 'core/services/sentry_service.dart';
import 'core/services/logrocket_service.dart';
import 'app.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER ENGINE (Dual-Engine: Appwrite + Cloudflare)
// 100% REAL: 0% AWS | 100% Dual-Engine | Sentry & LogRocket Tracked
// ==============================================================

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // ─── 1. Initialize Appwrite (Dual-Engine Start) ────────
  await _configureDualEngine();

  // ─── 2. Initialize Gemini AI ──────────────────────────────
  GeminiService.instance.initialize();

  // ─── 3. Initialize LogRocket ──────────────────────────────
  LogRocketService.instance.initialize();

  // ─── 4. Initialize Sentry + Run App ───────────────────────
  await SentryService.initialize(
    appRunner: () {
      runApp(
        const ProviderScope(
          child: TriNetraApp(),
        ),
      );
    },
  );
}

// 🔥 Dual-Engine (Appwrite + Cloudflare) Configuration Function 🔥
Future<void> _configureDualEngine() async {
  try {
    await AppwriteService.instance.initialize();
    debugPrint('🚀 Successfully configured Dual-Engine (Appwrite + Cloudflare)! 🚀');
    debugPrint('🌐 Firebase: Restricted to Domain Routing only.');
  } on Exception catch (e, st) {
    debugPrint('❌ Error configuring Dual-Engine: $e');
    await SentryService.instance.captureException(e, stackTrace: st);
  }
}
