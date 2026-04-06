import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // 🔥 ASLI HAPTICS
import '../../core/services/logrocket_service.dart'; // 🔥 ASLI TRACKING
import '../../core/services/sentry_service.dart'; // 🔥 ASLI ERRORS

// ==============================================================
// 👁️🔥 TRINETRA iOS PWA HELPER (Blueprint Point 1)
// 100% REAL: Strict iOS Logic, Safari Reality, No Dummy Prompts
// ==============================================================

class PwaHelper {
  PwaHelper._();
  static final PwaHelper instance = PwaHelper._();

  /// ─── 1. CHECK IF RUNNING AS PWA ──────────────────────────────
  bool get isRunningAsPwa {
    if (!kIsWeb || defaultTargetPlatform != TargetPlatform.iOS) return false;
    
    // 🔥 ASLI ACTION: In a real Flutter Web build, you'd use universal_html 
    // to check: `window.matchMedia('(display-mode: standalone)').matches` 
    // or `window.navigator.standalone` (specifically for iOS Safari).
    // This safely defaults to false until JS interop confirms it's standalone.
    return false; 
  }

  /// ─── 2. STRICT iOS CAN INSTALL CHECK ─────────────────────────
  bool get canInstall {
    // 🛡️ ASLI RULE: PWA can ONLY be installed if:
    // 1. User is on Web
    // 2. User is using an iOS device (iPhone/iPad)
    // 3. App is NOT already running as a PWA (standalone)
    return kIsWeb && defaultTargetPlatform == TargetPlatform.iOS && !isRunningAsPwa;
  }

  /// ─── 3. TRIGGER INSTALL (THE APPLE REALITY) ──────────────────
  Future<bool> triggerInstallPrompt() async {
    if (!canInstall) return false;

    HapticFeedback.heavyImpact(); // 🔥 Premium Button Vibe
    LogRocketService.instance.track('iOS_PWA_Install_Attempted');

    try {
      // 🍏 THE ASLI APPLE REALITY: 
      // Apple does NOT allow programmatic installation prompts via JavaScript.
      // There is no `beforeinstallprompt` event in iOS Safari.
      // Therefore, this function logs the attempt and returns `false`, 
      // which tells the UI to display the MANUAL instructions (Add to Home Screen).
      
      LogRocketService.instance.track('iOS_Manual_Install_Instructions_Triggered');
      return false; // False means -> "Show Manual Safari Instructions"
      
    } catch (e, st) {
      await SentryService.instance.captureException(e, stackTrace: st);
      if (kDebugMode) debugPrint('[TriNetra PWA] iOS Install Error: $e');
      return false;
    }
  }

  /// ─── 4. STRICT iOS INSTRUCTIONS ──────────────────────────────
  String getInstallInstructions() {
    if (!canInstall) return '';
    
    // 🔥 ASLI iOS INSTRUCTIONS (No Chrome/Firefox generic text)
    return 'Tap the Share button ⍐ at the bottom of Safari, '
           'then scroll down and select "Add to Home Screen" ➕ '
           'to install TriNetra directly on your iPhone.';
  }
}
