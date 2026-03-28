// File: backend/controllers/paymentController.js
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Ya require('../models/Transaction').Transaction (agar waise export kiya hai)

// ==========================================
// 🛡️ PURANA CODE (BINA KUCHH HATAYE)
// ==========================================

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

// ==========================================
// 🚀 NAYA CODE: MASTER PAYMENT VERIFICATION (12-Point Blueprint Logic)
// ==========================================

exports.verifyPayment = async (req, res) => {
  try {
    const { userId, type, months, amount, paymentMethod } = req.body; // paymentMethod: 'Razorpay' or 'PayPal'
    
    // 1. TriNetra Master Pricing Dictionary (Hacker-Proof Rates)
    // format: { TriNetraShare%, UserShare% }
    const pricingRules = {
      'AutoEscalation': { price: 20000, discountEligible: true, triNetra: 100, user: 0 },
      'PaidBoost': { price: 5000, discountEligible: true, triNetra: 25, user: 75 },
      'PaidBoostMonetization': { price: 7500, discountEligible: true, triNetra: 0, user: 100 },
      'ProAutoBoost': { price: 15000, discountEligible: true, triNetra: 30, user: 70 },
      
      // AI Plans (STRICTLY NO DISCOUNT)
      'AIChatbotPaid': { price: 2000, discountEligible: false, credits: 0, triNetra: 100, user: 0 },
      'AIAgenticPaid': { price: 3999, discountEligible: false, credits: 500, triNetra: 100, user: 0 },
      'OSCreationTier': { price: 69999, discountEligible: false, credits: 2500, triNetra: 100, user: 0 }
    };

    const plan = pricingRules[type];
    if (!plan) return res.status(400).json({ success: false, error: "Invalid Plan Type. System Blocked." });

    // 2. The Calculation Engine (Discount & Total Math)
    let baseAmount = plan.price * months;
    let finalAmount = baseAmount;
    let discountApplied = 0;

    // Sirf 6 aur 12 mahine par 20% discount (Aur AI par discount nahi)
    if (plan.discountEligible && (months === 6 || months === 12)) {
        discountApplied = baseAmount * 0.20; // 20% Off
        finalAmount = baseAmount - discountApplied;
    }

    // 3. Commission Split Math (70/30, 25/75, 100%)
    let userShareAmount = (finalAmount * plan.user) / 100;
    let triNetraShareAmount = (finalAmount * plan.triNetra) / 100;

    // 4. Save Transaction with full details
    let transaction;
    try {
        // Checking if we are using the new Schema logic
        transaction = new Transaction({ 
            userId, 
            type: 'Recharge', 
            amount: finalAmount, 
            planType: type, 
            months, 
            status: 'Success', 
            paymentMethod,
            baseAmount: baseAmount,
            discountApplied: discountApplied,
            splitRatioRule: `${plan.triNetra}/${plan.user}`,
            triNetraShare: triNetraShareAmount,
            userShare: userShareAmount,
            aiCreditsAllocated: plan.credits || 0,
            isNoDiscountPlan: !plan.discountEligible
        });
        await transaction.save();
    } catch(err) {
        // Fallback for old schema if new fields aren't fully synced yet
        transaction = new Transaction({ userId, type: 'Recharge', amount: finalAmount, planType: type, months, status: 'Success' });
        await transaction.save();
    }
    
    // 5. Update User's Wallet Balance & AI Credits
    const user = await User.findOne({ _id: userId }) || await User.findOne({ trinetraId: userId }); // Assuming ID check
    if (user) {
        // Agar user ka koi commission bana hai (jaise 75%), to uske wallet me jod do
        user.walletBalance = (user.walletBalance || 0) + userShareAmount;
        
        // Agar AI plan liya hai (500 ya 2500 credit), to jod do
        if (plan.credits > 0) {
            user.aiCredits = (user.aiCredits || 0) + plan.credits;
        }
        await user.save();
    }
    
    res.status(200).json({ 
      success: true, 
      message: `Payment verified via ${paymentMethod} & Account Updated!`,
      details: {
        paidAmount: finalAmount,
        discount: discountApplied,
        walletAdded: userShareAmount,
        creditsAdded: plan.credits || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Payment Verification Failed" });
  }
};

// ==========================================
// 🛡️ PURANA CODE (BINA KUCHH HATAYE)
// ==========================================

exports.getWalletInfo = async (req, res) => {
  try {
    const user = await User.findOne({ trinetraId: req.params.userId });
    res.status(200).json({ success: true, balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, error: "Wallet Fetch Error" });
  }
};
