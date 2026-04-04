// ==========================================
// TRINETRA BACKEND - FILE 48: routes/aiRoutes.js
// Blueprint: Point 11 (Master AI - Mode A, B, C, OS Tier) & Point 12 (Multilingual)
// 🚨 DEEP SEARCH UPDATE: GATEKEEPER SECURITY & TRANSLATION SYNCED 🚨
// ==========================================
import express from 'express';
import { processAIPrompt } from '../controllers/aiController.js';
import { translateText } from '../controllers/translateController.js';
import { requireAuth } from '../middlewares/authMiddleware.js'; // The Gatekeeper Guard

const router = express.Router();

// ─── 1. MASTER AI CHAT ENGINE (Point 11) ───
// ✅ requireAuth सुनिश्चित करेगा कि केवल वेरिफाइड यूज़र (जिसके पास क्रेडिट्स हैं) ही AI को एक्सेस कर सके
// ✅ यही राउट 6-in-1 ब्रेन (Meta, ChatGPT, Gemini, DeepSeek, Manus, Emergent) को कंट्रोल करेगा
router.post('/chat', requireAuth, processAIPrompt);

// ─── 2. INSTANT MULTILINGUAL TRANSLATION (Point 12) ───
// ✅ यह ऐप की भाषा, पोस्ट, कमेंट और मैसेंजर को किसी भी भाषा में ट्रांसलेट करेगा
router.post('/translate', requireAuth, translateText);

export default router;
