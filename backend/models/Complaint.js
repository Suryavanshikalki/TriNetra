// ==========================================
// TRINETRA BACKEND - FILE 61: models/Complaint.js
// Blueprint: Point 4 (Auto-Escalation / Justice Engine)
// 🚨 DEEP SEARCH UPDATE: ES6 FIXED, AI SUMMARY & TIMERS ADDED 🚨
// ==========================================
import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  // ==========================================
  // 🛡️ PURANA CODE (BINA KUCHH HATAYE)
  // ==========================================
  postId: { type: String, required: true, index: true },
  reporterId: { type: String, required: true, index: true },
  category: { type: String, required: true }, // Cricket, Politics, Infra, Health, etc.
  
  // ==========================================
  // 🚀 NAYA CODE (12-Point Blueprint: Point 4 Logic)
  // ==========================================

  // 1. 🚨 Extended Chain of Command (MLA to International)
  // Logic: Har level par system wait karega, solution nahi mila to agle level par auto-promote hoga
  escalationLevel: { 
    type: String, 
    enum: [
      'None',
      'Local_Officer', 
      'MLA', 
      'CM', 
      'PM', 
      'Civil_Court', 
      'High_Court', 
      'Supreme_Court', 
      'International_Level'
    ], 
    default: 'Local_Officer' 
  },

  // 2. 📊 System Tracking (Engagement & Debate)
  // Agar post par bahut 'Behas' (Comments/Engagement) hai, to system ise 'High Priority' mark karega
  debateScore: { type: Number, default: 0 }, 
  isAutoTracked: { type: Boolean, default: true },

  // 🚨 TRINETRA REAL FIX: Auto-Escalation Timer
  // System is date ko check karega. Agar is date tak actionStatus update nahi hua, to automatically next level par bhej dega.
  nextEscalationDate: { type: Date, default: null },

  // 🚨 TRINETRA REAL FIX: Master AI Integration (Point 11 & 4)
  // AI Gemini/DeepSeek jo summary banayega, wo yahan save hogi aur officials ko yahi padhne ko milegi.
  aiSummaryReport: { type: String, default: "" },

  // 3. 💼 Official Contacts (Whom the complaint was sent to via AWS SNS)
  currentAuthority: {
    name: String, // e.g., "District Magistrate" or "Ministry Office"
    email: String,
    topicArn: String, // AWS SNS Topic ARN for real routing
    actionStatus: { type: String, default: 'No Response' }
  },

  // 4. 💰 Payment Status (Point 4: ₹30,000/month Pro Justice System)
  // Full escalation chain sirf unke liye hai jinhone payment kiya hai
  isPaidEscalation: { type: Boolean, default: false },
  transactionId: { type: String }, // TriNetra Crypto Txn ID

  // 5. 📎 Evidence (Universal Download Support)
  // Post se linked Original Media (Photo/Video/PDF) jo complaint ke sath jayega
  evidenceLinks: [{
    mediaUrl: String,
    mediaType: String,
    originalFileName: String
  }],

  status: { 
    type: String, 
    enum: ['Open', 'Escalated', 'Under_Review', 'Resolved', 'System_Action_Taken'], 
    default: 'Open' 
  },

  // 6. 🕒 Detailed Action History
  history: [{
    level: String,
    actionTaken: String,
    remarks: String, // Official response from the authority
    date: { type: Date, default: Date.now }
  }]

}, { timestamps: true });

// 🚨 Indexing for extreme speed tracking of high-priority and pending escalations
ComplaintSchema.index({ debateScore: -1, status: 1 });
ComplaintSchema.index({ nextEscalationDate: 1, status: 1 }); // Cron job AWS Worker ke liye

export default mongoose.model('Complaint', ComplaintSchema);
