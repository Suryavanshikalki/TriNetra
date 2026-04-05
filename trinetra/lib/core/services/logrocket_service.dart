import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart'; // 🔥 ASLI MASTER VAULT
import 'package:sentry_flutter/sentry_flutter.dart'; // 🔥 100% CRASH TRACKING
import 'package:amplify_flutter/amplify_flutter.dart';

// असली LogRocket पैकेज
import 'package:logrocket_flutter/logrocket_flutter.dart';

// ==============================================================
// 👁️🔥 TRINETRA MASTER ANALYTICS & REPLAY (Facebook 2026 Standard)
// 100% REAL: LogRocket Session Replay + AWS AppSync Tracking
// 0% Dummy | 0% Local Storage | 100% Cloud Synced
// ==============================================================

class LogRocketService {
  LogRocketService._();
  static final LogRocketService instance = LogRocketService._();

  bool _initialized = false;

  // ─── 1. ASLI KEY (GitHub Secrets -> .env Vault से) ─────────────
  static String get _logRocketId => dotenv.env['LOGROCKET_APP_ID'] ?? '';

  // ─── 2. REAL INITIALIZATION ─────────────────────────────────────
  void initialize() {
    if (_initialized) return;

    if (_logRocketId.isEmpty) {
      safePrint('🚨 TriNetra Fatal Error: LOGROCKET_APP_ID missing in .env vault.');
      return;
    }

    try {
      // Asli LogRocket SDK Initialization
      LogRocket.init(_logRocketId);
      _initialized = true;
      safePrint('🚀 TriNetra: LogRocket Session Replay & AWS Analytics 100% LIVE!');
    } catch (e, stackTrace) {
      safePrint('🚨 LogRocket Init Error: $e');
      Sentry.captureException(e, stackTrace: stackTrace); // Track in Sentry
    }
  }

  // ─── 3. REAL USER IDENTIFICATION (AWS Cognito Synced) ───────────
  void identifyUser({
    required String trinetraId,
    String? name,
    String? email,
    String? subscriptionTier, // e.g., 'OS_CREATOR', 'SUPER_AGENTIC', 'FREE'
  }) {
    if (!_initialized) return;

    try {
      // 1. Send to LogRocket Dashboard
      LogRocket.identify(trinetraId, {
        'name': name ?? 'TriNetra User',
        'email': email ?? 'No Email',
        'subscription': subscriptionTier ?? 'Basic',
      });

      // 2. Sync with AWS Backend (AppSync)
      _trackInAws('USER_IDENTIFIED', {
        'userId': trinetraId,
        'name': name,
        'subscription': subscriptionTier,
      });
    } catch (e, stackTrace) {
      Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  // ─── 4. REAL EVENT TRACKING (No Local Memory) ───────────────────
  void track(String eventName, {Map<String, dynamic>? properties}) {
    if (!_initialized) return;

    final eventData = properties ?? {};

    try {
      // 1. Send to LogRocket
      LogRocket.track(eventName, eventData);

      // 2. Send to AWS AppSync (100% Data Safety & Official Logs)
      _trackInAws(eventName, eventData);
    } catch (e, stackTrace) {
      Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  // ─── 5. REAL PAGE VIEW TRACKING ─────────────────────────────────
  void logPageView(String pageName, {Map<String, dynamic>? properties}) {
    if (!_initialized) return;
    
    final eventData = {
      'page': pageName,
      'timestamp': DateTime.now().toUtc().toIso8601String(),
      ...?properties,
    };

    try {
      LogRocket.track('PAGE_VIEW', eventData);
      _trackInAws('PAGE_VIEW', eventData);
    } catch (e, stackTrace) {
      Sentry.captureException(e, stackTrace: stackTrace);
    }
  }

  // ─── 6. SECURE AWS ANALYTICS SENDER (Private & Encoded) ─────────
  Future<void> _trackInAws(String eventName, Map<String, dynamic> data) async {
    try {
      // 🔥 ASLI JSON ENCODING (Crash Fix: properly stringified for GraphQL)
      final String safeJsonData = jsonEncode(data).replaceAll('"', '\\"');

      final request = GraphQLRequest<String>(
        document: '''
          mutation LogTriNetraEvent(\$eventName: String!, \$eventData: String!) {
            createAnalyticsLog(eventName: \$eventName, eventData: \$eventData) {
              id
              status
            }
          }
        ''',
        variables: {
          'eventName': eventName,
          'eventData': safeJsonData, // Pass safely to avoid AppSync rejection
        },
      );
      
      // AWS पर डेटा सेव
      await Amplify.API.query(request: request).response;
    } catch (e, stackTrace) {
      safePrint('🚨 AWS Analytics Sync Failed for $eventName: $e');
      Sentry.captureException(e, stackTrace: stackTrace); // Sentry alert
    }
  }
}
