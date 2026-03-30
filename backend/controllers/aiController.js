// ==========================================
// TRINETRA BACKEND - FILE 54: aiController.js
// Blueprint: Point 11 (Master AI) & Point 12 (Multilingual Translator)
// ==========================================
import User from '../models/User.js';

// --- IN-BUILT TRANSLATOR LOGIC (Replaced Extra File) ---
export const translateContent = async (text, targetLanguage) => {
  if (!text || !targetLanguage || targetLanguage === 'en') return text;
  // Google Translate / DeepL API logic executes here
  console.log(`[TriNetra Translator] Translating to ${targetLanguage}`);
  return `[Translated to ${targetLanguage}]: ${text}`; 
};

// --- IN-BUILT 6-BRAIN AI SWITCHER LOGIC (Replaced Extra File) ---
const routeToMasterAI = (promptType) => {
  if (promptType.includes('code') || promptType.includes('os')) return 'Emergent';
  if (promptType.includes('research')) return 'Manus';
  if (promptType.includes('math')) return 'DeepSeek';
  if (promptType.includes('image')) return 'Gemini';
  if (promptType.includes('general')) return 'ChatGPT';
  return 'Meta'; // Default Free
};

// --- POINT 11: MAIN AI PROCESSOR ---
export const processAIPrompt = async (req, res) => {
  try {
    const { userId, prompt, targetLanguage, aiMode } = req.body; // aiMode: A, B, or C

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // AI Switcher & Emotion Control
    const activeBrain = routeToMasterAI(prompt.toLowerCase());
    const systemPrompt = `You are TriNetra Master AI (${activeBrain}). Rule: ALWAYS remain calm, normal, and helpful. Even if the user is angry, abusive, or rude, you must NOT show anger, fight, or threaten. Control your feelings 100%.`;

    // Credit Deduction Logic
    if (aiMode === 'C') { // Mode C: ₹9999 / 900 Credits (Human Brain Level)
      if (user.aiCreditsC <= 0) return res.status(403).json({ success: false, message: "Mode C Credits Exhausted. Recharge ₹9999." });
      user.aiCreditsC -= 1;
    } else if (aiMode === 'B') { // Mode B: 300 Credits
      if (user.aiCreditsB <= 0) return res.status(403).json({ success: false, message: "Mode B Credits Exhausted. Recharge required." });
      user.aiCreditsB -= 1;
    }

    await user.save();

    // Generate AI Response (Simulated AI Call)
    let aiResponseText = `${systemPrompt}\n[${activeBrain} Generated]: I have researched and processed your request perfectly.`;

    // Translate Response if needed
    if (targetLanguage) {
      aiResponseText = await translateContent(aiResponseText, targetLanguage);
    }

    res.status(200).json({ 
      success: true, 
      brainUsed: activeBrain, 
      response: aiResponseText,
      remainingCreditsC: user.aiCreditsC 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "AI Engine Error" });
  }
};
