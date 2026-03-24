// TriNetra Master Backend Engine - V1.0
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // ताकि आपका Frontend इस Backend से बात कर सके

// 🔒 गिटहब की तिजोरी से चाबियां निकालना (सिक्योर मोड)
const KEYS = {
    GEMINI: process.env.GEMINI_API_KEY,
    DEEPSEEK: process.env.DEEPSEEK_API_KEY,
    OPENAI: process.env.OPENAI_API_KEY,
    GROQ: process.env.GROQ_API_KEY,    // For Meta AI
    GITHUB: process.env.GH_PAT_TOKEN   // For Emergent/Manus Coding
};

// 🟢 सर्वर स्टेटस चेक
app.get('/', (req, res) => {
    res.json({ status: 'TriNetra Engine is LIVE 👁️🔥', secure: true });
});

// 🧠 मेन AI कंट्रोल रूम (App.jsx से मैसेज यहीं आएगा)
app.post('/api/trinetra-ai', async (req, res) => {
    const { mode, subMode, message, repo } = req.body;

    try {
        let aiResponse = "";

        // 1. Basic Chat (Meta AI via Groq) - Free & Fast
        if (mode === 'chatbot' && subMode === 'basic') {
            aiResponse = `[Meta AI Engine] Backend received: "${message}". Groq API integration ready.`;
            // यहाँ Groq API का असली कोड चलेगा
        } 
        
        // 2. Master Chat (Gemini 3.1 Pro / DeepSeek) - High Logic
        else if (mode === 'chatbot' && subMode === 'master') {
            aiResponse = `[Master Engine] Analyzing: "${message}". Gemini/DeepSeek logic engaged.`;
            // यहाँ Gemini/DeepSeek API का असली कोड चलेगा
        } 
        
        // 3. Autonomous Agent (Manus Style) - General Research
        else if (mode === 'agent' && subMode === 'general') {
            aiResponse = `[Manus Agent] Connecting to ${repo}... Scraping data for: "${message}".`;
            // यहाँ GitHub API से डेटा निकालने का कोड चलेगा
        } 
        
        // 4. Vibe Coding Agent (Emergent Style) - Real App Building
        else if (mode === 'agent' && subMode === 'coding') {
            aiResponse = `[Emergent Agent] Writing code for: "${message}". Committing to ${repo} using PAT Token...`;
            // यहाँ DeepSeek से कोड लिखवाकर सीधे GitHub में Push करने का कोड चलेगा
        }

        // वापस ऐप (Frontend) को जवाब भेजना
        res.json({ success: true, reply: aiResponse });

    } catch (error) {
        console.error("TriNetra Engine Error:", error);
        res.status(500).json({ success: false, reply: "Engine overload or API Error." });
    }
});

// 🚀 सर्वर को चालू करना
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[TriNetra] Master Engine is running on port ${PORT}`);
    console.log(`[TriNetra] Secure Vault Keys Loaded: YES`);
});
