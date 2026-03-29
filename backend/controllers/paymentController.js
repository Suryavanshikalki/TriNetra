// ==========================================
// TRINETRA BACKEND - ECONOMY CONTROLLER (File 11)
// Blueprint: Point 6 to 10 (4 Boosts, 5 Gateways, No Razorpay)
// ==========================================
import User from '../models/User.js';

// The 5 Officially Sanctioned Gateways
const ALLOWED_GATEWAYS = ['PayU', 'Braintree', 'Paddle', 'Adyen', 'PayPal'];

export const processPayment = async (req, res) => {
  try {
    const { userId, amount, gateway, purpose } = req.body;

    // Strict Rule: Reject Razorpay completely
    if (gateway.toLowerCase() === 'razorpay') {
      return res.status(403).json({ success: false, message: "Razorpay is PERMANENTLY banned on TriNetra." });
    }

    if (!ALLOWED_GATEWAYS.includes(gateway)) {
      return res.status(400).json({ success: false, message: "Invalid Payment Gateway selected." });
    }

    // In a real app, you hit the actual Gateway API here (e.g., PayPal SDK)
    // Assuming payment is successful from the gateway:

    const user = await User.findOne({ trinetraId: userId });
    
    // Log Transaction & Add to User Wallet
    user.walletBalance += amount;
    user.transactions.push({
      amount: amount,
      type: 'credit',
      gateway: gateway,
      purpose: purpose || 'Wallet Deposit',
      date: new Date()
    });

    await user.save();
    console.log(`[ECONOMY] ₹${amount} added to ${userId} via ${gateway}`);

    res.status(200).json({ success: true, balance: user.walletBalance, message: "Payment Successful" });
  } catch (error) {
    console.error(`[ECONOMY CRASH] ${error.message}`);
    res.status(500).json({ success: false, message: "Payment Processing Failed" });
  }
};

// Point 7 to 10: The 4 Boost Models Logic
export const applyBoost = async (req, res) => {
  try {
    const { userId, postId, boostType, amountPaid } = req.body;
    let trinetraShare = 0;
    let userShare = 0;

    // Model 1: Free Boost (Point 7)
    if (boostType === 'Free_Boost') {
      trinetraShare = 70; // 70% to Me
      userShare = 30;     // 30% to User
    } 
    // Model 2: Paid Boost (Point 8)
    else if (boostType === 'Paid_Boost') {
      trinetraShare = 25; // 25% to Me
      userShare = 75;     // 75% to User
      // Deduct from wallet
      await deductFromWallet(userId, amountPaid);
    } 
    // Model 3: Paid Boost + Monetization (Point 9)
    else if (boostType === 'Paid_Monetization') {
      trinetraShare = 0;  // 0% to Me
      userShare = 100;    // 100% to User
      await deductFromWallet(userId, amountPaid);
    } 
    // Model 4: Pro Auto-Boost ₹10,000/mo (Point 10)
    else if (boostType === 'Pro_Auto') {
      trinetraShare = 30; // 30% to Me
      userShare = 70;     // 70% to User
      await deductFromWallet(userId, amountPaid); // e.g., ₹10000
    }

    console.log(`[BOOST APPLIED] ${boostType} active on post ${postId}. Share: Trinetra ${trinetraShare}% / User ${userShare}%`);

    res.status(200).json({ 
      success: true, 
      message: `${boostType} activated successfully.`,
      revenueSplit: { trinetra: trinetraShare, user: userShare }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper for deducting wallet
const deductFromWallet = async (userId, amount) => {
  const user = await User.findOne({ trinetraId: userId });
  if (user.walletBalance < amount) throw new Error("Insufficient Wallet Balance");
  user.walletBalance -= amount;
  user.transactions.push({ amount, type: 'debit', gateway: 'Internal Wallet', purpose: 'Boost' });
  await user.save();
};
