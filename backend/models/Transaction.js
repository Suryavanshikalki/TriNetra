// File: backend/models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['Recharge', 'AdRevenue', 'Withdrawal'] }, // Recharge is money to TriNetra, AdRevenue is money to User
  amount: { type: Number, required: true },
  planType: String, // Chatbot, Agentic, Pro Boost
  months: Number, // 1, 3, 6, 9, 12
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  razorpayOrderId: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
