// ==========================================
// TRINETRA BACKEND - FILE 53: routes/translateRoutes.js
// Blueprint: Point 12 (Instant Multilingual Translation Engine)
// 🚨 DEEP SEARCH UPDATE: ES6 FIXED & API COST SHIELD ADDED 🚨
// ==========================================
import express from 'express';

// ─── 1. REAL CONTROLLERS & SECURITY GUARDS ───
import { translateText } from '../controllers/translateController.js';
import { requireAuth } from '../middlewares/authMiddleware.js'; // The Gatekeeper Shield

const router = express.Router();

// ==========================================
// 🌐 TRINETRA TRANSLATION ENGINE ROUTES
// ==========================================

// 1. Instant Text Translation (Post, Chat, Comments)
// ✅ requireAuth 100% सुनिश्चित करेगा कि सिर्फ असली और वेरिफाइड यूज़र ही ट्रांसलेट करे, 
// ताकि हैकर्स आपका AI/Translation API बिल न बढ़ा सकें।
router.post('/text', requireAuth, translateText);

export default router;
