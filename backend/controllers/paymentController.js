import User from '../models/User.js';

// Point 6: The 5 Officially Sanctioned Gateways ONLY
const ALLOWED_GATEWAYS = ['PayU', 'Braintree', 'Paddle', 'Adyen', 'PayPal'];

export const processPayment = async (req, res) => {
  try {
    const { userId, amount, gateway, purpose } = req.body;

    // 🚨 STRICT RULE: Reject Razorpay completely
    if (gateway.toLowerCase() === 'razorpay') {
      return res.status(403).json({ success: false, message: "Razorpay is PERMANENTLY banned on TriNetra." });
    }

    if (!ALLOWED_GATEWAYS.includes(gateway)) {
      return res.status(400).json({ success: false, message: "Invalid Payment Gateway selected." });
    }

    const user = await User.findOne({ trinetraId: userId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    // Wallet में असली पैसा ऐड करें
    user.walletBalance += amount;
    
    await user.save();
    console.log(`[ECONOMY] ₹${amount} added to ${userId} via ${gateway}`);

    res.status(200).json({ success: true, balance: user.walletBalance, message: "Payment Successful" });
  } catch (error) {
    console.error(`[ECONOMY CRASH] ${error.message}`);
    res.status(500).json({ success: false, message: "Payment Processing Failed" });
  }
};

// Point 7 to 10: 4 Boost Models (Revenue Split)
export const applyBoost = async (req, res) => {
  try {
    const { userId, postId, boostType, amountPaid } = req.body;
    let trinetraShare = 0;
    let userShare = 0;

    // Point 7: Free Boost (70% TriNetra, 30% User)
    if (boostType === 'Free_Boost') {
      trinetraShare = 70; 
      userShare = 30;     
    } 
    // Point 8: Paid Boost (25% TriNetra, 75% User)
    else if (boostType === 'Paid_Boost') {
      trinetraShare = 25; 
      userShare = 75;     
      await deductFromWallet(userId, amountPaid);
    } 
    // Point 9: Paid Boost + Monetization (100% User)
    else if (boostType === 'Paid_Monetization') {
      trinetraShare = 0;  
      userShare = 100;    
      await deductFromWallet(userId, amountPaid);
    } 
    // Point 10: Pro Auto-Boost (30% TriNetra, 70% User)
    else if (boostType === 'Pro_Auto') {
      trinetraShare = 30; 
      userShare = 70;     
      await deductFromWallet(userId, 10000); // Fixed ₹10,000 deduct
    }

    console.log(`[BOOST APPLIED] ${boostType} active. Share: Trinetra ${trinetraShare}% / User ${userShare}%`);

    res.status(200).json({ 
      success: true, 
      message: `${boostType} activated successfully.`,
      revenueSplit: { trinetra: trinetraShare, user: userShare }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Internal Logic: वॉलेट से पैसे काटने का सिस्टम
const deductFromWallet = async (userId, amount) => {
  const user = await User.findOne({ trinetraId: userId });
  if (user.walletBalance < amount) throw new Error("Insufficient Wallet Balance! Please recharge.");
  user.walletBalance -= amount;
  await user.save();
};
