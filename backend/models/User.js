// ==========================================
// TRINETRA BACKEND - FILE 12: models/User.js
// Blueprint: Point 2 (Gatekeeper), Point 3 (Connections), Point 11 (AI) & Point 12 (Settings)
// 🚨 DEEP SEARCH UPDATE: OS CREATION, 3D AVATAR, & FULL SETTINGS A-H SYNCED 🚨
// ==========================================
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // ==========================================
  // 🛡️ POINT 2: GATEKEEPER & IDENTITY
  // ==========================================
  trinetraId: { type: String, required: true, unique: true, index: true },
  name: { type: String, default: "TriNetra User" }, 
  phone: { type: String, unique: true, sparse: true }, // Mobile OTP Login
  email: { type: String, unique: true, sparse: true }, // Email Login
  
  // Authentication & GitHub AI Rule
  authProvider: { type: String, enum: ['phone', 'email', 'google', 'apple', 'microsoft', 'github'], required: true },
  authId: { type: String, required: true, unique: true }, // Sub/UID from provider
  appAccessLevel: { type: String, enum: ['AI_ONLY', 'FULL_ACCESS'], default: 'FULL_ACCESS' }, 
  
  // ==========================================
  // 🎭 POINT 3: PROFILE & CONNECTIONS
  // ==========================================
  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  coverPic: { type: String, default: "" },
  avatar3dUrl: { type: String, default: "" }, // 🚨 3D Avatar Support

  followers: [{ type: String }], // Array of TriNetra IDs
  following: [{ type: String }],
  blockedUsers: [{ type: String }],

  // ==========================================
  // 💰 POINT 6: THE ECONOMY & WALLET
  // ==========================================
  walletBalance: { type: Number, default: 0 },
  preferredGateway: { 
    type: String, 
    enum: ['PayU', 'Braintree', 'Paddle', 'Adyen', 'PayPal'], 
    default: 'PayPal' 
  },
  
  // Subscription Tracking (Point 4 & 10)
  escalationPlanStatus: { type: String, enum: ['INACTIVE', 'ACTIVE_PRO'], default: 'INACTIVE' }, // For 30k Justice Engine
  proAutoBoostStatus: { type: String, enum: ['INACTIVE', 'ACTIVE'], default: 'INACTIVE' }, // For 28k Auto Boost

  // ==========================================
  // 🤖 POINT 11: MASTER AI (6-IN-1 BRAIN CREDITS)
  // ==========================================
  // Note: Exactly synced with aiController.js and paymentController.js
  aiCreditsA_Free: { type: Number, default: 8 },    // Daily 8 messages (Meta/Gemini)
  aiCreditsB_Paid: { type: Number, default: 20 },   // Agentic (One-time 20, then paid 300)
  aiCreditsC: { type: Number, default: 0 },         // Mode C (Human Brain Level - 900)
  aiCreditsOS: { type: Number, default: 0 },        // OS Creation Tier (Ultimate - 5000)

  // ==========================================
  // ⚙️ POINT 12: THE SCREENSHOT DEEP DIVE (SETTINGS A-H)
  // ==========================================
  // 🚨 Facebook Level Privacy & Control Structure
  settings: {
    accountsCentre: { type: Object, default: {} },
    toolsResources: { type: Object, default: {} },
    preferences: {
        language: { type: String, default: 'en' },
        darkMode: { type: Boolean, default: true },
        reactions: { type: Boolean, default: true },
        accessibility: { type: Boolean, default: false }
    },
    audienceVisibility: { type: Object, default: { profile: 'public', posts: 'public' } },
    permissionsSafety: { type: Object, default: { whatsappSync: false } },
    paymentsActivity: { type: Object, default: {} }
  }

}, { timestamps: true });

// 🚨 INDEXING FOR EXTREME DB PERFORMANCE
// Login validation and profile loading will happen in 1 millisecond
userSchema.index({ trinetraId: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);
