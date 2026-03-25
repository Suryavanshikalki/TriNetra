// File: backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create Razorpay Order for AI/Boost Recharge
router.post('/recharge', paymentController.createRechargeOrder);

// Verify Payment and Add Credits/Boost Plan
router.post('/verify', paymentController.verifyPayment);

// Get User Wallet Balance & Payout History
router.get('/wallet/:userId', paymentController.getWalletInfo);

module.exports = router;
