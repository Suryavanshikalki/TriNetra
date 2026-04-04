// ==========================================
// TRINETRA BACKEND - FILE 15: models/Post.js
// Blueprint: Point 4 (Feed, Marketplace, Reels, Auto-Escalation, Original Download)
// 🚨 DEEP SEARCH UPDATE: AWS S3 SYNC, REAL LIKES ENGINE, MARKETPLACE & INDEXING 🚨
// ==========================================
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  // ==========================================
  // 🛡️ PURANA CODE (BINA KUCHH HATAYE)
  // ==========================================
  userId: { type: String, required: true, index: true }, // TriNetra ID
  userName: { type: String, required: true },
  userAvatar: { type: String, default: "" },
  
  content: { type: String, required: true },
  
  // Point 4: Media Uploads (Original Format from AWS S3)
  mediaUrl: { type: String, default: "" },
  mediaType: { 
    type: String, 
    enum: ['image', 'video', 'audio', 'document', 'pdf', 'none'], 
    default: 'none' 
  },
  
  // ==========================================
  // 🚀 NAYA CODE (12-Point Blueprint & AWS Integration)
  // ==========================================

  // ─── 1. UNIVERSAL DOWNLOAD SUPPORT (AWS S3/CloudFront Sync) ───
  // असली ओरिजिनल फाइल डाउनलोड के लिए यह डेटा 100% ज़रूरी है
  originalFileName: { type: String, default: null }, // e.g., "TriNetra_Report.pdf"
  mediaSize: { type: Number, default: 0 },           // In Bytes
  mimeType: { type: String, default: null },         // e.g., "video/mp4"

  // ─── 2. REELS & MARKETPLACE (Point 4) ───
  isReel: { type: Boolean, default: false },
  isMarketplace: { type: Boolean, default: false },
  marketplaceData: {
      price: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
      condition: { type: String, default: 'New' }
  },
  
  // ─── 3. REAL ENGAGEMENT TRACKING (Facebook Level) ───
  likesCount: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Array of TriNetra IDs to prevent double-likes
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },

  // ─── 4. TRINETRA AUTO-ESCALATION LOGIC (Justice Engine) ───
  debateScore: { type: Number, default: 0 }, // Tracks the heat/virality of comments
  isEscalated: { type: Boolean, default: false },
  escalationLevel: { 
    type: String, 
    enum: [
      'None',
      'Local Authority', 
      'MLA', 
      'CM', 
      'PM', 
      'Civil Court', 
      'High Court', 
      'Supreme Court', 
      'International Level'
    ],
    default: 'None'
  },
  
  // AWS Cron Job Tracker (System is date ko check karega agle level pe bhejne ke liye)
  nextEscalationDate: { type: Date, default: null },
  
  // Point 11 & 4: Master AI jo summary banayega wo seedha yahan save hogi
  aiSummaryReport: { type: String, default: "" },

  escalationHistory: [{
    level: String,
    status: { type: String, enum: ['Pending', 'Resolved', 'Escalated_Unresolved'], default: 'Pending' },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// ==========================================
// 🚨 AWS/MONGODB INDEXING FOR EXTREME SPEED 🚨
// ==========================================
// Facebook ki tarah Feed 1 millisecond me load hone ke liye indexing:
postSchema.index({ createdAt: -1 }); // Fast Feed Loading
postSchema.index({ isMarketplace: 1, 'marketplaceData.price': 1 }); // Fast Marketplace Search
postSchema.index({ debateScore: -1, isEscalated: 1 }); // Fast Auto-Escalation Engine Tracking

export default mongoose.model('Post', postSchema);
