// ==========================================
// TRINETRA BACKEND - FILE: controllers/translateController.js
// Blueprint: Point 12 (Multilingual Translation for App, Comments, Chat)
// 🚨 DEEP SEARCH UPDATE: 100% REAL AI TRANSLATION VIA META LLaMA 3 🚨
// ==========================================
import axios from 'axios';

export const translateText = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body; 
    // e.g., targetLanguage: 'hi' (Hindi), 'en' (English), 'bn' (Bengali)
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ success: false, error: "Text and targetLanguage are required." });
    }

    // Security Check: GitHub Secrets / .env
    const GROQ_API_KEY = process.env.GROQ_API_KEY; // Using Groq for Blazing Fast Meta LLaMA 3
    if (!GROQ_API_KEY) {
       console.error("[TriNetra Firewall] Meta API Key missing.");
       return res.status(500).json({ success: false, error: "TriNetra Translation Engine Offline" });
    }

    console.log(`[TriNetra Translation Engine] Translating to ${targetLanguage}...`);

    // 🚨 100% REAL TRANSLATION VIA META LLaMA 3 (GROQ API) 🚨
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama3-70b-8192", // Meta's highly capable model for fast translations
      messages: [
        { 
          role: "system", 
          content: "You are TriNetra's Multilingual Translation Engine. Translate the user's text accurately to the requested language. Return ONLY the translated text. No quotes, no explanations, no extra words." 
        }, 
        {
          role: "user",
          content: `Translate to ${targetLanguage}: "${text}"`
        }
      ],
      temperature: 0.2 // Low temperature for highly accurate and strict translations
    }, { 
      headers: { 
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      } 
    });

    // Extracting the real translated text from the AI response
    const realTranslatedText = response.data.choices[0].message.content.trim();

    res.status(200).json({ 
        success: true, 
        translatedText: realTranslatedText,
        engineUsed: "Meta LLaMA 3"
    });

  } catch (error) {
    console.error("[TriNetra Translator Error]:", error.response ? error.response.data : error.message);
    
    // Fallback: अगर किसी वजह से AI सर्वर डाउन है, तो ऐप क्रैश नहीं होगा, बल्कि ओरिजिनल टेक्स्ट दिखा देगा
    res.status(500).json({ 
        success: false, 
        error: "Translation API Offline",
        fallbackText: req.body.text 
    });
  }
};
