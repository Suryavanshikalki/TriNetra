import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // TriNetra ID
  userName: { type: String, required: true },
  userAvatar: { type: String, default: "" },
  
  content: { type: String, required: true },
  
  // Point 4: Media Uploads (Original Format from AWS S3)
  mediaUrl: { type: String, default: "" },
  mediaType: { type: String, enum: ['image', 'video', 'audio', 'document', 'none'], default: 'none' },
  
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },

  // Point 4: TriNetra Auto-Escalation Logic (Supreme Court Chain)
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
  escalationHistory: [{
    level: String,
    status: { type: String, enum: ['Pending', 'Resolved', 'Escalated'], default: 'Pending' },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
