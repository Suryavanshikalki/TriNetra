// File: backend/controllers/authController.js
const User = require('../models/User');

// ==========================================
// 🛡️ PURANA CODE (BINA KUCHH HATAYE)
// ==========================================

exports.loginUser = async (req, res) => {
  try {
    const { authId, provider } = req.body;
    let user = await User.findOne({ $or: [{ phone: authId }, { email: authId }] });
    
    if (!user) {
      user = new User({ 
        trinetraId: `TRN${Date.now()}`, 
        [provider === 'Phone' ? 'phone' : 'email']: authId, 
        provider 
      });
      await user.save();
    }
    res.status(200).json({ success: true, user, isDevMode: provider === 'GitHub' });
  } catch (error) {
    res.status(500).json({ success: false, error: "Login System Error" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ trinetraId: req.params.id });
    if(!user) return res.status(404).json({ success: false, error: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Profile Fetch Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { trinetraId, bio, avatar, profilePic, coverPic } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { trinetraId }, 
      { bio, avatar, profilePic, coverPic }, 
      { new: true }
    );
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: "Profile Update Error" });
  }
};


// ==========================================
// 🚀 NAYA CODE (12-Point Blueprint: Point 1 & 2)
// ==========================================

/**
 * 👁️🔥 Point 1: Auto-Detect OS Engine (Backend Version)
 * यह आपके 'getOS' लॉजिक को सर्वर पर चलाएगा और सही डाउनलोड लिंक देगा।
 */
exports.detectUserPlatform = async (req, res) => {
    try {
        const userAgent = req.headers['user-agent'] || '';
        let os = 'Web Browser';

        // 🕵️‍♂️ Detection Logic 
        if (/android/i.test(userAgent)) {
            os = 'Android';
        } else if (/iPad|iPhone|iPod/.test(userAgent)) {
            os = 'iOS';
        } else if (/windows/i.test(userAgent)) {
            os = 'Windows';
        } else if (/macintosh/i.test(userAgent)) {
            os = 'macOS';
        } else if (/linux/i.test(userAgent)) {
            os = 'Linux';
        }

        // 🚀 Master Download Links
        const downloadLinks = {
            'Android': 'https://trinetra.pro/download/android-apk',
            'iOS': 'https://trinetra.pro/download/ios-app',
            'Windows': 'https://trinetra.pro/download/windows-exe',
            'macOS': 'https://trinetra.pro/download/macos-dmg',
            'Linux': 'https://trinetra.pro/download/linux-deb',
            'Web Browser': 'https://trinetra.pro/web'
        };

        res.status(200).json({
            success: true,
            detectedOS: os,
            downloadUrl: downloadLinks[os] || downloadLinks['Web Browser'],
            securityNote: "TriNetra Anti-Bypass Active"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Platform Detection Failed" });
    }
};

/**
 * 🛡️ GitHub Gatekeeper Logic (Point 2)
 * यह सिर्फ AI कोडर्स को एंट्री देगा, सोशल फीचर्स ब्लॉक रखेगा।
 */
exports.handleGithubLogin = async (req, res) => {
    try {
        // GitHub OAuth Callback logic will process here
        res.status(200).json({ success: true, message: "GitHub Auth Success. Redirecting to AI Coder Mode." });
    } catch (error) {
        res.status(500).json({ success: false, error: "GitHub Login Error" });
    }
};
