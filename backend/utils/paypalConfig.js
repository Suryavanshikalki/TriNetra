// ==========================================
// TRINETRA BACKEND - FILE 57: utils/paypalConfig.js
// Blueprint: Point 6 (The Economy - PayPal Real Integration)
// 🚨 DEEP SEARCH UPDATE: ES6 FIXED, NO DUMMY KEYS, SYNCED WITH SCREENSHOT 🚨
// ==========================================
import paypal from 'paypal-rest-sdk';

// 1. 🚨 STRICT REAL KEY VALIDATION (From your exact GitHub Screenshot)
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_SECRET; // Screenshot me exactly yahi naam tha

// Gatekeeper Firewall: Agar keys missing hain to server ko alert karo
if (!clientId || !clientSecret) {
    console.error("[TriNetra Economy Firewall] FATAL: PayPal Real Keys Missing from AWS Secrets.");
}

// 2. 🚨 DYNAMIC ENVIRONMENT & CONFIGURATION
paypal.configure({
  // AWS Environment ke hisaab se auto-switch (Testing me 'sandbox', Asli app me 'live')
  'mode': process.env.NODE_ENV === 'production' ? 'live' : 'sandbox', 
  
  'client_id': clientId,
  'client_secret': clientSecret
});

// 3. 🚨 ES6 EXPORT (Matching our entire backend architecture)
export default paypal;
