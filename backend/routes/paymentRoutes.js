// File: backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// ==========================================
// 🛡️ PURANA CODE (BINA KUCHH HATAYE)
// ==========================================

// Razorpay Routes
router.post('/recharge', paymentController.createRechargeOrder);

// PayPal Route (नया जोड़ा गया)
router.post('/recharge/paypal', paymentController.createPayPalOrder);

// Stripe Standby Route (नया जोड़ा गया)
router.post('/recharge/stripe', paymentController.createStripeOrder);

// ==========================================
// 🚀 NAYA CODE: MASTER REVENUE ROUTES (12-Point Blueprint)
// ==========================================

/**
 * 👁️🔥 TRI-NETRA SPECIAL ROUTES
 * ये रास्ते खास तौर पर आपके ₹20,000 (Escalation) और ₹69,999 (OS Builder) 
 * जैसे हाई-वैल्यू ट्रांजेक्शन के लिए तैयार किए गए हैं।
 */

// Verify Payment (Yahin par 20% Discount aur 70/30 Commission calculate hota hai)
router.post('/verify', paymentController.verifyPayment);

// Get User Wallet Balance (User apna 30%, 75% ya 100% hissa yahan se dekhega)
router.get('/wallet/:userId', paymentController.getWalletInfo);

// 🚨 AUTO-ESCALATION ROUTE (Point 4: Justice System - ₹20,000/mo)
// Jab koi complaint system ko PM/Supreme Court tak le jana chahe
router.post('/activate-escalation', paymentController.verifyPayment); 

// 🚀 BOOST & MONETIZATION ROUTE (Point 7, 8, 9, 10)
// For Free Boost, Paid Boost (₹5000), Paid+Monetize (₹7500) and Pro (₹15000)
router.post('/subscribe-boost', paymentController.verifyPayment);

// 🧠 MASTER AI RECHARGE ROUTE (Point 11: AI Mode A & B - ₹2000, ₹3999, ₹69999)
router.post('/recharge-ai', paymentController.verifyPayment);

module.exports = router;
