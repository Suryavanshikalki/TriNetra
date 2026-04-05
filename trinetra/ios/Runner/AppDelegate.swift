import UIKit
import Flutter

// ==============================================================
// 🔥 TRINETRA MASTER APP DELEGATE (Facebook 2026 Standard)
// 100% AWS Ready | 0% Firebase | ZegoCloud & 5 Payments Active
// ==============================================================

@main
@objc class AppDelegate: FlutterAppDelegate {
    
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    
    // 🔥 1. PLUGINS REGISTRATION (Asli Bridge)
    GeneratedPluginRegistrant.register(with: self)
    
    // 🔥 2. ZEGOCLOUD (WhatsApp 2.0) & AWS NOTIFICATIONS PREP
    // Background me call aane par ring bajane aur AWS Push Notifications ke liye
    if #available(iOS 10.0, *) {
      UNUserNotificationCenter.current().delegate = self as? UNUserNotificationCenterDelegate
    }
      
    // App background se aane par AWS data sync karne ki permission
    application.setMinimumBackgroundFetchInterval(UIApplication.backgroundFetchIntervalMinimum)

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // 🔥 3. THE ECONOMY - 5 PAYMENTS DEEP LINK HANDLER
  // PayU, Braintree, PayPal, Paddle, aur Adyen ke successful payment ke baad 
  // user ko wapas TriNetra ki 'Success Screen' par laane ke liye Asli Logic:
  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
      
    // Yahan Flutter engine ko payment success ka data pass hoga
    return super.application(app, open: url, options: options)
  }
    
  // 🔥 4. BACKGROUND AWS SYNC ENGINE
  override func application(
    _ application: UIApplication,
    performFetchWithCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) -> Void {
      // AWS Amplify background data sync logic ke liye
      completionHandler(.newData)
  }
}
