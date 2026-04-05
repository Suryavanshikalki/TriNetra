# ==============================================================
# 🔥 TRINETRA FLUTTER CORE (Tumhara Original Code - 100% Safe)
# ==============================================================
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }

# ==============================================================
# 🚨 TRINETRA MASTER RULE APPLIED: 
# Firebase, Razorpay, aur Stripe hamesha ke liye DELETE ho chuke hain!
# ==============================================================

# ==============================================================
# 🔥 1. THE ENGINE: AWS FULL SUPPORT (Frontend + Backend)
# ==============================================================
-keep class com.amazonaws.** { *; }
-keep class software.amazon.** { *; }
-dontwarn com.amazonaws.**
-dontwarn software.amazon.**

# ==============================================================
# 🔥 2. THE ECONOMY: PAYMENT GATEWAYS (Point 6 - Asli 100%)
# ==============================================================
# PayU India
-keep class com.payu.** { *; }
-dontwarn com.payu.**

# Braintree + PayPal
-keep class com.braintreepayments.api.** { *; }
-keep class com.paypal.** { *; }
-dontwarn com.braintreepayments.**

# Adyen
-keep class com.adyen.** { *; }
-dontwarn com.adyen.**

# Paddle
-keep class com.paddle.** { *; }
-dontwarn com.paddle.**

# ==============================================================
# 🔥 3. 70/30 MONETIZATION & ADS (Point 6)
# ==============================================================
# AdMob (Google Ads API chahiye AdMob ke liye, Firebase nhi)
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.android.ump.** { *; }

# AppLovin
-keep class com.applovin.** { *; }
-dontwarn com.applovin.**

# Meta Ads (Facebook Audience Network)
-keep class com.facebook.ads.** { *; }

# ==============================================================
# 🔥 4. WHATSAPP 2.0 CALLING (ZegoCloud - Point 5)
# ==============================================================
-keep class im.zego.** { *; }
-dontwarn im.zego.**

# ==============================================================
# 🔥 5. TRACKING & SECURITY (Crashlytics deleted -> Sentry/LogRocket)
# ==============================================================
# Sentry (Tumhara Original Code)
-keep class io.sentry.** { *; }

# LogRocket
-keep class com.logrocket.** { *; }
-dontwarn com.logrocket.**
