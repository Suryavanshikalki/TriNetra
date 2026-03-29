// ==========================================
// TRINETRA SUPER APP - FINAL MASTER BACKEND V5.3
// File: backend/server.js (Economy Integrated)
// ==========================================
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const http = require('http');
const { Server } = require('socket.io');
const Razorpay = require('razorpay');
const path = require('path'); 

const AWS = require('aws-sdk');
const paypal = require('paypal-rest-sdk');
const Sentry = require('@sentry/node');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// 👁️🔥 TRINETRA CONTROLLERS IMPORT
// Aapki di hui payment controller file yahan import ho rahi hai
const paymentController = require('./controllers/paymentController');

// --- 0. SENTRY (CRASH TRACKING) ---
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());

// --- 1. SOCKET.IO (Facebook/WhatsApp Style Engine) ---
const io = new Server(server, { 
    cors: { 
        origin: ["https://trinetra-umys.onrender.com", "http://localhost:3000", "http://localhost:5173", "*"], 
        methods: ["GET", "POST"] 
    } 
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
const s3 = new AWS.S3();

// --- 2. MONGODB DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI; 
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ TriNetra MongoDB Database Active'))
  .catch(err => console.error('❌ DB Error:', err));

// --- 3. CORE SCHEMAS ---
const UserSchema = new mongoose.Schema({
  trinetraId: { type: String, unique: true }, phone: String, email: String, provider: String,
  profilePic: String, coverPic: String, bio: String, avatar: String,
  walletBalance: { type: Number, default: 0 },
  aiChatbotCredits: { type: Number, default: 8 },  
  agenticCredits: { type: Number, default: 20 },
  osCredits: { type: Number, default: 0 },   
  isPaidChatbot: { type: Boolean, default: false },
  osCreationAccess: { type: Boolean, default: false },
  followers: [String], following: [String], blocked: [String],
  privacy: { lastSeen: Boolean, onlineStatus: Boolean, profileLocked: Boolean },
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

const ComplaintSchema = new mongoose.Schema({
  postId: String, category: String,
  escalationLevel: { type: Number, default: 0 },
  status: { type: String, default: 'Open' }
});
const Complaint = mongoose.model('Complaint', ComplaintSchema);

// Aapke Transaction Schema ka basic structure jo controller me use hua hai
const TransactionSchema = new mongoose.Schema({
    userId: String, type: String, amount: Number, planType: String, 
    months: Number, status: String, paymentMethod: String,
    triNetraShare: Number, userShare: Number, isNoDiscountApplied: Boolean,
    createdAt: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

// --- 4. GATEKEEPER API (LOGIN) ---
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

// --- 5. THE ECONOMY (RAZORPAY & PAYPAL & YOUR CONTROLLER) ---
const razorpay = new Razorpay({ 
  key_id: process.env.RAZORPAY_KEY, 
  key_secret: process.env.RAZORPAY_SECRET 
});

// 🚀 Yahan aapke Payment Controller ko Routes ke saath joda gaya hai
app.post('/api/payment/recharge', paymentController.createRechargeOrder);
app.post('/api/payment/verify', paymentController.verifyPayment);
app.get('/api/payment/wallet', paymentController.getWalletInfo);

// --- 6. AUTO-ESCALATION SYSTEM ---
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

// --- 7. REAL-TIME CHAT (Mutual Follower Rule) ---
io.on('connection', (socket) => {
  socket.on('send_message', async (data) => {
    const sender = await User.findOne({ trinetraId: data.senderId });
    const receiver = await User.findOne({ trinetraId: data.receiverId });
    if(sender && receiver && sender.following.includes(data.receiverId) && receiver.following.includes(data.senderId)) {
        io.emit('receive_message', data); 
    }
  });
});

// --- 8. SEARCH ENGINE ---
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query; 
    const users = await User.find({ $text: { $search: q } }).limit(10);
    const posts = await Post.find({ $text: { $search: q } }).limit(10);
    res.json({ success: true, results: { users, posts } });
  } catch (err) { res.status(500).json({ success: false }); }
});

// --- 9. ERROR HANDLING ---
app.use(Sentry.Handlers.errorHandler());

// ==========================================
// 🚀 10. FRONTEND LINKING (RENDER FIX)
// ==========================================
app.get('/api/status', (req, res) => res.send('TriNetra V5 Master Backend Live 👁️🔥'));

const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 TriNetra Engine running on port ${PORT}`));
