import express from 'express';
import { registerOrLogin } from '../controllers/authController.js';

const router = express.Router();

// Point 2: Login via 5 methods + GitHub for AI
router.post('/login', registerOrLogin);

export default router;
