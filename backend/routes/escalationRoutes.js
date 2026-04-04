// ==========================================
// TRINETRA BACKEND - FILE 50: routes/escalationRoutes.js
// Blueprint: Point 4 (Justice Engine - MLA to Supreme Court Auto-Escalation)
// 🚨 DEEP SEARCH UPDATE: ANTI-SPAM GUARD & STATUS TRACKING WIRING 🚨
// ==========================================
import express from 'express';
import { 
    triggerEscalation, 
    getEscalationStatus 
} from '../controllers/escalationController.js';
import { requireAuth } from '../middlewares/authMiddleware.js'; // The Gatekeeper Shield

const router = express.Router();

// ==========================================
// ⚖️ TRINETRA JUSTICE ENGINE ROUTES
// ==========================================

// 1. Trigger Auto-Escalation (Complaint File Karna)
// ✅ requireAuth सुनिश्चित करेगा कि केवल वेरिफाइड इंसान ही शिकायत दर्ज करे, बॉट्स नहीं।
router.post('/trigger', requireAuth, triggerEscalation);

// 2. Track Escalation Status (Live Tracking)
// ✅ यूज़र ऐप में देख सकेगा कि उसकी फाइल अभी किस अथॉरिटी (CM, PM, Supreme Court) के पास पेंडिंग है।
router.get('/status/:complaintId', requireAuth, getEscalationStatus);

export default router;
