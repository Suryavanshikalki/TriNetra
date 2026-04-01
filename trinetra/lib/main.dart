import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// Firebase service यहाँ से हटा दिया गया है
import 'core/services/gemini_service.dart';
import 'core/services/sentry_service.dart';
import 'core/services/logrocket_service.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // ─── 1. Initialize Gemini AI ──────────────────────────────
  GeminiService.instance.initialize();

  // ─── 2. Initialize LogRocket ──────────────────────────────
  LogRocketService.instance.initialize();

  // ─── 3. Initialize Sentry + Run App ───────────────────────
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
