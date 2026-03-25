// File: backend/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const escalationController = require('../controllers/escalationController');

// Posts
router.post('/create', postController.createPost);
router.get('/feed', postController.getFeed);
router.post('/like', postController.likePost);
router.post('/comment', postController.addComment);

// Auto-Escalation (MLA/CM System)
router.post('/escalate', escalationController.escalateIssue);

module.exports = router;
