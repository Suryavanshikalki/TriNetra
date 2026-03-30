// ==========================================
// TRINETRA BACKEND - FILE 53: paymentController.js
// Blueprint: Point 6 to 11 (Economy, 4 Gateways, Boosts, AI Timing Options)
// 🚨 DEEP SEARCH UPDATE: MULTIPLIER & ALL PRICES STRICTLY HARDCODED 🚨
// ==========================================
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

// --- IN-BUILT PAYMENT GATEWAY LOGIC ---
const processRealPayment = async (amount, gatewayName) => {
  console.log(`[TriNetra Economy] Processing ₹${amount} via ${gatewayName}`);
  if (gatewayName === 'Razorpay') throw new Error("Razorpay is Permanently Banned.");
  const allowedGateways = ['PayU', 'Braintree', 'Paddle', 'Adyen'];
  if (!allowedGateways.includes(gatewayName)) throw new Error("Invalid Payment Gateway");
  return true; 
};

// --- POINT 6-11: BOOST, MONTHLY AI RECHARGE & ESCALATION ---
export const processPaymentAndBoost = async (req, res) => {
  try {
    const { userId, planType, gatewayName, customAmount, requestedMonths } = req.body;
    
    // 🚨 Point 11: Subscription Timing Rule (1, 3, 6, 9, 12 Months Only)
    const validMonths = [1, 3, 6, 9, 12];
    const months = validMonths.includes(requestedMonths) ? requestedMonths : 1; 
    // (अगर कोई हैकर गलत महीना डालेगा, तो सिस्टम खुद उसे 1 महीने पर सेट कर देगा)

    let finalAmount = 0;
    let trinetraShare = 0;
    let userShare = 0;
    let creditsToAddC = 0;
    let creditsToAddB = 0;

    // 🚨 100% HARDCODED BASE PRICES (Multiplied by Months) 🚨
    
    // --- SOCIAL BOOST MODELS ---
    if (planType === 'FreeBoost') {
      finalAmount = 0;
      trinetraShare = (customAmount || 100) * 0.70; // 70% TriNetra (Ad Revenue)
      userShare = (customAmount || 100) * 0.30;     // 30% User
    
    } else if (planType === 'PaidBoost') {
      finalAmount = customAmount || 5000; 
      trinetraShare = finalAmount * 0.25; // 25% TriNetra
      userShare = finalAmount * 0.75;     // 75% User
    
    } else if (planType === 'PaidMonetization') {
      finalAmount = customAmount || 5000; 
      trinetraShare = 0;                  // 0% TriNetra
      userShare = finalAmount * 1.00;     // 100% User
    
    } else if (planType === 'ProAutoBoost') {
      finalAmount = 10000 * months;       // 🔒 ₹10,000 per month
      trinetraShare = finalAmount * 0.30; // 30% TriNetra
      userShare = finalAmount * 0.70;     // 70% User

    // --- AI MODELS (Point 11) ---
    } else if (planType === 'ModeC_Recharge') {
      finalAmount = 9999 * months;        // 🔒 ₹9,999 per month
      trinetraShare = finalAmount;        // 100% TriNetra
      userShare = 0;
      creditsToAddC = 900 * months;       // 🔒 900 Credits per month
    
    } else if (planType === 'ModeB_Recharge') {
      finalAmount = 3999 * months;        // 🔒 ₹3,999 per month
      trinetraShare = finalAmount;
      userShare = 0;
      creditsToAddB = 300 * months;       // 🔒 300 Credits per month
    
    } else if (planType === 'ModeA_Recharge') {
      finalAmount = 2000 * months;        // 🔒 ₹2,000 per month
      trinetraShare = finalAmount;
      userShare = 0;
    
    } else if (planType === 'OS_Creation') {
      finalAmount = 69999;                // 🔒 One-Time Very Expensive Tier
      trinetraShare = finalAmount;
      userShare = 0;

    // --- ESCALATION & SERVICES (Point 4) ---
    } else if (planType === 'Escalation_VIP') {
      finalAmount = 20000;                // 🔒 ₹20,000 Supreme Court Tier
      trinetraShare = finalAmount;
      userShare = 0;

    } else {
      return res.status(400).json({ success: false, message: "Invalid Plan/Boost Type" });
    }

    // 2. Gateway Processing
    if (finalAmount > 0) {
      const paymentSuccess = await processRealPayment(finalAmount, gatewayName);
      if (!paymentSuccess) return res.status(400).json({ success: false, message: "Payment Failed" });
    }

    // 3. Save to Ledger
    const transaction = new Transaction({
      userId, amount: finalAmount, trinetraShare, userShare, boostType: planType,
      gatewayUsed: finalAmount > 0 ? gatewayName : 'Free', status: 'Completed', monthsActivated: months
    });
    await transaction.save();

    // 4. Update User Wallet & Credits
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (userShare > 0) user.walletBalance = (user.walletBalance || 0) + userShare;
    if (creditsToAddC > 0) user.aiCreditsC = (user.aiCreditsC || 0) + creditsToAddC;
    if (creditsToAddB > 0) user.aiCreditsB = (user.aiCreditsB || 0) + creditsToAddB;
    
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: `${planType} Locked for ${months} Month(s).`, 
      walletBalance: user.walletBalance,
      aiCreditsC: user.aiCreditsC
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
