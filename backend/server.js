// ==========================================
// TRINETRA SUPER APP - FINAL MASTER BACKEND V5.1
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

// --- 1. SOCKET.IO (WhatsApp 2.0 Engine) ---
// 🚀 FIXED: Aapke asli link ko har jagah allow kiya gaya hai
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

// --- 3. CORE SCHEMAS (User, Post, Complaint) ---
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
const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  userId: String, content: String, mediaUrl: String, mediaType: String,
  boostType: { type: String, enum: ['None', 'Free', 'Paid', 'Paid+Monetized', 'Pro'], default: 'None' },
  likes: Number, comments: Array, category: String
});
const Post = mongoose.model('Post', PostSchema);

const ComplaintSchema = new mongoose.Schema({
  postId: String, category: String,
  escalationLevel: { type: Number, default: 0 },
  status: { type: String, default: 'Open' }
});
const Complaint = mongoose.model('Complaint', ComplaintSchema);

// --- 4. GATEKEEPER API ---
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

paypal.configure({
  'mode': 'live', 
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_SECRET
});

const PRICING = {
    chatbot: { 1: 1499, 3: 4199, 6: 7999, 9: 11499, 12: 14999 },
    agentic: { 1: 5999, 3: 16999, 6: 31999, 9: 45999, 12: 59999 },
    os_creation: { 1: 49999 },
    pro_boost: { 1: 10000 },
    paid_boost: { 1: 999, 3: 2499, 6: 4499, 9: 6499, 12: 8999 },
    paid_boost_monetize: { 1: 1999, 3: 5499, 6: 9999, 9: 14499, 12: 18999 }
};

app.post('/api/payment/recharge', async (req, res) => {
    const { type, months, userId } = req.body;
    let amount = PRICING[type][months];
    if(!amount) return res.status(400).json({ error: "Invalid Plan" });

    const order = await razorpay.orders.create({ amount: amount * 100, currency: "INR" });
    res.json({ success: true, order });
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

// --- 7. REAL-TIME CHAT ---
io.on('connection', (socket) => {
  socket.on('send_message', async (data) => {
    io.emit('receive_message', data); 
  });
});

// --- 8. SEARCH ENGINE ---
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query; 
    const users = await User.find({ $text: { $search: q } }).limit(10);
    res.json({ success: true, results: { users } });
  } catch (err) { res.status(500).json({ success: false }); }
});

// --- 9. ERROR HANDLING ---
app.use(Sentry.Handlers.errorHandler());

// ==========================================
// 🚀 10. THE MASTER FRONTEND LINK (FIXED)
// ==========================================

// Test Route
app.get('/api/status', (req, res) => res.send('TriNetra V5 Master Backend Live 👁️🔥'));

// 👁️ FIXED: Frontend ko serve karne ka sahi rasta
// Agar 'dist' folder backend ke andar hai:
const frontendPath = path.join(__dirname, 'dist');
app.use(express.static(frontendPath));

// 🛡️ catch-all route taaki React Router sahi chale
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 TriNetra Engine running on port ${PORT}`));
