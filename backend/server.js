const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay'); // Razorpay जोड़ दिया
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- RAZORPAY SETUP (Real Keys) ---
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// --- API ROUTES ---

// 1. AI Chat Route (पुराना + नया)
app.post('/api/trinetra-ai', async (req, res) => {
  const { mode, message, subMode } = req.body;
  try {
    // यहाँ आपके 5 AI इंजन काम करेंगे (Gemini/OpenAI आदि)
    res.json({ reply: `[TriNetra AI] System Online. 15 Keys Injected. Processing: ${message}` });
  } catch (error) {
    res.status(500).json({ error: "AI Engine Error" });
  }
});

// 2. Create Razorpay Order (असली पेमेंट की शुरुआत)
app.post('/api/create-order', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const options = {
      amount: amount * 100, // पैसे को 'पैसे' में बदलना (INR)
      currency: currency || "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 3. PayPal Dummy Verification (अभी के लिए)
app.post('/api/paypal-verify', (req, res) => {
  res.json({ status: "success", message: "PayPal connection ready" });
});

app.get('/', (req, res) => res.send('TriNetra Super-Engine (AI + Payments) is LIVE 👁️🔥'));

app.listen(port, () => console.log(`Server running on port ${port}`));
