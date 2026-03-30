import express from 'express';
import { processAIPrompt } from '../controllers/aiController.js';

const router = express.Router();

// Point 11: Mode A, B, and C (Human Brain Level AI)
router.post('/process', processAIPrompt);

export default router;
