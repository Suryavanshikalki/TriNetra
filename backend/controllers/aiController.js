// File: backend/controllers/aiController.js
const User = require('../models/User');

// ==========================================
// 🚀 MODE A: Chatbot (Meta/Gemini/GPT Level)
// ==========================================
exports.askChatbot = async (req, res) => {
  try {
    const { userId, prompt } = req.body;
    const user = await User.findOne({ trinetraId: userId }) || await User.findOne({ _id: userId });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 🛡️ BLUEPRINT RULE: Free Premium has 8 messages daily. Paid has Unlimited.
    // user.isPaidChatbot: Boolean (True for ₹2000 plan)
    if (!user.isPaidChatbot) {
      if (user.dailyAiLimit <= 0) {
        return res.status(403).json({ 
          success: false, 
          message: "Daily free 8-message limit reached. Recharge Paid Plan (₹2000/mo) for Unlimited Power." 
        });
      }
      user.dailyAiLimit -= 1; // Deduct from 8 daily free
    }

    // AI Logic (Meta/GPT/Gemini API integration here)
    // ...
    
    await user.save();
    res.status(200).json({ 
      success: true, 
      response: "TriNetra AI: Here is your answer.",
      remainingFreeLimit: user.isPaidChatbot ? 'Unlimited' : user.dailyAiLimit
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "AI Processing Error" });
  }
};

// ==========================================
// 🚀 MODE B: Agentic AI (Manus/Emergent Level)
// ==========================================
exports.executeAgenticTask = async (req, res) => {
  try {
    const { userId, task } = req.body;
    const user = await User.findOne({ trinetraId: userId }) || await User.findOne({ _id: userId });

    // 🛡️ BLUEPRINT RULE: 20 Free Credits once, then ₹3999 for 500 Credits (One-time, not daily)
    if (user.agenticCredits <= 0) {
      return res.status(403).json({ 
        success: false, 
        message: "Agentic Credits exhausted. Buy Paid Standard plan (₹3999) for 500 Credits." 
      });
    }

    // Process with Manus/Emergent AI
    // ...
    user.agenticCredits -= 1; 
    await user.save();

    res.status(200).json({ 
      success: true, 
      response: "Agentic task executed. Code/App structure generated.",
      remainingCredits: user.agenticCredits
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Agentic AI Error" });
  }
};

// ==========================================
// 🚀 OS CREATION TIER (The Ultimate Tier)
// ==========================================
exports.buildOS = async (req, res) => {
  try {
    const { userId, osDetails } = req.body;
    const user = await User.findOne({ trinetraId: userId }) || await User.findOne({ _id: userId });

    // 🛡️ BLUEPRINT RULE: OS Creation requires the ₹69,999 Tier with 2500 Credits.
    if (!user.osCreationAccess || user.osCredits <= 0) {
      return res.status(403).json({ 
        success: false, 
        message: "OS Creation requires the ₹69,999 Premium Tier. (Includes 2500 Premium Credits)" 
      });
    }

    // OS Building Logic
    // ...
    user.osCredits -= 1;
    await user.save();

    res.status(200).json({ 
      success: true, 
      response: "Initializing OS Builder Workspace... Logic & UI rendering started.",
      remainingOsCredits: user.osCredits
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "OS Builder Error" });
  }
};
