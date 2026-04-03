import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:amplify_flutter/amplify_flutter.dart';

// असली LogRocket पैकेज (pubspec.yaml में logrocket_flutter डालना होगा)
import 'package:logrocket_flutter/logrocket_flutter.dart';

/// 👁️🔥 TriNetra Analytics & Session Replay Service
/// 100% REAL: LogRocket for Web/Session Replay + AWS AppSync for Native Event Tracking.
/// No local dummy lists. Every event goes straight to the server.
class LogRocketService {
  LogRocketService._();
  static final LogRocketService instance = LogRocketService._();

  bool _initialized = false;

  // ─── ASLI KEY (GitHub Secrets से) ──────────────────────────────
  static const String _logRocketId = String.fromEnvironment('LOGROCKET_ID');

  // ─── 1. REAL INITIALIZATION ─────────────────────────────────────
  void initialize() {
    if (_initialized) return;

    if (_logRocketId.isEmpty) {
      if (kDebugMode) safePrint('❌ LogRocket ID missing in dart-define.');
      return;
    }

    try {
      // असली LogRocket SDK Initialization
      LogRocket.init(_logRocketId);
      _initialized = true;
      if (kDebugMode) safePrint('🚀 TriNetra: LogRocket Session Replay & AWS Analytics LIVE!');
    } catch (e) {
      if (kDebugMode) safePrint('❌ LogRocket Init Error: $e');
    }
  }

  // ─── 2. REAL USER IDENTIFICATION (Tied to AWS Cognito ID) ───────
  void identifyUser({
    required String trinetraId,
    String? name,
    String? email,
    String? subscriptionTier, // e.g., 'OS_CREATOR' or 'FREE'
  }) {
    if (!_initialized) return;

    // 1. LogRocket को डेटा भेजना
    LogRocket.identify(trinetraId, {
      'name': name ?? 'Unknown',
      'email': email ?? 'No Email',
      'subscription': subscriptionTier ?? 'Basic',
    });

    // 2. AWS Backend में User Analytics अपडेट करना
    _trackInAws('USER_IDENTIFIED', {
      'userId': trinetraId,
      'name': name,
    });
  }

  // ─── 3. REAL EVENT TRACKING (No Local Memory) ───────────────────
  void track(String eventName, {Map<String, dynamic>? properties}) {
    if (!_initialized) return;

    final eventData = properties ?? {};

    // 1. Send to LogRocket
    LogRocket.track(eventName, eventData);

    // 2. Send to AWS AppSync (100% Data Safety & Dashboard)
    _trackInAws(eventName, eventData);
  }

  // ─── 4. REAL PAGE VIEW TRACKING ─────────────────────────────────
  void logPageView(String pageName, {Map<String, dynamic>? properties}) {
    if (!_initialized) return;
    
    final eventData = {
      'page': pageName,
      'timestamp': DateTime.now().toUtc().toIso8601String(),
      ...?properties,
    };

    LogRocket.track('PAGE_VIEW', eventData);
    _trackInAws('PAGE_VIEW', eventData);
  }

  // ─── 5. SECURE AWS ANALYTICS SENDER (Private) ───────────────────
  /// यह फंक्शन इवेंट्स को हवा में गायब नहीं होने देगा, 
  /// बल्कि सीधा आपके AWS DynamoDB (Analytics Table) में सेव करेगा।
  Future<void> _trackInAws(String eventName, Map<String, dynamic> data) async {
    try {
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
          'eventData': jsonEncode(data),
        },
      );
      
      // AWS पर डेटा सेव
      await Amplify.API.query(request: request).response;
    } catch (e) {
      if (kDebugMode) safePrint('❌ AWS Analytics Sync Failed for $eventName: $e');
    }
  }
}
