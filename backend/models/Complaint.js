// File: backend/models/Complaint.js
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  reporterId: String,
  category: { type: String, required: true }, // Cricket, Politics, Infra, etc.
  escalationLevel: { type: Number, default: 0 }, // 0=Local, 1=MLA, 2=CM, 3=PM, etc.
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  history: [{
    level: Number,
    actionTaken: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
