// ==========================================
// TRINETRA BACKEND - FILE 63: models/Transaction.js
// Blueprint: Point 6 to 11 (The Economy, Wallet & AI Pricing)
// 🚨 DEEP SEARCH UPDATE: 100% BLUEPRINT PRICES & NO RAZORPAY 🚨
// ==========================================
import mongoose from 'mongoose';

// 👁️🔥 TriNetra Master Pricing & Commission Dictionary (100% Locked with Blueprint)
export const TriNetraPricing = {
  // --- Social Boost Models (Point 7-10) ---
  FreeBoost: { pricePerMonth: 0, split: { triNetra: 70, user: 30 } },
  PaidBoost: { pricePerMonth: 10000, split: { triNetra: 25, user: 75 }, discountEligible: true },
  PaidBoostMonetization: { pricePerMonth: 20000, split: { triNetra: 0, user: 100 }, discountEligible: true },
  ProAutoBoost: { pricePerMonth: 28000, split: { triNetra: 30, user: 70 }, discountEligible: true },
  
  // --- Auto-Escalation Justice Engine (Point 4) ---
  AutoEscalation: { pricePerMonth: 30000, split: { triNetra: 100, user: 0 }, discountEligible: true },
  
  // --- AI Master Plans (Point 11 - STRICTLY NO DISCOUNT) ---
  AIChatbotPaid: { pricePerMonth: 2499, discountEligible: false, type: 'Unlimited_Meta_Level' },
  AIAgenticPaid: { pricePerMonth: 2999, discountEligible: false, credits: 300, type: 'Manus_Agentic_Level' },
  ModeC_SuperAgentic: { pricePerMonth: 9999, discountEligible: false, credits: 900, type: 'Human_Brain_Level' },
  OSCreationTier: { pricePerMonth: 79999, discountEligible: false, credits: 5000, type: 'Ultimate_OS_Maker' }
};

const TransactionSchema = new mongoose.Schema({
  // ==========================================
  // 🛡️ CORE IDENTIFIERS
  // ==========================================
  userId: { type: String, required: true, index: true }, // TriNetra ID
  
  type: { 
      type: String, 
      enum: ['Recharge', 'AdRevenue', 'Withdrawal', 'BoostPayment', 'AIPayment', 'AutoEscalationPayment'],
      required: true
  }, 
  
  planType: { type: String, required: true }, // AIChatbotPaid, ProAutoBoost, ModeC_SuperAgentic etc.
  months: { type: Number, enum: [1, 3, 6, 9, 12], default: 1 }, 
  
  // ==========================================
  // 🚀 THE ECONOMY ENGINE (Money Flow)
  // ==========================================
  amount: { type: Number, required: true }, // Final amount deducted from Gateway
  baseAmount: { type: Number, required: true }, // Amount before any discounts
  discountApplied: { type: Number, default: 0 }, 
  
  // Split Logic (Kiske bank/wallet me kitna paisa gaya)
  splitRatioRule: { type: String }, // e.g., "70/30", "25/75", "100/0"
  triNetraShare: { type: Number, default: 0 }, // Profit mapped direct to TriNetra Bank Account
  userShare: { type: Number, default: 0 },     // Profit going to User's App Wallet
  
  // ==========================================
  // 🤖 MASTER AI CREDITS TRACKER
  // ==========================================
  aiCreditsAllocated: { type: Number, default: 0 }, // e.g., 300, 900, 5000
  isNoDiscountPlan: { type: Boolean, default: false }, // Strict block for AI discounts
  
  // ==========================================
  // 💳 REAL PAYMENT GATEWAY LOGIC (Razorpay Banned)
  // ==========================================
  status: { type: String, enum: ['Pending', 'Success', 'Failed', 'Refunded'], default: 'Pending' },
  
  gatewayName: { 
      type: String, 
      enum: ['PayU', 'Braintree', 'PayPal', 'Paddle', 'Adyen', 'UPI', 'Free_Ad_Network'],
      required: true
  },
  gatewayTransactionId: { type: String, unique: true, sparse: true }, // Real Txn ID from Paddle/PayPal etc.

}, { timestamps: true });

// 🚨 FAST INDEXING FOR POINT 6 (Wallet & Payment History)
// Jab user apna "Payment History" kholega, to ye index use 1 millisecond me data dega
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ gatewayTransactionId: 1 });

export default mongoose.model('Transaction', TransactionSchema);
