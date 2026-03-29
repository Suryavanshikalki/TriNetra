// ==========================================
// TRINETRA BACKEND - AUTH CONTROLLER (File 5)
// Blueprint: Point 2 (Gatekeeper & Permanent ID)
// ==========================================
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// TriNetra ID Generator Rule
const generateTriNetraId = () => {
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  const year = new Date().getFullYear();
  return `TRN-${year}-${randomStr}`;
};

export const registerOrLogin = async (req, res) => {
  try {
    const { authProvider, authId, name } = req.body;

    // Strict Entry: No Skip Button Rule
    if (!authProvider || !authId) {
      return res.status(400).json({ success: false, message: "TriNetra Gatekeeper: Auth details missing. Entry Denied." });
    }

    let user = await User.findOne({ authId, authProvider });

    if (!user) {
      // Create New Permanent ID
      const newId = generateTriNetraId();
      
      // Point 2 Rule: GitHub limits to AI Only
      const isAIOnlyFlag = authProvider === 'github';

      user = new User({
        trinetraId: newId,
        authProvider,
        authId,
        name: name || `User_${newId}`,
        isAIOnly: isAIOnlyFlag,
      });

      await user.save();
      console.log(`[GATEKEEPER] New TriNetra Identity Forged: ${newId}`);
    }

    // Token Generation (Using your Render JWT Secret)
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
        walletBalance: user.walletBalance
      }
    });

  } catch (error) {
    console.error(`[AUTH CRASH] ${error.message}`);
    res.status(500).json({ success: false, message: "Gatekeeper Server Error" });
  }
};
