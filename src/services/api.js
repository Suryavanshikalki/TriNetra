// File: src/services/api.js
import axios from 'axios';

/**
 * 👁️🔥 TRINETRA MASTER CONNECTION LOCK
 * यहाँ हमने पुराना लिंक हटाकर आपका असली और फाइनल Render URL डाल दिया है।
 * अब आपका फ्रंटएंड (डिज़ाइन) सीधे आपके लाइव बैकएंड से 1000% कनेक्ट हो जाएगा।
 */
const API_BASE_URL = 'https://trinetra-umys.onrender.com/api'; // 🚀 Asli Link Lock Ho Gaya

// 1. GATEKEEPER: LOGIN SYSTEM (Point 2: 5 Ways + GitHub)
export const loginUser = async (authId, provider) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { authId, provider });
        return response.data;
    } catch (error) {
        console.error("Login API Error:", error);
        return { success: false, error: "Network Error: Backend not responding" };
    }
};

// 2. AUTO-ESCALATION: JUSTICE SYSTEM (Point 4: ₹20,000 Tier)
// MLA ➡️ CM ➡️ PM ➡️ Supreme Court logic
export const escalateComplaint = async (complaintId, category, currentLevel) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payment/activate-escalation`, { 
            complaintId, 
            category, 
            level: currentLevel // e.g., 'MLA', 'CM', 'PM'
        });
        return response.data;
    } catch (error) {
        console.error("Escalation API Error:", error);
        return { success: false, error: "Escalation Failed" };
    }
};

// 3. THE ECONOMY: PAYMENTS (Point 6-10: 1,3,6,9,12 Months)
export const purchaseSubscription = async (type, months, userId) => {
    try {
        // Recharge-AI, Subscribe-Boost, या Activate-Escalation के लिए कॉमन रूट
        const response = await axios.post(`${API_BASE_URL}/payment/verify`, { type, months, userId });
        return response.data;
    } catch (error) {
        console.error("Payment API Error:", error);
        return { success: false, error: "Payment Verification Failed" };
    }
};

// 4. UNIVERSAL TRANSLATION: MULTILANGUAGE (Point 13: 6-in-1 AI Power)
/**
 * 🌍 यह फंक्शन फीड, कमेंट और मैसेज को तुरंत आपकी भाषा में बदलेगा।
 */
export const translateText = async (text, targetLanguage, userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/ai/translate`, { 
            text, 
            targetLanguage, 
            userId 
        });
        return response.data; // AI से आया हुआ ट्रांसलेटेड टेक्स्ट
    } catch (error) {
        console.error("Translation API Error:", error);
        return { success: false, translatedText: text }; // एरर होने पर ओरिजिनल टेक्स्ट ही दिखाएगा
    }
};

// 5. MASTER AI INTERACTION (Point 11: Chatbot & Agentic)
export const askMasterAI = async (prompt, mode, userId) => {
    try {
        const endpoint = mode === 'Agentic' ? '/ai/execute-agentic' : '/ai/ask-chatbot';
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, { prompt, userId });
        return response.data;
    } catch (error) {
        console.error("Master AI API Error:", error);
        return { success: false, error: "AI is busy thinking..." };
    }
};

export default {
    loginUser,
    escalateComplaint,
    purchaseSubscription,
    translateText,
    askMasterAI
};
