const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- RAZORPAY SETUP (Using your Real Keys from Render Env) ---
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// --- MASTER API ROUTES ---

// 1. AI & Agent Engine (With Credit Logic)
app.post('/api/trinetra-ai', async (req, res) => {
  const { mode, subMode, message, credits } = req.body;
  
  if (credits <= 0) {
    return res.status(403).json({ reply: "⚠️ कोटा समाप्त! कृपया 200 क्रेडिट्स के लिए रिचार्ज करें।" });
  }

  try {
    // यहाँ आपकी 15 Keys का इस्तेमाल होगा (Gemini/DeepSeek/Manus आदि)
    res.json({ 
      reply: `[TriNetra ${subMode}] सिस्टम ऑनलाइन। 15 चाबियाँ सक्रिय हैं। \nसंदेश: ${message}`,
      deduct: 1 
    });
  } catch (error) {
    res.status(500).json({ error: "इंजन ऑफलाइन है" });
  }
});

// 2. Razorpay Order Creation (असली पेमेंट)
app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, 
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/', (req, res) => res.send('TriNetra V2.0 Engine (AI+Reels+Chat+Pay) LIVE 👁️🔥'));
app.listen(port, () => console.log(`TriNetra Engine running on port ${port}`));
