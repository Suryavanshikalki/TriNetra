// File: backend/models/Complaint.js
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  // ==========================================
  // 🛡️ PURANA CODE (BINA KUCHH HATAYE)
  // ==========================================
  postId: { type: String, required: true },
  reporterId: { type: String, required: true },
  category: { type: String, required: true }, // Cricket, Politics, Infra, Health, etc.
  
  // ==========================================
  // 🚀 NAYA CODE (12-Point Blueprint: Point 4 Logic)
  // ==========================================

  // 1. 🚨 Extended Chain of Command (MLA to International)
  // Logic: Har level par system wait karega, solution nahi mila to agle level par auto-promote hoga
  escalationLevel: { 
    type: String, 
    enum: [
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

  // 3. 💼 Official Contacts (Whom the complaint was sent to)
  currentAuthority: {
    name: String, // e.g., "District Magistrate" or "Ministry Office"
    email: String,
    actionStatus: { type: String, default: 'No Response' }
  },

  // 4. 💰 Payment Status (Point 4: ₹20,000 Justice System)
  // Full escalation chain sirf unke liye hai jinhone payment kiya hai
  isPaidEscalation: { type: Boolean, default: false },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },

  // 5. 📎 Evidence (Universal Download Support)
  // Post se linked Media (Photo/Video/PDF) jo complaint ke sath jayega
  evidenceLinks: [String],

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

// Indexing for faster tracking of high-priority debates
ComplaintSchema.index({ debateScore: -1, status: 1 });

module.exports = mongoose.model('Complaint', ComplaintSchema);
