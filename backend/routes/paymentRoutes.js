// ==========================================
// TRINETRA BACKEND - FILE 51: routes/paymentRoutes.js
// Blueprint: Point 6-10 (The Economy, 4 Boost Models & AI Credits)
// 🚨 DEEP SEARCH UPDATE: ANTI-FRAUD WEBHOOK & WALLET ADDED 🚨
// ==========================================
import express from 'express';
import { 
    processPayment, 
    applyBoost, 
    getWalletBalance, 
    verifyPaymentWebhook 
} from '../controllers/paymentController.js';
import { requireAuth } from '../middlewares/authMiddleware.js'; // The Gatekeeper Shield

const router = express.Router();

// ==========================================
// 💰 TRINETRA ECONOMY ENGINE (NO RAZORPAY)
// ==========================================

// 1. Get Wallet Balance (ऐप में AI Credits और Boost Status दिखाने के लिए)
router.get('/wallet', requireAuth, getWalletBalance);

// 2. Initiate Payment (Strictly PayU, PayPal, Braintree, Paddle, Adyen)
// ✅ requireAuth सुनिश्चित करेगा कि पेमेंट सिर्फ असली यूज़र ही कर सके
router.post('/pay', requireAuth, processPayment);

// 3. Apply 4 Boost Models (Normal, Gold, Diamond, Super App Mode)
router.post('/boost', requireAuth, applyBoost);

// 4. Server-to-Server Webhook (🚨 ANTI-FRAUD MASTER SWITCH)
// ✅ इसमें requireAuth नहीं लगता, क्योंकि यह हिट सीधे PayPal/PayU के सर्वर से AWS पर आती है।
// `express.raw` का इस्तेमाल सिग्नेचर (Cryptographic verification) मैच करने के लिए किया जाता है।
router.post('/webhook', express.raw({ type: 'application/json' }), verifyPaymentWebhook);

export default router;
