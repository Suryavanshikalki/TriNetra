// File: backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get mutual friends for chat list
router.get('/mutuals/:userId', chatController.getMutualFollowers);

// Get chat history between two users
router.get('/history/:senderId/:receiverId', chatController.getChatHistory);

// Upload Chat Media (PDF, Audio, Image)
router.post('/uploadMedia', chatController.uploadChatMedia);

module.exports = router;
