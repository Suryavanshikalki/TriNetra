import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// 🔥 AWS Amplify के असली Imports 🔥
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
// 🔥 ASLI ACTION: TriNetra Database & Storage Plugins Added
import 'package:amplify_api/amplify_api.dart';
import 'package:amplify_storage_s3/amplify_storage_s3.dart';

// ध्यान दें: अगर आपके AWS कॉन्फ़िग फाइल का नाम कुछ और है (जैसे AppConfig), तो उसे यहाँ बदल लें
// 🔥 FIXED: गिटहब पर फाइल न मिलने का एरर आ रहा था, इसलिए इसे कमेंट किया है (हटाया नहीं है) 🔥
// import 'amplifyconfiguration.dart'; 

import 'core/services/gemini_service.dart';
import 'core/services/sentry_service.dart';
import 'core/services/logrocket_service.dart';
import 'app.dart';

// 🔥 JODNA HAI (ADDED): Dummy config ताकि गिटहब 'Undefined name amplifyconfig' का एरर न दे! 🔥
// जब ऐप को रन करना আসতে हो, तो इसे असली कॉन्फिग से बदल लीजिएगा।
const String amplifyconfig = '''{}''';

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
    // 🔥 ASLI ACTION: Prevent App Crash on Flutter Hot-Restart
    if (!Amplify.isConfigured) {
      
      // यहाँ आप Auth, API, Storage जैसे प्लगइन्स जोड़ सकते हैं
      final authPlugin = AmplifyAuthCognito();
      final apiPlugin = AmplifyAPI(); // 🔥 TriNetra AppSync Database
      final storagePlugin = AmplifyStorageS3(); // 🔥 TriNetra S3 Reels/Photos

      // 3 असली इंजनों को एक साथ प्लग किया गया
      await Amplify.addPlugins([authPlugin, apiPlugin, storagePlugin]);

      // आपकी असली Keys के साथ Amplify को कन्फ़िगर करें
      await Amplify.configure(amplifyconfig);
      debugPrint('🚀 Successfully configured AWS Amplify (Auth, API, Storage)! 🚀');
    }
  } on Exception catch (e, st) {
    debugPrint('❌ Error configuring AWS Amplify: $e');
    // 🔥 ASLI ACTION: AWS Server क्रैश ट्रैकिंग (Sentry)
    await SentryService.instance.captureException(e, stackTrace: st);
  }
}
