// File: backend/utils/razorpayConfig.js
const Razorpay = require('razorpay');

// Use your actual keys here when deploying
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_TriNetraSecretKey',
  key_secret: process.env.RAZORPAY_SECRET || 'TriNetraSuperAppSecret'
});

module.exports = razorpayInstance;
