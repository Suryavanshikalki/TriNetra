// File: backend/controllers/authController.js
const User = require('../models/User');

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
