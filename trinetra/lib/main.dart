import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// 🔥 AWS Amplify के असली Imports 🔥
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
// ध्यान दें: अगर आपके AWS कॉन्फ़िग फाइल का नाम कुछ और है (जैसे AppConfig), तो उसे यहाँ बदल लें
import 'amplifyconfiguration.dart'; 

import 'core/services/gemini_service.dart';
import 'core/services/sentry_service.dart';
import 'core/services/logrocket_service.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // ─── 1. Initialize AWS Amplify (असली इंजन स्टार्ट) ────────
  await _configureAmplify();

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

// 🔥 AWS Amplify को कनेक्ट करने का असली फंक्शन 🔥
Future<void> _configureAmplify() async {
  try {
    // यहाँ आप Auth, API, Storage जैसे प्लगइन्स जोड़ सकते हैं
    final authPlugin = AmplifyAuthCognito();
    await Amplify.addPlugin(authPlugin);

    // आपकी असली Keys के साथ Amplify को कन्फ़िगर करें
    await Amplify.configure(amplifyconfig);
    debugPrint('🚀 Successfully configured AWS Amplify! 🚀');
  } on Exception catch (e) {
    debugPrint('❌ Error configuring AWS Amplify: $e');
  }
}
