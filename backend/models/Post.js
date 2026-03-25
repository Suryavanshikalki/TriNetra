// File: backend/models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: String,
  mediaUrl: String, // Link to S3/Local storage
  mediaType: { type: String, enum: ['Text', 'Photo', 'Video', 'Audio', 'PDF', 'None'], default: 'None' },
  boostType: { type: String, enum: ['None', 'Free', 'Paid', 'Paid+Monetized', 'Pro'], default: 'None' },
  likes: { type: Number, default: 0 },
  comments: [{
    userId: String,
    text: String,
    mediaUrl: String, // Comments can also have media/Mic
    createdAt: { type: Date, default: Date.now }
  }],
  category: { type: String, default: 'General' }, // For Escalation (e.g., Politics, Civic)
  isDevelopmentIssue: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
