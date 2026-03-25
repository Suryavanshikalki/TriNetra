// File: backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Razorpay Route
router.post('/recharge', paymentController.createRechargeOrder);

// PayPal Route (नया जोड़ा गया)
router.post('/recharge/paypal', paymentController.createPayPalOrder);

// Stripe Standby Route (नया जोड़ा गया)
router.post('/recharge/stripe', paymentController.createStripeOrder);

// Verify Payment
router.post('/verify', paymentController.verifyPayment);

// Get User Wallet Balance
router.get('/wallet/:userId', paymentController.getWalletInfo);

module.exports = router;
