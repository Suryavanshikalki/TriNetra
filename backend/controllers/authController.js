import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerOrLogin = async (req, res) => {
  try {
    const { phone, email, method } = req.body;
    // Point 2: Strict Entry Logic
    let user = await User.findOne({ $or: [{ phone }, { email }] });
    if (!user) {
      user = new User({ 
        phone, 
        email, 
        trinetraId: `TRN-${Math.floor(100000 + Math.random() * 900000)}`,
        loginMethod: method 
      });
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Auth Error" });
  }
};

// Point 12: Settings A to H (Preferences & Privacy)
export const updateDeepSettings = async (req, res) => {
  try {
    const { userId, settingsType, data } = req.body; 
    // settingsType = 'Preferences', 'Privacy', 'Notifications' etc.
    const user = await User.findById(userId);
    user[settingsType] = { ...user[settingsType], ...data };
    await user.save();
    res.status(200).json({ success: true, message: `Settings ${settingsType} Locked.` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Settings Sync Error" });
  }
};
