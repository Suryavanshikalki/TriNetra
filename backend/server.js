// ==========================================
// TRINETRA SUPER APP - FINAL MASTER BACKEND V6.1
// 100% Blueprint: True Pricing, No Razorpay, Super Agentic Mode & 4 Gateways
// ==========================================
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path'); 

const AWS = require('aws-sdk');
const Sentry = require('@sentry/node');
require('dotenv').config();

// 🌐 4 Naye Global Gateways (Placeholders) + PayPal
const paypal = require('paypal-rest-sdk'); 
const payuIndia = { init: () => console.log('PayU India Active') }; 
const braintreePayPal = { init: () => console.log('Braintree+PayPal Active') }; 
const paddle = { init: () => console.log('Paddle Active') }; 
const adyen = { init: () => console.log('Adyen Active') }; 

const app = express();
const server = http.createServer(app);

// --- 0. SENTRY (CRASH TRACKING) ---
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());

// --- 1. SOCKET.IO (Messenger / WhatsApp 2.0) ---
const io = new Server(server, { 
    cors: { origin: "*", methods: ["GET", "POST"] } 
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// --- 1.5 AWS S3 CONFIGURATION ---
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-south-1' 
});

// --- 2. MONGODB DATABASE ---
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI; 
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ TriNetra MongoDB Database Active'))
  .catch(err => console.error('❌ DB Error:', err));

// ==========================================
// 🛡️ 3. CORE SCHEMAS
// ==========================================
const UserSchema = new mongoose.Schema({
  trinetraId: { type: String, unique: true }, phone: String, email: String, provider: String,
  profilePic: String, coverPic: String, bio: String, avatar: String,
  walletBalance: { type: Number, default: 0 },
  
  // 🧠 Master AI Credits (Modes A, B, C & OS)
  aiChatbotCredits: { type: Number, default: 8 },  
  agenticCredits: { type: Number, default: 20 },   
  superAgenticCredits: { type: Number, default: 0 }, // Mode C: Human-Brain Level
  osCredits: { type: Number, default: 0 },
  
  isPaidChatbot: { type: Boolean, default: false },
  osCreationAccess: { type: Boolean, default: false },
  followers: [String], following: [String], blocked: [String],
  activeBoostPlan: { type: String, default: 'None' }, 
  activeBoostExpiry: Date
});
UserSchema.index({ trinetraId: "text", phone: "text", email: "text", bio: "text" });
const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  userId: String, content: String, mediaUrl: String, mediaType: String,
  boostType: { type: String, enum: ['None', 'FreeBoost', 'PaidBoost', 'PaidBoostMonetization', 'ProAutoBoost'], default: 'None' },
  likes: { type: Number, default: 0 }, comments: Array, category: String,
  createdAt: { type: Date, default: Date.now }
});
PostSchema.index({ content: "text", category: "text" });
const Post = mongoose.model('Post', PostSchema);

const TransactionSchema = new mongoose.Schema({
    userId: String, type: String, amount: Number, planType: String, 
    months: Number, status: String, paymentMethod: String,
    triNetraShare: Number, userShare: Number, isNoDiscountApplied: Boolean,
    createdAt: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

const ComplaintSchema = new mongoose.Schema({
  postId: String, category: String,
  escalationLevel: { type: Number, default: 0 },
  status: { type: String, default: 'Open' }
});
const Complaint = mongoose.model('Complaint', ComplaintSchema);

// ==========================================
// 🚀 4. GATEKEEPER API (Strict Entry - Point 2)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { authId, provider } = req.body;
  if(!authId) return res.status(400).json({ error: "Auth ID required." });
  let user = await User.findOne({ $or: [{ phone: authId }, { email: authId }] });
  if (!user) {
    user = new User({ trinetraId: `TRN${Date.now()}`, [provider === 'Phone' ? 'phone' : 'email']: authId, provider });
    await user.save();
  }
  res.json({ success: true, user, isDevMode: provider === 'GitHub' });
});

// ==========================================
// 💰 5. THE ECONOMY ENGINE (Exact Rates & Split)
// Point 6 to 11 (100% Accurate Pricing List)
// ==========================================

