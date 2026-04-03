import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:amplify_flutter/amplify_flutter.dart';

/// 👁️🔥 TriNetra Sentry Error & Performance Monitoring
/// 100% REAL: Secure DSN, 100% Tracking Rate, and AWS AppSync Sync for Critical Bugs.
/// Supports all 6 platforms: Android, iOS, Web, Windows, macOS, Linux.
class SentryService {
  SentryService._();
  static final SentryService instance = SentryService._();

  bool _initialized = false;

  // ─── ASLI KEY (GitHub Secrets / dart-define से सुरक्षित) ────────
  static const String _sentryDsn = String.fromEnvironment('SENTRY_DSN');

  /// Initialize Sentry. Called BEFORE runApp in main.dart.
  static Future<void> initialize({required VoidCallback appRunner}) async {
    if (_sentryDsn.isEmpty) {
      if (kDebugMode) safePrint('❌ TriNetra: SENTRY_DSN not found in dart-define.');
      appRunner();
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
    if (kDebugMode) safePrint('🚀 TriNetra: Sentry Crash Tracking 100% LIVE!');
  }

  // ─── 1. REAL EXCEPTION CAPTURE (With AWS Sync) ─────────────────
  /// यह फंक्शन असली एरर को पकड़कर Sentry और AWS दोनों जगह भेजता है।
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
    // अगर कोई बहुत बड़ा क्रैश है, तो AWS को तुरंत अलर्ट जाएगा
    if (isFatal) {
      _reportFatalErrorToAws(throwable.toString(), stackTrace.toString());
    }
  }

  // ─── 2. MESSAGE CAPTURE ────────────────────────────────────────
  Future<void> captureMessage(String message, {SentryLevel? level}) async {
    if (!_initialized) return;
    await Sentry.captureMessage(message, level: level ?? SentryLevel.info);
  }

  // ─── 3. REAL USER CONTEXT (Tied to TriNetra ID - Point 2) ──────
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

  // ─── 4. ADD BREADCRUMB (User Path Tracking) ────────────────────
  void addBreadcrumb(String message, {String? category, String? type}) {
    if (!_initialized) return;
    Sentry.addBreadcrumb(Breadcrumb(
      message: message,
      category: category ?? 'app_action',
      type: type ?? 'default',
      timestamp: DateTime.now().toUtc(),
    ));
  }

  // ─── 5. AWS CRASH REPORTER (Point 4: System Alert) ──────────────
  /// यह प्राइवेट फंक्शन सीधे आपके AWS DynamoDB में सिस्टम अलर्ट दर्ज करेगा।
  Future<void> _reportFatalErrorToAws(String error, String stackTrace) async {
    try {
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
          'error': error,
          'stackTrace': stackTrace,
        },
      );
      await Amplify.API.query(request: request).response;
      if (kDebugMode) safePrint('🚨 TriNetra Alert: Fatal Crash Sync to AWS Successful.');
    } catch (e) {
      if (kDebugMode) safePrint('❌ Sentry-to-AWS Sync Failed: $e');
    }
  }

  bool get isInitialized => _initialized;
}
