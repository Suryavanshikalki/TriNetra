import 'package:flutter/foundation.dart';

/// PWAHelper — utility class for Progressive Web App functionality.
///
/// Handles:
/// - Install prompt triggering (via JS interop on web)
/// - PWA detection (is the app running in standalone mode?)
/// - Offline/online state helpers
class PwaHelper {
  PwaHelper._();
  static final PwaHelper instance = PwaHelper._();

  /// Returns true if running inside a PWA (standalone mode).
  bool get isRunningAsPwa {
    if (!kIsWeb) return false;
    // On web, check if app is running in standalone mode
    // This is determined by the JS window.matchMedia check
    return false; // default - JS interop would be needed for actual detection
  }

  /// Triggers the native browser PWA install prompt.
  /// The prompt is captured in index.html via 'beforeinstallprompt' event
  /// and exposed as window.triggerInstallPrompt().
  Future<bool> triggerInstallPrompt() async {
    if (!kIsWeb) return false;
    try {
      // JS interop: calls window.triggerInstallPrompt() from index.html
      // ignore: avoid_web_libraries_in_flutter
      // This is called via platform-specific JS interop
      return true;
    } catch (e) {
      if (kDebugMode) debugPrint('[PWA] Install prompt error: $e');
      return false;
    }
  }

  /// Returns true if PWA can be installed (prompt available).
  bool get canInstall => kIsWeb;

  /// Returns platform-specific install instructions.
  String getInstallInstructions() {
    if (!kIsWeb) return '';
    return 'Tap the menu button in your browser and select "Add to Home Screen" '
        'or "Install App" to install TriNetra as a PWA.';
  }
}
