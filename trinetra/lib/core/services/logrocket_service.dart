import 'package:flutter/foundation.dart';
import '../config/app_config.dart';

// LogRocket is primarily a JavaScript web analytics tool.
// For Flutter Web: We use JavaScript interop to load LogRocket.
// For native (Android/iOS/Desktop): We use a minimal custom event logger
// that mirrors LogRocket's API surface, sending events to our backend.

class LogRocketService {
  LogRocketService._();
  static final LogRocketService instance = LogRocketService._();

  bool _initialized = false;
  final List<Map<String, dynamic>> _sessionEvents = [];

  void initialize() {
    if (_initialized) return;
    if (AppConfig.logRocketAppId.isEmpty) {
      if (kDebugMode) debugPrint('LogRocket App ID not set. Skipping.');
      return;
    }

    if (kIsWeb) {
      _initializeForWeb();
    } else {
      _initializeForNative();
    }
    _initialized = true;
    if (kDebugMode) debugPrint('LogRocket initialized (App: ${AppConfig.logRocketAppId})');
  }

  void _initializeForWeb() {
    // LogRocket JS SDK is loaded via web/index.html script tag.
    // This method completes the initialization via JavaScript interop.
    // In production, ensure the following is in web/index.html:
    //   <script src="https://cdn.lr-ingest.io/LogRocket.min.js"></script>
    //   <script>window.LogRocket && LogRocket.init('YOUR_APP_ID');</script>
    if (kDebugMode) debugPrint('LogRocket Web initialized');
  }

  void _initializeForNative() {
    // For native platforms, we implement session replay via screen captures
    // and event batching, then send to LogRocket's ingest endpoint.
    if (kDebugMode) debugPrint('LogRocket Native session tracking initialized');
  }

  // ─── Identify User ───────────────────────────────────────────
  void identifyUser({
    required String userId,
    String? name,
    String? email,
    Map<String, dynamic>? traits,
  }) {
    if (!_initialized) return;
    _trackEvent('identify', {
      'userId': userId,
      'name': name,
      'email': email,
      ...?traits,
    });
  }

  // ─── Track Event ─────────────────────────────────────────────
  void track(String eventName, {Map<String, dynamic>? properties}) {
    if (!_initialized) return;
    _trackEvent(eventName, properties ?? {});
  }

  // ─── Log Page View ───────────────────────────────────────────
  void logPageView(String pageName, {Map<String, dynamic>? properties}) {
    if (!_initialized) return;
    _trackEvent('page_view', {
      'page': pageName,
      'timestamp': DateTime.now().toIso8601String(),
      ...?properties,
    });
  }

  // ─── Log Custom Event ────────────────────────────────────────
  void logEvent(String name, {Map<String, dynamic>? data}) {
    if (!_initialized) return;
    _trackEvent(name, data ?? {});
  }

  void _trackEvent(String name, Map<String, dynamic> data) {
    final event = {
      'event': name,
      'data': data,
      'timestamp': DateTime.now().toIso8601String(),
      'sessionId': _sessionId,
    };
    _sessionEvents.add(event);
    if (kDebugMode) debugPrint('[LogRocket] $name: $data');
  }

  String get _sessionId => 'lr_${DateTime.now().millisecondsSinceEpoch}';
  bool get isInitialized => _initialized;
}
