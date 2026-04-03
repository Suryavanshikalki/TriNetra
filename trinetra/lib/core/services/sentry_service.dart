import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:amplify_flutter/amplify_flutter.dart';

/// 👁️🔥 TriNetra Sentry Error & Performance Monitoring
/// 100% REAL: Secure DSN, 100% Tracking Rate, and AWS AppSync Sync for Critical Bugs.
class SentryService {
  SentryService._();
  static final SentryService instance = SentryService._();

  bool _initialized = false;

  // ─── ASLI KEY (GitHub Secrets / dart-define से सुरक्षित) ────────
  static const String _sentryDsn = String.fromEnvironment('SENTRY_DSN');

  /// Initialize Sentry. Called BEFORE runApp.
  static Future<void> initialize({required VoidCallback appRunner}) async {
    if (_sentryDsn.isEmpty) {
      if (kDebugMode) safePrint('❌ SENTRY_DSN not found in dart-define.');
      appRunner();
      return;
    }

    await SentryFlutter.init(
      (options) {
        options.dsn = _sentryDsn;
        options.environment = kDebugMode ? 'development' : 'production';
        // TriNetra Versioning System
        options.release = 'TriNetra_SuperApp@1.0.0'; 
        // 100% Tracking (No 20% limit anymore)
        options.tracesSampleRate = 1.0; 
        options.profilesSampleRate = 1.0;
        options.attachScreenshot = true;
        options.attachViewHierarchy = true;
        options.enableAutoNativeBreadcrumbs = true;
        options.reportPackages = true;
      },
      appRunner: appRunner,
    );

    instance._initialized = true;
    if (kDebugMode) safePrint('🚀 TriNetra: Sentry Crash Tracking 100% LIVE!');
  }

  // ─── 1. REAL EXCEPTION CAPTURE (With AWS Sync) ─────────────────
  Future<void> captureException(
    dynamic throwable, {
    dynamic stackTrace,
    String? hint,
    Map<String, dynamic>? extras,
    bool isFatal = false, // अगर ऐप क्रैश हो रहा है
  }) async {
    if (!_initialized) return;

    // 1. Sentry डैशबोर्ड को भेजना
    await Sentry.captureException(
      throwable,
      stackTrace: stackTrace,
      withScope: (scope) {
        if (extras != null) {
          extras.forEach((key, value) => scope.setTag(key, value.toString()));
        }
        if (hint != null) scope.setTag('hint', hint.toString());
      },
    );

    // 2. AWS AppSync Sync (Point 4: Auto-Escalation / System Issue)
    // अगर कोई बहुत बड़ा क्रैश है, तो AWS डेटाबेस को तुरंत अलर्ट जाएगा
    if (isFatal) {
      _reportFatalErrorToAws(throwable.toString(), stackTrace.toString());
    }
  }

  // ─── 2. MESSAGE CAPTURE ────────────────────────────────────────
  Future<void> captureMessage(String message, {SentryLevel? level}) async {
    if (!_initialized) return;
    await Sentry.captureMessage(message, level: level ?? SentryLevel.info);
  }

  // ─── 3. REAL USER CONTEXT (Tied to TriNetra ID) ────────────────
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

  // ─── 5. AWS CRASH REPORTER (Private) ───────────────────────────
  Future<void> _reportFatalErrorToAws(String error, String stackTrace) async {
    try {
      final request = GraphQLRequest<String>(
        document: '''
          mutation LogFatalCrash(\$error: String!, \$stackTrace: String!) {
            createSystemAlert(error: \$error, trace: \$stackTrace) {
              status
            }
          }
        ''',
        variables: {
          'error': error,
          'stackTrace': stackTrace,
        },
      );
      await Amplify.API.query(request: request).response;
    } catch (e) {
      if (kDebugMode) safePrint('❌ Sentry-to-AWS Sync Failed: $e');
    }
  }

  bool get isInitialized => _initialized;
}
