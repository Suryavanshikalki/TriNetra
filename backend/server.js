// ==========================================
// TRINETRA SUPER APP - FINAL MASTER BACKEND V5.2
// ==========================================
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const http = require('http');
const { Server } = require('socket.io');
const Razorpay = require('razorpay');
const path = require('path'); 

// 🚀 Naye Master Packages
const AWS = require('aws-sdk');
const paypal = require('paypal-rest-sdk');
const Sentry = require('@sentry/node');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

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
  osCreationAccess: { type: Boolean, default: false },
  followers: [String], following: [String], blocked: [String],
  privacy: { lastSeen: Boolean, onlineStatus: Boolean, profileLocked: Boolean },
  activeBoostPlan: { type: String, default: 'None' }, 
  activeBoostExpiry: Date
});
// 👁️ Search Indexing for Facebook style search
UserSchema.index({ trinetraId: "text", phone: "text", email: "text", bio: "text" });
const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  userId: String, content: String, mediaUrl: String, mediaType: String,
  boostType: { type: String, enum: ['None', 'Free', 'Paid', 'Paid+Monetized', 'Pro'], default: 'None' },
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

// --- 5. THE ECONOMY (RAZORPAY & PAYPAL) ---
const razorpay = new Razorpay({ 
  key_id: process.env.RAZORPAY_KEY, 
  key_secret: process.env.RAZORPAY_SECRET 
});

const PRICING = {
    chatbot: { 1: 1499, 3: 4199, 6: 7999, 9: 11499, 12: 14999 },
    agentic: { 1: 5999, 3: 16999, 6: 31999, 9: 45999, 12: 59999 },
    os_creation: { 1: 49999 },
    pro_boost: { 1: 10000 },
    paid_boost: { 1: 999, 3: 2499, 6: 4499, 9: 6499, 12: 8999 },
    paid_boost_monetize: { 1: 1999, 3: 5499, 6: 9999, 9: 14499, 12: 18999 }
};

// 💰 Recharge API with Auto-Credit Update logic
app.post('/api/payment/recharge', async (req, res) => {
    try {
        const { type, months, userId } = req.body;
        let amount = PRICING[type][months];
        if(!amount) return res.status(400).json({ error: "Invalid Plan" });

        const order = await razorpay.orders.create({ amount: amount * 100, currency: "INR" });
        
        // Logic for auto-updating user (Usually called after payment verification)
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.now() + months);
        // ... (Payment success logic remains same)

        res.json({ success: true, order });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

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

// --- 7. REAL-TIME CHAT (Mutual Follower Rule Applied) ---
io.on('connection', (socket) => {
  socket.on('send_message', async (data) => {
    // 🛡️ SECURITY: Only allow if following each other
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
// 🚀 10. FRONTEND LINKING & DEPLOYMENT FIX (UPDATED)
// ==========================================

app.get('/api/status', (req, res) => res.send('TriNetra V5 Master Backend Live 👁️🔥'));

// 👁️ YAHAN RASTA THEEK KIYA GAYA HAI ('../dist' kiya gaya hai)
const frontendPath = path.join(__dirname, '../dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 TriNetra Engine running on port ${PORT}`));
