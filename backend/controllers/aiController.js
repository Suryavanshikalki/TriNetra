// ==========================================
// TRINETRA BACKEND - FILE 54: aiController.js
// Blueprint: Point 11 (6-in-1 Brain) & Point 12 (Multilingual)
// 🚨 DEEP SEARCH UPDATE: CONNECTED TO PYTHON MICROSERVICE (FastAPI) 🚨
// ==========================================
import User from '../models/User.js';
import axios from 'axios'; 

// ─── THE PYTHON AI ENGINE LINK ───
// यह URL आपके Python वाले FastAPI सर्वर का है
const PYTHON_AI_URL = process.env.PYTHON_AI_URL || "http://localhost:8000/api/v1/brain/process";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// --- Point 12: REAL Multilingual Translator ---
// (यह Node.js में ही रहेगा क्योंकि यह छोटा और तेज़ टास्क है)
export const translateContent = async (text, targetLanguage) => {
  if (!text || !targetLanguage || targetLanguage === 'en') return text;
  
  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama3-70b-8192",
      messages: [{ 
        role: "user", 
        content: `Translate the following text accurately to ${targetLanguage}. Return ONLY the translated text, nothing else, no quotes: "${text}"` 
      }]
    }, { headers: { Authorization: `Bearer ${GROQ_API_KEY}` } });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("[TriNetra Translator] Real Translation Failed:", error.message);
    return text; 
  }
};

// --- Point 11: Master AI Process (The Real Engine) ---
export const processAIPrompt = async (req, res) => {
  try {
    // userId 'requireAuth' Middleware से आएगा
    const userId = req.user.id; 
    const { prompt, targetLanguage, aiMode, requestedBrain } = req.body;
    
    // 1. User Authentication & Wallet Check
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found. Strict Entry Rule." });

    let activeBrain = requestedBrain || 'Meta';

    // ─── 2. THE ECONOMY & TIER LOGIC ───
    if (aiMode === 'Mode_A_FreePremium') {
        if (user.aiCreditsA_Free <= 0) return res.status(403).json({ success: false, message: "Today's 8 free messages exhausted." });
        user.aiCreditsA_Free -= 1;
        activeBrain = 'Meta';
    } 
    else if (aiMode === 'Mode_B_Paid') {
        if (user.aiCreditsB_Paid <= 0) return res.status(403).json({ success: false, message: "Monthly 300 Agentic Credits Exhausted." });
        user.aiCreditsB_Paid -= 1;
        activeBrain = 'Manus';
    } 
    else if (aiMode === 'Mode_C') {
        if (user.aiCreditsC <= 0) return res.status(403).json({ success: false, message: "Mode C Credits Exhausted. Recharge ₹9999 for 900 credits." });
        user.aiCreditsC -= 1;
        activeBrain = 'DeepSeek';
    } 
    else if (aiMode === 'OS_Creation') {
        if (user.aiCreditsOS <= 0) return res.status(403).json({ success: false, message: "OS Creation Credits Exhausted. Recharge ₹79999." });
        user.aiCreditsOS -= 1;
        activeBrain = 'Emergent';
    }

    // Save Wallet changes securely
    await user.save();

    // ─── 3. SEND REQUEST TO FASTAPI PYTHON MICROSERVICE ───
    let aiResponseText = "";
    
    try {
        // Node.js अब सीधा API Keys (OpenAI/Gemini) को कॉल नहीं करेगा, 
        // वह Python सर्वर को कमांड देगा और Python सर्वर भारी कैलकुलेशन करके वापस जवाब देगा।
        const pythonResponse = await axios.post(PYTHON_AI_URL, {
            prompt: prompt,
            mode: aiMode,
            requested_brain: activeBrain,
            user_id: userId
        });
        
        aiResponseText = pythonResponse.data.ai_response;
        activeBrain = pythonResponse.data.engine_used;

    } catch (apiErr) {
        console.error(`[TriNetra Link Error] Python Microservice Failed:`, apiErr.message);
        // अगर Python सर्वर डाउन हो, तो इमरजेंसी में Groq (Meta) का इस्तेमाल करें
        aiResponseText = "⚠️ TriNetra Master Brain is currently syncing. Please try again in 5 seconds.";
    }

    // ─── 4. REAL TRANSLATION (Point 12) ───
    if (targetLanguage && targetLanguage !== 'en') {
        aiResponseText = await translateContent(aiResponseText, targetLanguage);
    }

    // ─── 5. FINAL SUCCESS RESPONSE ───
    res.status(200).json({ 
      success: true, 
      brainUsed: activeBrain, 
      response: aiResponseText,
      walletStatus: {
        modeA_Free: user.aiCreditsA_Free,
        modeC_Credits: user.aiCreditsC,
        modeB_Credits: user.aiCreditsB_Paid,
        os_Credits: user.aiCreditsOS
      }
    });

  } catch (error) {
    console.error("[TriNetra Critical] Master AI Engine Error:", error);
    res.status(500).json({ success: false, message: "TriNetra AI Engine Critical Error. Escalate to TriNetra DB." });
  }
};
