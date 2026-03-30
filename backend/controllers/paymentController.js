// ==========================================
// TRINETRA BACKEND - FILE 9: controllers/paymentController.js
// Blueprint: Point 6-10 (Economy, 5 Gateways, Razorpay BANNED)
// 100% LINKED WITH TRANSACTION MODEL
// ==========================================
import User from '../models/User.js';
import Transaction, { TriNetraPricing } from '../models/Transaction.js';

// Point 6: The 5 Officially Sanctioned Gateways ONLY
const ALLOWED_GATEWAYS = ['PayU', 'Braintree', 'Paddle', 'Adyen', 'PayPal', 'Internal_Wallet'];

export const processPayment = async (req, res) => {
  try {
    const { userId, amount, gateway, planType, gatewayTransactionId } = req.body;

    // 🚨 STRICT RULE: Reject Razorpay completely
    if (gateway.toLowerCase() === 'razorpay') {
      return res.status(403).json({ success: false, message: "Razorpay is PERMANENTLY banned on TriNetra." });
    }

    if (!ALLOWED_GATEWAYS.includes(gateway)) {
      return res.status(400).json({ success: false, message: "Invalid Payment Gateway selected." });
    }

    const user = await User.findOne({ trinetraId: userId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    // Wallet Deposit Logic
    if (planType === 'Wallet_Deposit') {
      user.walletBalance += amount;
      await user.save();
    }

    // असली ट्रांज़ैक्शन हिस्ट्री सेव करें (Transaction.js में)
    const newTransaction = new Transaction({
      userId,
      gateway,
      gatewayTransactionId: gatewayTransactionId || `TRN-TXN-${Date.now()}`,
      amount,
      planType,
      status: 'Success'
    });
    
    await newTransaction.save();
    console.log(`[ECONOMY] ₹${amount} processed for ${userId} via ${gateway}`);

    res.status(200).json({ success: true, balance: user.walletBalance, transactionId: newTransaction._id });
  } catch (error) {
    console.error(`[ECONOMY CRASH] ${error.message}`);
    res.status(500).json({ success: false, message: "Payment Processing Failed" });
  }
};

// Point 7 to 10: 4 Boost Models (Revenue Split Engine)
export const applyBoost = async (req, res) => {
  try {
    const { userId, postId, boostType, amountPaid } = req.body;
    
    let triNetraShare = 0;
    let userShare = 0;
    let splitRule = "0/0";

    const user = await User.findOne({ trinetraId: userId });

    // Point 7: Free Boost (70% TriNetra, 30% User)
    if (boostType === 'Free_Boost') {
      triNetraShare = 70; 
      userShare = 30;
      splitRule = "70/30";
    } 
    // Point 8: Paid Boost (25% TriNetra, 75% User)
    else if (boostType === 'Paid_Boost') {
      triNetraShare = (amountPaid * 25) / 100; 
      userShare = (amountPaid * 75) / 100;
      splitRule = "25/75";
      await deductFromWallet(user, amountPaid);
    } 
    // Point 9: Paid Boost + Monetization (100% User)
    else if (boostType === 'Paid_Monetization') {
      triNetraShare = 0;  
      userShare = amountPaid;
      splitRule = "0/100";
      await deductFromWallet(user, amountPaid);
    } 
    // Point 10: Pro Auto-Boost (30% TriNetra, 70% User)
    else if (boostType === 'Pro_Auto') {
      const fixedPrice = TriNetraPricing.ProAutoBoost.pricePerMonth; // 10000
      triNetraShare = (fixedPrice * 30) / 100; 
      userShare = (fixedPrice * 70) / 100;
      splitRule = "30/70";
      await deductFromWallet(user, fixedPrice);
    }

    // ट्रांज़ैक्शन डेटाबेस में असली 70/30 का गणित सेव करें
    const boostTxn = new Transaction({
      userId,
      gateway: 'Internal_Wallet',
      amount: amountPaid || 0,
      planType: boostType,
      status: 'Success',
      splitRatioRule: splitRule,
      triNetraShare,
      userShare
    });

    await boostTxn.save();
    console.log(`[BOOST APPLIED] ${boostType} active. Share Rule: ${splitRule}`);

    res.status(200).json({ 
      success: true, 
      message: `${boostType} activated successfully.`,
      splitRule: splitRule,
      walletBalance: user.walletBalance
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Helper: वॉलेट से पैसे काटने का सिस्टम
const deductFromWallet = async (user, amount) => {
  if (user.walletBalance < amount) {
    throw new Error(`Insufficient Wallet Balance! Need ₹${amount} to activate this feature.`);
  }
  user.walletBalance -= amount;
  await user.save();
};
