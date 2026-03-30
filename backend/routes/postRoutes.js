import express from 'express';
import { createPost, getFeed } from '../controllers/postController.js';
import { updateSettings, handleFollow } from '../controllers/userController.js';

const router = express.Router();

// Point 4: Feed & Reels Logic
router.post('/create', createPost);
router.get('/feed', getFeed);

// Point 3 & 12: Profile & Deep Settings (A to H)
router.put('/settings/update', updateSettings);
router.post('/follow', handleFollow);

export default router;
