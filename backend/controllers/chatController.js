// ==========================================
// TRINETRA BACKEND - FILE 11: controllers/chatController.js
// Blueprint: Point 5 (WhatsApp 2.0, Mutual Only, No AI allowed)
// Multilingual Translation Link Included
// ==========================================
import Chat from '../models/Chat.js';
import User from '../models/User.js';

// Point 3 & 5: STRICT MUTUAL CONNECTION CHECK
const checkMutualConnection = async (senderId, receiverId) => {
  const sender = await User.findOne({ trinetraId: senderId });
  const receiver = await User.findOne({ trinetraId: receiverId });

  if (!sender || !receiver) return false;

  // Mutual Check: Sender follows Receiver AND Receiver follows Sender
  const isMutual = sender.following.includes(receiverId) && receiver.following.includes(senderId);
  return isMutual;
};

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, roomId, message, messageType, mediaUrl, targetLanguage } = req.body;

    // 🚨 STRICT RULE: AI No-Entry in Messenger
    if (senderId === 'AI' || receiverId === 'AI') {
      return res.status(403).json({ success: false, message: "System Block: AI is strictly prohibited in Messenger." });
    }

    // Mutual Connection Validator
    const isMutual = await checkMutualConnection(senderId, receiverId);
    if (!isMutual) {
      return res.status(403).json({ 
        success: false, 
        message: "TriNetra Rule: You can only message Mutual Followers. Connection blocked." 
      });
    }

    // Point 5: Multi-format Original Downloadable Media (Text, Mic, Camera, PDF, GIF, etc.)
    const newChatMessage = new Chat({
      roomId,
      senderId,
      message, // Multilingual translation will process this via Frontend/AI Route
      mediaUrl: mediaUrl || "",
      messageType: messageType || "text"
    });

    await newChatMessage.save();
    console.log(`[WHATSAPP 2.0] Message sent in room ${roomId}. Format: ${messageType}`);

    res.status(200).json({ 
      success: true, 
      message: "Message Delivered", 
      data: newChatMessage 
    });

  } catch (error) {
    console.error(`[MESSENGER CRASH] ${error.message}`);
    res.status(500).json({ success: false, message: "Messenger Engine Error" });
  }
};
