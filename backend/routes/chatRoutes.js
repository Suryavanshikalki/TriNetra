// ==========================================
// TRINETRA BACKEND - FILE 49: routes/chatRoutes.js
// Blueprint: Point 5 (WhatsApp 2.0 Messenger)
// 🚨 DEEP SEARCH UPDATE: ES6 FIXED, AUTH GUARD, MULTER & GROUPS ADDED 🚨
// ==========================================
import express from 'express';
import multer from 'multer';

// ─── 1. REAL CONTROLLERS & GUARDS ───
import { 
    getMutualFollowers, 
    getChatHistory, 
    uploadChatMedia,
    createGroup,
    deleteMessage,
    reactToMessage 
} from '../controllers/chatController.js';
import { requireAuth } from '../middlewares/authMiddleware.js'; // The Privacy Guard

const router = express.Router();

// ─── 2. AWS FILE UPLOAD PARSER (Multer Memory Storage) ───
// यह फाइल को RAM में होल्ड करेगा ताकि हमारा fileUploader.js उसे सीधा AWS S3 पर भेज सके (50MB Limit)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } 
});

// ==========================================
// 🚀 TRINETRA WHATSAPP 2.0 ROUTES (100% Secured)
// ==========================================

// 1. Get Mutual Friends (चैट लिस्ट में सिर्फ वही दिखेंगे जो म्यूचुअल हैं - Point 5)
router.get('/mutuals/:userId', requireAuth, getMutualFollowers);

// 2. Get Chat History (करोड़ों मैसेज को मिलीसेकंड में लोड करने के लिए)
router.get('/history/:roomId', requireAuth, getChatHistory);

// 3. Upload Chat Media (Text, Photo, Video, Audio, Mic, PDF, Camera)
// `upload.single('media')` फ्रंटएंड से आने वाली असली फाइल को पकड़ेगा
router.post('/uploadMedia', requireAuth, upload.single('media'), uploadChatMedia);

// 4. Create Group Chat (Point 5 - Group Audio/Video Calling Engine Sync)
router.post('/group/create', requireAuth, createGroup);

// 5. Message Reactions (Facebook/WhatsApp Level Emojis)
router.post('/react', requireAuth, reactToMessage);

// 6. Delete For Everyone (सिक्योरिटी और प्राइवेसी)
router.delete('/delete/:messageId', requireAuth, deleteMessage);

export default router;
