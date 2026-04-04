// ==========================================
// TRINETRA BACKEND - FILE 52: routes/postRoutes.js
// Blueprint: Point 3, 4 & 12 (Feed, Reels, Connections & Deep Settings)
// 🚨 DEEP SEARCH UPDATE: MULTI-MEDIA PARSER & AUTH GUARDS ADDED 🚨
// ==========================================
import express from 'express';
import multer from 'multer';

// ─── 1. REAL CONTROLLERS & GUARDS ───
import { createPost, getFeed } from '../controllers/postController.js';
import { updateSettings, handleFollow } from '../controllers/userController.js';
import { requireAuth } from '../middlewares/authMiddleware.js'; // The Gatekeeper Shield

const router = express.Router();

// ─── 2. AWS MEDIA PARSER (For Point 4: Feed & Reels) ───
// यह वीडियो और ओरिजिनल फोटो को सीधा RAM में होल्ड करके AWS S3 पर भेजेगा
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB Limit (For High-Quality Reels & PDF)
});

// ==========================================
// 🌍 TRINETRA SOCIAL ENGINE ROUTES
// ==========================================

// 1. Create Post & Reels Logic (Point 4)
// ✅ upload.array('media', 10) का मतलब है कि यूज़र एक साथ 10 फ़ोटो/वीडियो (Carousel) डाल सकता है (Facebook की तरह)।
router.post('/create', requireAuth, upload.array('media', 10), createPost);

// 2. Global Feed & Reels Algorithm (Point 4)
// ✅ requireAuth सुनिश्चित करेगा कि फीड का AI अल्गोरिदम यूज़र के इंटरेस्ट के हिसाब से डेटा दिखाए।
router.get('/feed', requireAuth, getFeed);

// 3. Mutual Connections & Follow Logic (Point 3)
// ✅ यही राउट डिसाइड करेगा कि कौन "Mutual" बना और WhatsApp 2.0 का चैट एक्सेस किसे मिलेगा।
router.post('/follow', requireAuth, handleFollow);

// 4. Deep Settings Update (Point 12: A to H)
// ✅ WAF और requireAuth मिलकर हैकर्स को रोकेंगे। सिर्फ असली यूज़र अपनी सेटिंग्स बदल पाएगा।
router.put('/settings/update', requireAuth, updateSettings);

export default router;