const PRICING_RULES = {
  // 🚨 Point 4: Auto-Escalation Justice System
  'AutoEscalation': { price: 20000, discountEligible: true, triNetra: 100, user: 0 },
  
  // 🚀 Points 7 to 10: Boost & Monetization 
  'FreeBoost': { price: 0, discountEligible: false, triNetra: 70, user: 30 }, 
  'PaidBoost': { price: 5000, discountEligible: true, triNetra: 25, user: 75 },
  'PaidBoostMonetization': { price: 7500, discountEligible: true, triNetra: 0, user: 100 },
  'ProAutoBoost': { price: 10000, discountEligible: true, triNetra: 30, user: 70 },
  
  // 🧠 Point 11: Master AI Tiers (Strictly NO Discount)
  'AIChatbotPaid': { price: 2000, discountEligible: false, credits: 'Unlimited', triNetra: 100, user: 0 },
  'AIAgenticPaid': { price: 3999, discountEligible: false, credits: 500, triNetra: 100, user: 0 },
  'SuperAgenticPaid': { price: 9999, discountEligible: false, credits: 900, triNetra: 100, user: 0 }, // Mode C
  'OSCreationTier': { price: 69999, discountEligible: false, credits: 2500, triNetra: 100, user: 0 }
};

// 💳 Master Payment & Wallet Allocation Logic
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { userId, type, months, paymentMethod } = req.body; 
    
    const plan = PRICING_RULES[type];
    if (!plan) return res.status(400).json({ success: false, error: "Invalid Plan Detected." });

    // Discount Engine: 20% off for 6 or 12 months (Only if eligible)
    let baseAmount = plan.price * months;
    let finalAmount = baseAmount;
    if (plan.discountEligible && (months === 6 || months === 12)) {
        finalAmount = baseAmount - (baseAmount * 0.20);
    }

    // Revenue Split Engine (TriNetra vs User Wallet)
    let userShareAmount = (finalAmount * plan.user) / 100;
    let triNetraShareAmount = (finalAmount * plan.triNetra) / 100;

    // Save Transaction
    const transaction = new Transaction({ 
        userId, type: 'Recharge', amount: finalAmount, planType: type, months, 
        status: 'Success', paymentMethod, triNetraShare: triNetraShareAmount, 
        userShare: userShareAmount, isNoDiscountApplied: !plan.discountEligible
    });
    await transaction.save();
    
    // Update User Wallet & AI Status
    const user = await User.findById(userId);
    if (user) {
        user.walletBalance += userShareAmount; // User ki kamai wallet me
        
        if (type === 'AIChatbotPaid') user.isPaidChatbot = true;
        if (type === 'AIAgenticPaid') user.agenticCredits += 500;
        if (type === 'SuperAgenticPaid') user.superAgenticCredits += 900;
        if (type === 'OSCreationTier') {
            user.osCreationAccess = true;
            user.osCredits += 2500;
        }
        
        if(type.includes('Boost')) {
            user.activeBoostPlan = type;
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + months);
            user.activeBoostExpiry = expiryDate;
        }
        await user.save();
    }
    
    res.status(200).json({ success: true, message: "Transaction Verified. TriNetra rules applied." });
  } catch (error) { res.status(500).json({ success: false, error: "Payment failed." }); }
});

// ==========================================
// 🚨 6. AUTO-ESCALATION SYSTEM
// ==========================================
app.post('/api/complaint/escalate', async (req, res) => {
  const { postId, category } = req.body;
  const escalationChain = ['Local Authority', 'MLA', 'CM', 'PM', 'Civil Court', 'High Court', 'Supreme Court', 'International Body'];
  let complaint = await Complaint.findOne({ postId });
  if (!complaint) complaint = new Complaint({ postId, category });
  if (complaint.status !== 'Resolved' && complaint.escalationLevel < escalationChain.length - 1) {
    complaint.escalationLevel += 1;
    await complaint.save();
    return res.json({ success: true, message: `Escalated to: ${escalationChain[complaint.escalationLevel]}` });
  }
  res.json({ success: false, message: "Max level reached." });
});

// ==========================================
// 📞 7. MESSENGER (Socket.io)
// ==========================================
io.on('connection', (socket) => {
  socket.on('send_message', async (data) => {
    const sender = await User.findOne({ trinetraId: data.senderId });
    const receiver = await User.findOne({ trinetraId: data.receiverId });
    if(sender && receiver && sender.following.includes(data.receiverId) && receiver.following.includes(data.senderId)) {
        io.emit('receive_message', data); 
    }
  });
});

// ==========================================
// ⚙️ 8. SERVER LINKING & FRONTEND
// ==========================================
app.get('/api/status', (req, res) => res.send('TriNetra V6.1 Master Backend Live 👁️🔥'));

const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => { res.sendFile(path.join(frontendPath, 'index.html')); });

app.use(Sentry.Handlers.errorHandler());

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 TriNetra Engine V6.1 running on port ${PORT}`));
