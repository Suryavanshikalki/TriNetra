import express from 'express';
import { processPayment, applyBoost } from '../controllers/paymentController.js';

const router = express.Router();

// Point 6-10: Payment Flow (No Razorpay) & 4 Boost Models
router.post('/pay', processPayment);
router.post('/boost', applyBoost);

export default router;
