// File: backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // ==========================================
  // 🛡️ PURANA CODE (BINA KUCHH HATAYE)
  // ==========================================
  trinetraId: { type: String, unique: true, required: true },
  phone: String,
  email: String,
  provider: String, // Phone, Email, Google, Apple, Microsoft, GitHub
  profilePic: String,
  coverPic: String,
  bio: String,
  avatar: String, // Path or ID for 3D Avatar (Point 3)
  walletBalance: { type: Number, default: 0 },
  followers: [String], // Array of TriNetra IDs (Mutual Connection Rule)
  following: [String],
  blocked: [String],

  // ==========================================
  // 🚀 NAYA CODE (12-Point Blueprint Logic)
  // ==========================================

  // 1. 🌍 Multilanguage Support (Point 13 & E)
  // Yahan user ki pasand ki bhasha save hogi (Default: Hindi)
  preferredLanguage: { type: String, default: 'hi' },

  // 2. 🧠 Master AI System Logic (Point 11)
  // Mode A: Chatbot
  isPaidChatbot: { type: Boolean, default: false }, // True = Unlimited, False = 8 Limit
  dailyAiLimit: { type: Number, default: 8 }, // Reset hone wala counter
  lastAiReset: { type: Date, default: Date.now }, // Daily reset check karne ke liye
  
  // Mode B: Agentic AI
  agenticCredits: { type: Number, default: 20 }, // One-time 20 credits for Free users
  isPaidAgentic: { type: Boolean, default: false }, // Recharge karne par 500 milega ya nahi
  
  // OS Creation Tier (Ultimate Tier)
  osCreationAccess: { type: Boolean, default: false }, 
  osCredits: { type: Number, default: 0 }, // 2500 Credits for OS Builder

  // 3. 🛡️ Gatekeeper Security (Point 2)
  // GitHub se login karne walo ko Social features se lock karne ke liye
  isGithubUser: { type: Boolean, default: false }, 
  isProfessionalMode: { type: Boolean, default: false }, // Screen 6 - Creator Access

  // 4. 💰 The Economy (Point 7-10)
  activeBoostPlan: { type: String, enum: ['None', 'Free', 'Paid', 'PaidMonetized', 'Pro'], default: 'None' },
  activeBoostExpiry: Date,
  payoutHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],

  // 5. 🔒 Privacy & Safety (Point 3 & G)
  privacy: {
    lastSeen: { type: Boolean, default: true },
    onlineStatus: { type: Boolean, default: true },
    profileLocked: { type: Boolean, default: false },
    twoFactorAuth: { type: Boolean, default: false } // Security upgrade
  }

}, { timestamps: true });

// Pre-save hook to ensure daily reset for AI credits (Point 11)
UserSchema.pre('save', function(next) {
  const now = new Date();
  const lastReset = new Date(this.lastAiReset);
  
  // Agar din badal gaya hai, to free credits reset kar do (8 msg rule)
  if (now.toDateString() !== lastReset.toDateString()) {
    this.dailyAiLimit = 8;
    this.lastAiReset = now;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
