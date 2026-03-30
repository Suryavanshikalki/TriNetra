import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true }, 
  senderId: { type: String, required: true }, // TriNetra ID
  
  // Point 5: Chat Box Multi-Media Support
  content: { type: String, default: "" },
  mediaUrl: { type: String, default: "" },
  mediaType: { 
    type: String, 
    enum: ['text', 'image', 'video', 'audio', 'voice_note', 'pdf', 'contact', 'location', 'gif', 'sticker', 'avatar'], 
    default: 'text' 
  },
  
  isGroupMessage: { type: Boolean, default: false },
  readBy: [{ type: String }] 
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
