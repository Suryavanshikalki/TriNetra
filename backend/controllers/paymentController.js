// File: backend/controllers/paymentController.js
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Razorpay Order
exports.createRechargeOrder = async (req, res) => {
  res.status(200).json({ success: true, orderId: `ORDER_RZP_${Date.now()}` });
};

// PayPal Order (नया जोड़ा गया)
exports.createPayPalOrder = async (req, res) => {
  res.status(200).json({ success: true, orderId: `ORDER_PAYPAL_${Date.now()}` });
};

// Stripe (Standby - बाद के लिए)
exports.createStripeOrder = async (req, res) => {
  res.status(200).json({ success: true, message: "Stripe coming soon in next update!" });
};

exports.verifyPayment = async (req, res) => {
  try {
    const { userId, type, months, amount, paymentMethod } = req.body; // paymentMethod: 'Razorpay' or 'PayPal'
    
    // Save transaction
    const transaction = new Transaction({ 
        userId, type: 'Recharge', amount, planType: type, months, 
        status: 'Success', paymentMethod 
    });
    await transaction.save();
    
    res.status(200).json({ success: true, message: `Payment verified via ${paymentMethod} & Credits updated` });
  } catch (error) {
    res.status(500).json({ success: false, error: "Payment Verification Failed" });
  }
};

exports.getWalletInfo = async (req, res) => {
  try {
    const user = await User.findOne({ trinetraId: req.params.userId });
    res.status(200).json({ success: true, balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, error: "Wallet Fetch Error" });
  }
};
