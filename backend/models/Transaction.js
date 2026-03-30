// ==========================================
// TRINETRA BACKEND - FILE: models/Transaction.js
// 100% User's Exact Pricing + Mode C Added
// ==========================================
import mongoose from 'mongoose';

// 👁️🔥 TriNetra Master Pricing & Commission Dictionary (Locked Configuration)
export const TriNetraPricing = {
  // Auto-Escalation & Boost Plans (Discount Eligible)
  AutoEscalation: { pricePerMonth: 20000, discountEligible: true },
  FreeBoost: { pricePerMonth: 0, split: { triNetra: 70, user: 30 } },
  PaidBoost: { pricePerMonth: 5000, split: { triNetra: 25, user: 75 }, discountEligible: true },
  PaidBoostMonetization: { pricePerMonth: 7500, split: { triNetra: 0, user: 100 }, discountEligible: true },
  ProAutoBoost: { pricePerMonth: 15000, split: { triNetra: 30, user: 70 }, discountEligible: true },
  
  // AI Master Plans (STRICTLY NO DISCOUNT)
  AIChatbotPaid: { pricePerMonth: 2000, discountEligible: false, type: 'Unlimited_Meta_Level' },
  AIAgenticPaid: { pricePerMonth: 3999, discountEligible: false, credits: 500 },
  
  // 👉 🚀 SIRF MODE C AI ALAG SE JODA GAYA HAI (As per Point 11)
  ModeC_SuperAgentic: { pricePerMonth: 9999, discountEligible: false, credits: 900, type: 'Human_Brain_Level' },
  
  OSCreationTier: { pricePerMonth: 69999, discountEligible: false, credits: 2500 }
};

const TransactionSchema = new mongoose.Schema({
  // ==========================================
  // 🛡️ PURANA CODE (BINA KUCHH HATAYE)
  // ==========================================
  userId: { type: String, required: true },
  // Maine enum me naye type jode hain taki Boost aur AI ka payment clear rahe, purana nahi hataya
  type: { type: String, enum: ['Recharge', 'AdRevenue', 'Withdrawal', 'BoostPayment', 'AIPayment', 'AutoEscalationPayment'] }, 
  amount: { type: Number, required: true }, // Ye final amount hoga jo PayU se katega
  planType: String, // Chatbot, Agentic, Pro Boost, AutoEscalation, OS_Creation, ModeC_SuperAgentic etc.
  months: Number, // 1, 3, 6, 9, 12
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  razorpayOrderId: String, // User ke order ke anusar isko nahi hataya gaya hai

  // ==========================================
  // 🚀 NAYA CODE (12-Point Blueprint ke anusar)
  // ==========================================
  
  // 1. Discount Tracking (6 aur 12 mahine wale 20% discount ke liye)
  baseAmount: { type: Number }, // Bina discount ka total amount
  discountApplied: { type: Number, default: 0 }, // Kitne rupye ka discount mila
  
  // 2. The Economy (Paisa kiske pas kitna gaya - 70/30, 25/75, 100%)
  splitRatioRule: { type: String }, // Record ke liye (e.g., "70/30", "25/75")
  triNetraShare: { type: Number, default: 0 }, // Apka profit jo sidhe apke bank me jayega
  userShare: { type: Number, default: 0 }, // User ka profit jo uske Wallet (Payout) me dikhega
  
  // 3. AI Logic (Master AI System)
  aiCreditsAllocated: { type: Number, default: 0 }, // 500, 900 (Mode C), ya 2500 (OS Builder)
  isNoDiscountPlan: { type: Boolean, default: false } // Ensure karega ki AI me galti se bhi discount na lage

}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);
