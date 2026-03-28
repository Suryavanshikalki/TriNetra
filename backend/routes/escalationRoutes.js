// File: backend/routes/escalationRoutes.js
const express = require('express');
const router = express.Router();
const escalationController = require('../controllers/escalationController');
const { protect } = require('../middleware/authMiddleware'); // Security Check

/**
 * 👁️🔥 TRINETRA JUSTICE SYSTEM ROUTES (Point 4)
 * ये रास्ते तय करेंगे कि शिकायत कब और कैसे ऊपर के लेवल पर जाएगी।
 */

// 1. नई शिकायत दर्ज करना (Local Officer Level)
router.post('/create', protect, escalationController.createComplaint);

// 2. शिकायत को अगले लेवल पर भेजना (MLA ➡️ CM ➡️ PM ➡️ Supreme Court)
// इसमें चेक होगा कि क्या यूज़र ने ₹20,000 वाला जस्टिस प्लान लिया है
router.post('/promote', protect, escalationController.promoteEscalation);

// 3. लाइव ट्रैकिंग (यूज़र देख सके कि उसकी फाइल कहाँ अटकी है)
router.get('/track/:complaintId', protect, escalationController.getEscalationStatus);

// 4. ऑटो-एस्केलेशन ट्रिगर (System checks if no action taken within time limit)
router.post('/auto-trigger', protect, escalationController.checkAutoEscalation);

// 5. पब्लिक बहस स्कोर अपडेट (High engagement = Faster Escalation)
router.patch('/update-score/:postId', protect, escalationController.updateDebateScore);

module.exports = router;
