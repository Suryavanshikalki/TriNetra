// ==========================================
// TRINETRA BACKEND - FILE 46: routes/authRoutes.js
// Blueprint: Point 2 (Gatekeeper - 5 Login Methods + GitHub AI Rule)
// 🚨 DEEP SEARCH UPDATE: REAL WORLD AUTHENTICATION CYCLE 🚨
// ==========================================
import express from 'express';
import { 
    registerOrLogin, 
    verifyOTP, 
    refreshToken, 
    logout 
} from '../controllers/authController.js';

const router = express.Router();

// ─── THE GATEKEEPER ROUTING (Point 2) ───

// 1. Initiate Login (Sends OTP to Phone/Email OR handles Google/Apple/Microsoft/GitHub tokens)
router.post('/login', registerOrLogin);

// 2. Verify OTP (For Phone and Email logins - Checks if OTP is correct)
router.post('/verify-otp', verifyOTP);

// 3. Keep User Logged In (Facebook-level silent background login)
// AWS server will silently give a new access token before the old one expires
router.post('/refresh-token', refreshToken);

// 4. Secure Logout (Kills the session from AWS Server entirely)
router.post('/logout', logout);

export default router;
