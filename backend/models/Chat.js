// File: backend/models/Chat.js
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: String,
  mediaUrl: String, // Image, Video, PDF, Location, Mic Audio
  mediaType: { type: String, enum: ['Text', 'Image', 'Video', 'Audio', 'PDF', 'Location', 'Contact'] },
  isRead: { type: Boolean, default: false },
  groupId: { type: String, default: null } // If it's a group chat
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
