package com.example.trinetra

// 🔥 TRINETRA UPGRADE: Normal Activity ki jagah FragmentActivity
// (Ye sabhi Payment Gateways: PayU India, Braintree + PayPal, Paddle, aur Adyen sabhi ke liye compulsory hai)
import io.flutter.embedding.android.FlutterFragmentActivity
import android.os.Bundle
import android.view.WindowManager
import android.os.Build // 🔥 JODA GAYA: Naye Android phones ka version check karne ke liye

class MainActivity : FlutterFragmentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // =========================================================
        // 🔥 TRINETRA MASTER FEATURE: WHATSAPP 2.0 CALLING WAKE-UP
        // Blueprint Point 5: Incoming ZegoCloud Call aane par, 
        // agar phone lock hai to screen khud on ho jayegi (Just like real WhatsApp)
        // =========================================================
        
        // 1. 🔥 JODA GAYA: Naye Android Devices (Android 8.1+) ke liye Asli 2026 Code
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        }
        
        // 2. Tumhara purana code (Purane phones ke liye aur Screen On rakhne ke liye - 100% Safe)
        window.addFlags(
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
            or WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            or WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
        )
    }
}
