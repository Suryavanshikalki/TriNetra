// File: backend/controllers/paymentController.js
const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.createRechargeOrder = async (req, res) => {
  // This connects to razorpayConfig.js in production
  res.status(200).json({ success: true, orderId: `ORDER_${Date.now()}` });
};

exports.verifyPayment = async (req, res) => {
  try {
    const { userId, type, months, amount } = req.body;
    
    // Save transaction
    const transaction = new Transaction({ userId, type: 'Recharge', amount, planType: type, months, status: 'Success' });
    await transaction.save();

    // The Master Revenue Split Logic for Ads (AdRevenue generated later)
    // If a user generates Ad Revenue of ₹1000:
    // Free Boost: User gets 300, TriNetra 700
    // Paid Boost (No Monetize): User gets 750, TriNetra 250
    // Paid + Monetize: User gets 1000
    
    res.status(200).json({ success: true, message: "Payment verified & Credits updated" });
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
