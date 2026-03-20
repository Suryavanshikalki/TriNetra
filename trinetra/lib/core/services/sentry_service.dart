import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import '../config/app_config.dart';

/// Sentry Error & Performance Monitoring Service
class SentryService {
  SentryService._();
  static final SentryService instance = SentryService._();

  bool _initialized = false;

  /// Initialize Sentry. Called BEFORE runApp.
  static Future<void> initialize({required VoidCallback appRunner}) async {
    if (AppConfig.sentryDsn.isEmpty) {
      if (kDebugMode) debugPrint('Sentry DSN not set. Skipping initialization.');
      appRunner();
      return;
    }

    await SentryFlutter.init(
      (options) {
        options.dsn = AppConfig.sentryDsn;
        options.environment = kDebugMode ? 'development' : 'production';
        options.release = '${AppConfig.appName}@${AppConfig.appVersion}+${AppConfig.appBuildNumber}';
        options.tracesSampleRate = kDebugMode ? 1.0 : 0.2;
        options.profilesSampleRate = kDebugMode ? 1.0 : 0.1;
        options.attachScreenshot = true;
        options.attachViewHierarchy = true;
        options.enableAutoNativeBreadcrumbs = true;
        options.reportPackages = true;
        if (kDebugMode) {
          options.debug = true;
          options.diagnosticLevel = SentryLevel.debug;
        }
      },
      appRunner: appRunner,
    );

    instance._initialized = true;
    if (kDebugMode) debugPrint('Sentry initialized');
  }

  // ─── Capture Exception ───────────────────────────────────────
  Future<void> captureException(
    dynamic throwable, {
    dynamic stackTrace,
    String? hint,
    Map<String, dynamic>? extras,
  }) async {
    if (!_initialized) return;
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
  }

  // ─── Capture Message ─────────────────────────────────────────
  Future<void> captureMessage(String message, {SentryLevel? level}) async {
    if (!_initialized) return;
    await Sentry.captureMessage(message, level: level ?? SentryLevel.info);
  }

  // ─── Set User Context ────────────────────────────────────────
  Future<void> setUser({
    required String id,
    String? username,
    String? email,
  }) async {
    if (!_initialized) return;
    await Sentry.configureScope(
      (scope) => scope.setUser(SentryUser(
        id: id,
        username: username,
        email: email,
      )),
    );
  }

  // ─── Clear User ──────────────────────────────────────────────
  Future<void> clearUser() async {
    if (!_initialized) return;
    await Sentry.configureScope((scope) => scope.setUser(null));
  }

  // ─── Add Breadcrumb ──────────────────────────────────────────
  void addBreadcrumb(String message, {String? category, String? type}) {
    if (!_initialized) return;
    Sentry.addBreadcrumb(Breadcrumb(
      message: message,
      category: category ?? 'app',
      type: type ?? 'navigation',
      timestamp: DateTime.now().toUtc(),
    ));
  }

  bool get isInitialized => _initialized;
}
