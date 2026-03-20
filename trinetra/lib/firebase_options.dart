/// Firebase configuration populated from compile-time --dart-define values.
/// GitHub Actions injects these from FIREBASE_CONFIG secret.
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;
import 'core/config/app_config.dart';

class DefaultFirebaseOptions {
  DefaultFirebaseOptions._();

  static FirebaseOptions get currentPlatform {
    if (kIsWeb) return web;
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return macos;
      case TargetPlatform.windows:
        return web; // Uses web config for Windows
      case TargetPlatform.linux:
        return web; // Uses web config for Linux
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions is not configured for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: AppConfig.firebaseWebApiKey,
    appId: AppConfig.firebaseWebAppId,
    messagingSenderId: AppConfig.firebaseMessagingSenderId,
    projectId: AppConfig.firebaseProjectId,
    authDomain: AppConfig.firebaseAuthDomain,
    storageBucket: AppConfig.firebaseStorageBucket,
    measurementId: AppConfig.firebaseMeasurementId,
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: AppConfig.firebaseAndroidApiKey,
    appId: AppConfig.firebaseAndroidAppId,
    messagingSenderId: AppConfig.firebaseMessagingSenderId,
    projectId: AppConfig.firebaseProjectId,
    storageBucket: AppConfig.firebaseStorageBucket,
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: AppConfig.firebaseIosApiKey,
    appId: AppConfig.firebaseIosAppId,
    messagingSenderId: AppConfig.firebaseMessagingSenderId,
    projectId: AppConfig.firebaseProjectId,
    storageBucket: AppConfig.firebaseStorageBucket,
    iosBundleId: AppConfig.appPackageId,
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: AppConfig.firebaseIosApiKey,
    appId: AppConfig.firebaseIosAppId,
    messagingSenderId: AppConfig.firebaseMessagingSenderId,
    projectId: AppConfig.firebaseProjectId,
    storageBucket: AppConfig.firebaseStorageBucket,
    iosBundleId: AppConfig.appPackageId,
  );
}
