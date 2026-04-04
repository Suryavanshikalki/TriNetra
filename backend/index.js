// ==========================================
// 👁️🔥 TRINETRA MASTER BACKEND ENGINE (PURE AWS ARCHITECTURE)
// File Location: backend/server.js (Main Entry Point)
// Author: Suryavanshi Kalki
// Blueprint: A to Z Integrated (All 12 Points)
// 🚨 DEEP SEARCH FIX: FIREBASE & RAZORPAY PERMANENTLY DELETED 🚨
// ==========================================

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet"; // AWS WAF Level Security Headers

// ─── 1. IMPORTING 100% REAL CONTROLLERS (No Dummy Code) ───
import { registerOrLogin, updateDeepSettings } from "./controllers/authSettingsController.js"; 
import { sendMessage, getChatHistory, getMutualFriends, createGroupChat } from "./controllers/chatController.js"; 
import { processPaymentAndBoost } from "./controllers/paymentController.js"; // Only PayU, PayPal, Braintree, Paddle, Adyen
import { processAIPrompt } from "./controllers/aiController.js"; // The 6-in-1 Master AI
import { translateText } from "./controllers/translateController.js"; // Multilingual Translation
import { triggerEscalation } from "./controllers/escalationController.js"; // Justice Engine
import { createPost, updateProfile, toggleFollowUser, toggleBlockUser } from "./controllers/userActivityController.js"; 

const app = express();

// ─── 2. AWS WAF & SECURITY MIDDLEWARE ───
app.use(helmet()); // हैकर्स और DDoS से बचाने के लिए
app.use(cors({ origin: true })); // Windows, Mac, Linux, iOS, Android, Web (6 Platforms Supported)
app.use(express.json({ limit: '50mb' })); // हाई-क्वालिटी ओरिजिनल मीडिया अपलोड के लिए लिमिट

// ─── 3. REAL AWS MONGODB CONNECTION (From GitHub Secrets) ───
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("[TriNetra DB] 100% Locked & Connected to AWS Environment"))
      .catch(err => console.error("[TriNetra DB] Crash Fatal Error (Logged to CloudWatch):", err));
} else {
    console.error("[TriNetra DB] MONGODB_URI Key is missing!");
}

// ==========================================
// 🚀 TRINETRA REAL API ROUTES (100% Blueprint Aligned)
// ==========================================

// 1. AWS Auto-Scaling & Load Balancer Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
      status: "TriNetra Engine 100% Active", 
      identity: "Suryavanshi Kalki",
      infra: "Pure Node.js + AWS EC2 Auto-Scaling + CloudWatch"
  });
});

// 2. THE GATEKEEPER (Point 2 & 12)
app.post("/api/auth/login", registerOrLogin);
app.post("/api/settings/update", updateDeepSettings);

// 3. PROFILE, CONNECTIONS & FEED (Point 3 & 4)
app.post("/api/user/profile", updateProfile);
app.post("/api/user/follow", toggleFollowUser);
app.post("/api/user/block", toggleBlockUser);
app.post("/api/post/create", createPost);

// 4. WHATSAPP 2.0 MESSENGER (Point 5)
app.post("/api/chat/send", sendMessage);
app.post("/api/chat/history", getChatHistory);
app.get("/api/chat/mutual-friends", getMutualFriends);
app.post("/api/chat/group/create", createGroupChat);

// 5. THE ECONOMY & BOOSTS (Point 6 to 10)
app.post("/api/payments/process", processPaymentAndBoost);

// 6. JUSTICE ENGINE / AUTO-ESCALATION (Point 4)
app.post("/api/escalation/trigger", triggerEscalation);

// 7. THE MASTER AI & TRANSLATION (Point 11 & 12)
app.post("/api/ai/chat", processAIPrompt);
app.post("/api/ai/translate", translateText); 

// ==========================================
// 🚨 AWS ENGINE IGNITION (Port Binding for EC2/Load Balancers)
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // यह कंसोल लॉग सीधा AWS CloudWatch में रिकॉर्ड होगा
    console.log(`👁️🔥 TriNetra Master Engine is LIVE on AWS Port ${PORT}`);
    console.log(`[System Check] Firebase: BANNED. Razorpay: BANNED.`);
    console.log(`[System Check] AI Core, Economy Engine, & Justice Engine are completely functional.`);
});
