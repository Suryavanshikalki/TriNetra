// File: backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', authController.loginUser);

// GET /api/auth/profile/:id
router.get('/profile/:id', authController.getUserProfile);

// PUT /api/auth/profile/update
router.put('/profile/update', authController.updateProfile);

module.exports = router;
