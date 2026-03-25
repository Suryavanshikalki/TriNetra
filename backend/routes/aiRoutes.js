// File: backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Ask Chatbot (Meta/GPT/Gemini) - Deducts daily free or uses Premium
router.post('/chatbot/ask', aiController.askChatbot);

// Agentic AI (Manus/Emergent) - Deducts from 300 Credits or 20 Free
router.post('/agentic/execute', aiController.executeAgenticTask);

// OS Builder (Highest Tier)
router.post('/os-builder/build', aiController.buildOS);

module.exports = router;
