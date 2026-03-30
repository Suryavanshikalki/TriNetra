import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// असली TriNetra ID बनाने का लॉजिक (Point 2: Permanent ID)
const generateTriNetraId = () => {
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  const year = new Date().getFullYear();
  return `TRN-${year}-${randomStr}`;
};

export const registerOrLogin = async (req, res) => {
  try {
    const { authProvider, authId, name, email, phone } = req.body;

    // Point 2: Strict Entry Rule (बिना लॉगिन नो एंट्री)
    if (!authProvider || !authId) {
      return res.status(400).json({ success: false, message: "TriNetra Gatekeeper: Auth details missing. Entry Denied." });
    }

    // चेक करें कि यूज़र पहले से है या नहीं
    let user = await User.findOne({ authId, authProvider });

    if (!user) {
      // नया यूज़र - Permanent ID बनाएँ
      const newId = generateTriNetraId();
      
      // Point 2 Rule: GitHub Login = AI Only
      const isAIOnlyFlag = authProvider === 'github';

      user = new User({
        trinetraId: newId,
        authProvider,
        authId,
        name: name || `User_${newId}`,
        isAIOnly: isAIOnlyFlag,
      });

      await user.save();
      console.log(`[GATEKEEPER] New TriNetra Identity Forged: ${newId} via ${authProvider}`);
    } else {
      console.log(`[GATEKEEPER] Welcome Back: ${user.trinetraId}`);
    }

    // सुरक्षा के लिए JWT Token (Render के .env से सीक्रेट लेगा)
    const token = jwt.sign(
      { userId: user._id, trinetraId: user.trinetraId, isAIOnly: user.isAIOnly },
      process.env.JWT_SECRET || 'trinetra_master_key_fallback',
      { expiresIn: '365d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        trinetraId: user.trinetraId,
        name: user.name,
        isAIOnly: user.isAIOnly,
        aiProfile: user.aiProfile,
        walletBalance: user.walletBalance,
        preferredGateway: user.preferredGateway
      }
    });

  } catch (error) {
    console.error(`[AUTH CRASH] ${error.message}`);
    res.status(500).json({ success: false, message: "Gatekeeper Server Error" });
  }
};
