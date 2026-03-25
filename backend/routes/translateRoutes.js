// File: backend/routes/translateRoutes.js
const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');

// POST /api/translate/text
router.post('/text', translateController.translateText);

module.exports = router;
