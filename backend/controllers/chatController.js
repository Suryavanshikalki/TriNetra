// ==========================================
// TRINETRA BACKEND - CHAT CONTROLLER (File 10)
// Blueprint: Point 3 & 5 (Mutual Connections & WhatsApp 2.0)
// ==========================================
import Message from '../models/Message.js';
import User from '../models/User.js';

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, roomId, content, mediaUrl, mediaType, isGroupMessage } = req.body;

    // Point 5 & 3 Rule: Strict Mutual Follower Check for 1-on-1 Chat
    if (!isGroupMessage) {
      const sender = await User.findOne({ trinetraId: senderId });
      const receiver = await User.findOne({ trinetraId: receiverId });

      if (!sender || !receiver) return res.status(404).json({ success: false, message: "User not found" });

      const isMutual = sender.followers.includes(receiver._id) && receiver.followers.includes(sender._id);
      
      if (!isMutual) {
        return res.status(403).json({ 
          success: false, 
          message: "TriNetra Strict Rule: Messaging allowed ONLY for mutual followers. Connection Blocked." 
        });
      }
    }

    // Point 5: AI No-Entry Rule (Ensure no AI IDs are part of this specific chat route)
    if (receiverId === 'AI_MASTER' || senderId === 'AI_MASTER') {
      return res.status(403).json({ success: false, message: "AI is strictly prohibited in Social Messenger." });
    }

    const newMessage = new Message({
      roomId,
      senderId,
      content,
      mediaUrl,
      mediaType,
      isGroupMessage: isGroupMessage || false,
      readBy: [senderId]
    });

    await newMessage.save();

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error(`[CHAT CRASH] ${error.message}`);
    res.status(500).json({ success: false, message: "TriNetra Messenger Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};
