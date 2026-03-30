import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Point 2: Gatekeeper & Permanent TriNetra ID
  trinetraId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  bio: { type: String, default: "TriNetra User" },
  profilePic: { type: String, default: "" },
  coverPic: { type: String, default: "" },

  // Point 2: 5 Login Methods + GitHub AI Rule
  authProvider: { type: String, enum: ['phone', 'email', 'google', 'apple', 'microsoft', 'github'], required: true },
  authId: { type: String, required: true, unique: true },
  isAIOnly: { type: Boolean, default: false }, // GitHub login restricts to AI only

  // Point 3: Mutual Connection Rules
  followers: [{ type: String }],
  following: [{ type: String }],
  blockedUsers: [{ type: String }],

  // Point 6: 5 Gateways Only (Razorpay STRICTLY BANNED)
  walletBalance: { type: Number, default: 0 },
  preferredGateway: { 
    type: String, 
    enum: ['PayU', 'Braintree', 'Paddle', 'Adyen', 'PayPal'], 
    default: 'PayPal' 
  },
  
  // Point 11: Master AI (6-in-1 Brain) Subscription
  aiProfile: {
    modeA_freeMessagesLimit: { type: Number, default: 8 }, 
    modeB_credits: { type: Number, default: 20 }, 
    modeC_credits: { type: Number, default: 0 }, // Human-brain mode: 900 credits
    isPaidSubscriber: { type: Boolean, default: false }
  },

  // Point 12: Preferences & Privacy
  preferences: {
    language: { type: String, default: 'en' },
    reactions: { type: Boolean, default: true },
    accessibility: { type: Boolean, default: false },
    whatsappSync: { type: Boolean, default: false }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
