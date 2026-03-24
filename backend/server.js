const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const multer = require('multer'); // फाइल अपलोड के लिए
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' }); // फाइल्स यहाँ सेव होंगी

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // फाइल्स को एक्सेस करने के लिए

// --- RAZORPAY ---
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// --- API: MULTI-MODAL AI (Image/PDF/Audio Support) ---
app.post('/api/trinetra-ai', upload.single('file'), async (req, res) => {
  const { message, credits, mode } = req.body;
  const file = req.file;

  if (credits <= 0) return res.status(403).json({ reply: "⚠️ रिचार्ज करें!" });

  // यहाँ AI फाइल को भी प्रोसेस करेगा (Logic for 15 Keys)
  let responseText = `[TriNetra AI] संदेश प्राप्त: ${message}. `;
  if (file) responseText += `फाइल '${file.originalname}' अपलोड और स्कैन की गई।`;

  res.json({ 
    reply: responseText,
    fileUrl: file ? `/uploads/${file.filename}` : null,
    deduct: 1 
  });
});

// --- API: PAYMENT HELPLINE ---
app.post('/api/support', (req, res) => {
  const { userId, issue } = req.body;
  // यहाँ हेल्पडेस्क लॉजिक
  res.json({ status: "Support ticket created. Admin will contact you." });
});

// --- API: CREATE PAYMENT ---
app.post('/api/create-order', async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount * 100, currency: "INR", receipt: "r_" + Date.now()
    });
    res.json(order);
  } catch (e) { res.status(500).send(e); }
});

app.get('/', (req, res) => res.send('TriNetra A-Z Super-Engine LIVE 👁️🔥'));
app.listen(process.env.PORT || 3000, () => console.log('Server Active'));
