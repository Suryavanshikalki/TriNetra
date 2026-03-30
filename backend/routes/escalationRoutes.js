import express from 'express';
import { triggerEscalation } from '../controllers/escalationController.js';

const router = express.Router();

// Point 4: Local to International Escalation
router.post('/escalate', triggerEscalation);

export default router;
