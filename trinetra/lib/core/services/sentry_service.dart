import 'dart:async';
import 'dart:convert'; // 🔥 ASLI JSON PARSING 
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart'; // 🔥 ASLI MASTER VAULT
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:amplify_flutter/amplify_flutter.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER CRASH & PERFORMANCE ENGINE 
// 100% REAL: Secure DSN, 100% Tracking Rate, AWS AppSync Sync
// 0% Dummy | Fully Synced with TriNetra Master Vault (.env)
// ==============================================================

class SentryService {
  SentryService._();
  static final SentryService instance = SentryService._();

  bool _initialized = false;

  // ─── 1. ASLI KEY (GitHub Secrets -> .env Vault से) ─────────────
  static String get _sentryDsn => dotenv.env['SENTRY_DSN'] ?? '';

  /// Initialize Sentry. Called BEFORE runApp in main.dart.
  static Future<void> initialize({required FutureOr<void> Function() appRunner}) async {
    if (_sentryDsn.isEmpty) {
      safePrint('🚨 TriNetra Fatal Error: SENTRY_DSN not found in .env vault.');
      await appRunner();
      return;
    }

    await SentryFlutter.init(
      (options) {
        options.dsn = _sentryDsn;
        options.environment = kDebugMode ? 'development' : 'production';
        
        // TriNetra Versioning System (Point 1)
        options.release = 'TriNetra_SuperApp@1.0.0'; 
        
        // 100% Performance Tracking (Real-time profiling)
        options.tracesSampleRate = 1.0; 
        options.profilesSampleRate = 1.0;
        
        // Visual Debugging: Sends screenshot of the crash
        options.attachScreenshot = true;
        options.attachViewHierarchy = true;
        
        // Tracking User Path
        options.enableAutoNativeBreadcrumbs = true;
        options.reportPackages = true;
      },
      appRunner: appRunner,
    );

    instance._initialized = true;
    safePrint('🚀 TriNetra: Sentry Crash Tracking 100% LIVE!');
  }

  // ─── 2. REAL EXCEPTION CAPTURE (With AWS Sync) ─────────────────
  Future<void> captureException(
    dynamic throwable, {
    dynamic stackTrace,
    String? hint,
    Map<String, dynamic>? extras,
    bool isFatal = false, // Critical Crash Alert
  }) async {
    if (!_initialized) return;

    // 1. Sentry डैशबोर्ड को डेटा भेजना
    await Sentry.captureException(
      throwable,
      stackTrace: stackTrace,
      withScope: (scope) {
        if (extras != null) {
          extras.forEach((key, value) => scope.setTag(key, value.toString()));
        }
        if (hint != null) scope.setTag('hint', hint.toString());
        if (isFatal) scope.setLevel(SentryLevel.fatal);
      },
    );

    // 2. AWS AppSync Sync (Point 4: Auto-Escalation Alert)
    if (isFatal) {
      _reportFatalErrorToAws(throwable.toString(), stackTrace.toString());
    }
  }

  // ─── 3. MESSAGE CAPTURE ────────────────────────────────────────
  Future<void> captureMessage(String message, {SentryLevel? level}) async {
    if (!_initialized) return;
    await Sentry.captureMessage(message, level: level ?? SentryLevel.info);
  }

  // ─── 4. REAL USER CONTEXT (Tied to TriNetra ID - Point 2) ──────
  Future<void> setUser({
    required String trinetraId,
    String? username,
    String? email,
  }) async {
    if (!_initialized) return;
    await Sentry.configureScope(
      (scope) => scope.setUser(SentryUser(
        id: trinetraId, // Asli TriNetra ID
        username: username,
        email: email,
      )),
    );
  }

  Future<void> clearUser() async {
    if (!_initialized) return;
    await Sentry.configureScope((scope) => scope.setUser(null));
  }

  // ─── 5. ADD BREADCRUMB (User Path Tracking) ────────────────────
  void addBreadcrumb(String message, {String? category, String? type}) {
    if (!_initialized) return;
    Sentry.addBreadcrumb(Breadcrumb(
      message: message,
      category: category ?? 'app_action',
      type: type ?? 'default',
      timestamp: DateTime.now().toUtc(),
    ));
  }

  // ─── 6. AWS CRASH REPORTER (Secure & Encoded) ──────────────────
  Future<void> _reportFatalErrorToAws(String error, String stackTrace) async {
    try {
      // 🔥 ASLI JSON ENCODING (GraphQL String Crash Fix)
      final safeError = jsonEncode(error);
      final safeStackTrace = jsonEncode(stackTrace);

      final request = GraphQLRequest<String>(
        document: '''
          mutation LogFatalCrash(\$error: String!, \$stackTrace: String!) {
            createSystemAlert(error: \$error, trace: \$stackTrace) {
              status
              timestamp
            }
          }
        ''',
        variables: {
          'error': safeError,
          'stackTrace': safeStackTrace,
        },
      );
      await Amplify.API.query(request: request).response;
      safePrint('🚨 TriNetra Alert: Fatal Crash Sync to AWS Successful.');
    } catch (e, internalStack) {
      // If AWS fails, make sure we at least send the AWS failure to Sentry
      safePrint('❌ Sentry-to-AWS Sync Failed: $e');
      Sentry.captureException(e, stackTrace: internalStack);
    }
  }

  bool get isInitialized => _initialized;
}
