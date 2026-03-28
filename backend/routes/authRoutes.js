// File: backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ==========================================
// 🛡️ PURANA CODE (BINA KUCHH HATAYE)
// ==========================================

// POST /api/auth/login
router.post('/login', authController.loginUser);

// GET /api/auth/profile/:id
router.get('/profile/:id', authController.getUserProfile);

// PUT /api/auth/profile/update
router.put('/profile/update', authController.updateProfile);


// ==========================================
// 🚀 NAYA CODE (12-Point Blueprint: Point 1 & 2)
// ==========================================

/**
 * 👁️🔥 TRINETRA PLATFORM HUB
 * यह रूट फ्रंटएंड को बताएगा कि यूज़र Android पर है, iPhone पर या PC पर, 
 * ताकि 'Download Hub' सही ऐप का लिंक दे सके।
 */
router.get('/detect-platform', authController.detectUserPlatform);

/**
 * 🛡️ GitHub Gatekeeper Route
 * यह रूट सिर्फ AI कोडर्स को एंट्री देगा, सोशल फीचर्स ब्लॉक रखेगा।
 */
router.get('/github/callback', authController.handleGithubLogin);

module.exports = router;
