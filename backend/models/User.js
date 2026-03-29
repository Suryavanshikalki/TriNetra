// ==========================================
// TRINETRA BACKEND - USER MODEL (File 4)
// Blueprint: Point 2, 3, 6, 11
// ==========================================
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Point 2: Permanent TriNetra ID (TRN-YYYY-XXXXX)
  trinetraId: { type: String, required: true, unique: true, index: true },
  
  name: { type: String, required: true },
  bio: { type: String, default: "TriNetra User" },
  profilePic: { type: String, default: "" },
  coverPic: { type: String, default: "" },

  // Point 2: 5 Login Methods + GitHub Rule
  authProvider: { type: String, enum: ['phone', 'email', 'google', 'apple', 'microsoft', 'github'], required: true },
  authId: { type: String, required: true, unique: true },
  isAIOnly: { type: Boolean, default: false }, // GitHub login restricts to AI only

  // Point 3: Connection Rules
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Point 6-10: Economy & Boosts (STRICTLY 5 Gateways)
  walletBalance: { type: Number, default: 0 },
  preferredGateway: { 
    type: String, 
    enum: ['PayU', 'Braintree', 'Paddle', 'Adyen', 'PayPal'], 
    default: 'PayPal' 
  },

  // Point 11: Master AI (6-in-1 Brain) Subscription
  aiProfile: {
    modeA_freeMessagesLimit: { type: Number, default: 8 }, // Daily Reset handled by CRON
    modeB_credits: { type: Number, default: 20 }, // One-time 20 free
    modeC_credits: { type: Number, default: 0 }, // Super Agentic: 900 credits
    isPaidSubscriber: { type: Boolean, default: false },
  },

  // Point 12: Privacy & Preferences Settings
  preferences: {
    language: { type: String, default: 'en' },
    reactions: { type: Boolean, default: true },
    accessibility: { type: Boolean, default: false },
    whatsappSync: { type: Boolean, default: false }
  },
  permissions: {
    cameraRollSharing: { type: Boolean, default: true },
    adsInContent: { type: Boolean, default: false },
    activeStatus: { type: Boolean, default: true }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
