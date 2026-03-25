// File: backend/controllers/aiController.js
const User = require('../models/User');

exports.askChatbot = async (req, res) => {
  try {
    const { userId, prompt } = req.body;
    const user = await User.findOne({ trinetraId: userId });

    if (user.aiChatbotCredits <= 0) {
      return res.status(403).json({ success: false, message: "Daily free limit reached. Please recharge 3x Pro Plan." });
    }

    // Process AI logic here with Meta/GPT/Gemini API
    user.aiChatbotCredits -= 1; // Deduct 1 credit for free users
    await user.save();

    res.status(200).json({ success: true, response: "Here is your Chatbot AI answer." });
  } catch (error) {
    res.status(500).json({ success: false, error: "AI Processing Error" });
  }
};

exports.executeAgenticTask = async (req, res) => {
  try {
    const { userId, task } = req.body;
    const user = await User.findOne({ trinetraId: userId });

    if (user.agenticCredits <= 0) {
      return res.status(403).json({ success: false, message: "Agentic Credits exhausted. Buy Standard 300 Credits plan." });
    }

    // Process with Manus/Emergent AI
    user.agenticCredits -= 1; 
    await user.save();

    res.status(200).json({ success: true, response: "Agentic task executed. Code generated." });
  } catch (error) {
    res.status(500).json({ success: false, error: "Agentic AI Error" });
  }
};

exports.buildOS = async (req, res) => {
  try {
    const { userId, osDetails } = req.body;
    const user = await User.findOne({ trinetraId: userId });

    if (!user.osCreationAccess) {
      return res.status(403).json({ success: false, message: "OS Creation requires the ₹49,999 Tier." });
    }

    res.status(200).json({ success: true, response: "Initializing OS Builder Workspace..." });
  } catch (error) {
    res.status(500).json({ success: false, error: "OS Builder Error" });
  }
};
