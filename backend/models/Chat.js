// ==========================================
// TRINETRA BACKEND - FILE 16: models/Chat.js
// Blueprint: Point 5 (WhatsApp 2.0, Multi-Media, Group Chat, Original Download)
// 🚨 DEEP SEARCH UPDATE: TICK SYSTEM, REPLIES, & ORIGINAL MEDIA SYNC 🚨
// ==========================================
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true }, 
  senderId: { type: String, required: true, index: true }, // TriNetra ID
  receiverId: { type: String, index: true }, // 1-to-1 चैट में नोटिफिकेशन और राउटिंग के लिए
  
  // ─── 1. CORE CONTENT & MULTI-MEDIA (Point 5) ───
  content: { type: String, default: "" },
  mediaUrl: { type: String, default: "" },
  mediaType: { 
    type: String, 
    enum: [
        'text', 'image', 'video', 'audio', 'voice_note', 
        'pdf', 'contact', 'location', 'gif', 'sticker', 'avatar'
    ], 
    default: 'text' 
  },
  
  // ─── 2. UNIVERSAL DOWNLOAD SUPPORT (Asli Quality Download) ───
  originalFileName: { type: String, default: null }, // e.g., "document.pdf"
  mediaSize: { type: Number, default: 0 },           // In Bytes
  mimeType: { type: String, default: null },         // e.g., "application/pdf"

  // ─── 3. STRUCTURED DATA (Location & Contact) ───
  // अगर मीडिया टाइप लोकेशन या कॉन्टैक्ट है, तो उसका असली डेटा
  locationData: { 
      lat: { type: Number, default: null }, 
      lng: { type: Number, default: null }, 
      name: { type: String, default: null } 
  },
  contactData: { 
      name: { type: String, default: null }, 
      phoneNumber: { type: String, default: null } 
  },

  // ─── 4. WHATSAPP 2.0 REAL FEATURES ───
  replyToMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', default: null }, // स्वाइप टू रिप्लाई
  isDeletedForEveryone: { type: Boolean, default: false }, // असली "Delete for everyone"
  
  // Message Reactions (👍, ❤️, 😂)
  reactions: [{
      userId: { type: String }, // TriNetra ID
      emoji: { type: String }
  }],

  // ─── 5. THE TICK ENGINE (Delivery & Read Receipts) ───
  isGroupMessage: { type: Boolean, default: false },
  
  // 1-to-1 Chat Status (Single, Double, Blue Tick)
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }, 
  
  // Group Chat Delivery & Read Arrays
  deliveredTo: [{ type: String }], // TriNetra IDs of members who received it
  readBy: [{ type: String }]       // TriNetra IDs of members who opened it

}, { timestamps: true });

// 🚨 Indexing for Extreme Speed (Facebook Level Performance)
// इन इंडेक्स की वजह से करोड़ों चैट्स के बीच भी आपका मैसेंजर 1 मिलीसेकंड में पुरानी चैट लोड करेगा।
chatSchema.index({ roomId: 1, createdAt: -1 });
chatSchema.index({ senderId: 1, receiverId: 1 });

export default mongoose.model('Chat', chatSchema);
