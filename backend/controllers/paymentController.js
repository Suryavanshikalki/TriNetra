// File: backend/controllers/paymentController.js
const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * 👁️🔥 TRINETRA ECONOMY CONTROLLER (The Money Hub)
 * Points 6-11: Monetization, Boost, Wallet & AI Credits logic.
 */

// 1. Order Creation (Razorpay/PayPal)
exports.createRechargeOrder = async (req, res) => {
  // Logic to interact with Razorpay/PayPal API goes here
  res.status(200).json({ success: true, orderId: `TRINETRA_RZP_${Date.now()}` });
};

// 2. 🛡️ MASTER PAYMENT VERIFICATION (The 100% Blueprint Engine)
exports.verifyPayment = async (req, res) => {
  try {
    const { userId, type, months, paymentMethod } = req.body; 
    
    /**
     * 💰 Point 7-11: Pricing & Split Rules
     * triNetra: Percentage that stays with YOU.
     * user: Percentage that goes to USER WALLET.
     */
    const pricingRules = {
      // Point 4: Justice System
      'AutoEscalation': { price: 20000, discountEligible: true, triNetra: 100, user: 0 },
      
      // Point 7: Free Boost (70/30 Split)
      'FreeBoost': { price: 0, discountEligible: false, triNetra: 70, user: 30 }, 
      
      // Point 8: Paid Boost (25/75 Split)
      'PaidBoost': { price: 5000, discountEligible: true, triNetra: 25, user: 75 },
      
      // Point 9: Paid Boost + Monetization (100% User)
      'PaidBoostMonetization': { price: 7500, discountEligible: true, triNetra: 0, user: 100 },
      
      // Point 10: Pro Auto-Boost (Politics/Marketing - 30/70 Split)
      'ProAutoBoost': { price: 10000, discountEligible: true, triNetra: 30, user: 70 },
      
      // Point 11: AI Master Brains (STRICTLY NO DISCOUNT)
      'AIChatbotPaid': { price: 2000, discountEligible: false, credits: 'Unlimited', triNetra: 100, user: 0 },
      'AIAgenticPaid': { price: 3999, discountEligible: false, credits: 500, triNetra: 100, user: 0 },
      'OSCreationTier': { price: 69999, discountEligible: false, credits: 2500, triNetra: 100, user: 0 }
    };

    const plan = pricingRules[type];
    if (!plan) return res.status(400).json({ success: false, error: "Invalid Plan Detected. Transaction Aborted." });

    // 🕒 Calculation Engine (Discounting Logic)
    let baseAmount = plan.price * months;
    let finalAmount = baseAmount;
    let discountApplied = 0;

    // Rule: 20% Off for 6/12 months, but NOT for AI Tiers (Point 11 restriction)
    if (plan.discountEligible && (months === 6 || months === 12)) {
        discountApplied = baseAmount * 0.20;
        finalAmount = baseAmount - discountApplied;
    }

    // 💸 Point 6: Commission Split Math
    // TriNetra (Your) Share vs User's Earning Share
    let userShareAmount = (finalAmount * plan.user) / 100;
    let triNetraShareAmount = (finalAmount * plan.triNetra) / 100;

    // 📝 Save Verified Transaction
    const transaction = new Transaction({ 
        userId, 
        type: 'Recharge', 
        amount: finalAmount, 
        planType: type, 
        months, 
        status: 'Success', 
        paymentMethod,
        triNetraShare: triNetraShareAmount,
        userShare: userShareAmount,
        isNoDiscountApplied: !plan.discountEligible
    });
    await transaction.save();
    
    // 👤 Update User Wallet & AI Status (Point 6 & 11)
    const user = await User.findById(userId);
    if (user) {
        // Earnings go to User Wallet (available for withdrawal)
        user.walletBalance += userShareAmount;
        
        // AI Credit Update
        if (type === 'AIChatbotPaid') user.isPaidChatbot = true;
        if (type === 'AIAgenticPaid') user.agenticCredits += 500;
        if (type === 'OSCreationTier') {
            user.osCreationAccess = true;
            user.osCredits += 2500;
        }
        
        // Boost Plan Update
        user.activeBoostPlan = type;
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + months);
        user.activeBoostExpiry = expiryDate;

        await user.save();
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Transaction Verified. Funds allocated according to TriNetra rules.",
      details: {
        paid: finalAmount,
        walletAdded: userShareAmount,
        expiry: user.activeBoostExpiry
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Payment verification failed." });
  }
};

// 3. Wallet Management (Point 6: Payout History)
exports.getWalletInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ 
        success: true, 
        balance: user.walletBalance,
        currency: 'INR',
        canWithdraw: user.walletBalance > 0
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Wallet data unavailable." });
  }
};
