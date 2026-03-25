// File: backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  trinetraId: { type: String, unique: true, required: true },
  phone: String,
  email: String,
  provider: String, // Phone, Email, Google, Apple, Microsoft, GitHub
  profilePic: String,
  coverPic: String,
  bio: String,
  avatar: String,
  walletBalance: { type: Number, default: 0 },
  aiChatbotCredits: { type: Number, default: 8 }, // Daily limit for free users
  agenticCredits: { type: Number, default: 20 }, // One-time limit for Agentic AI
  osCreationAccess: { type: Boolean, default: false }, // Most expensive tier
  activeBoostPlan: { type: String, default: 'None' }, // Free, Paid, Paid+Monetized, Pro
  activeBoostExpiry: Date,
  followers: [String], // Array of TriNetra IDs
  following: [String],
  blocked: [String],
  privacy: {
    lastSeen: { type: Boolean, default: true },
    onlineStatus: { type: Boolean, default: true },
    profileLocked: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
