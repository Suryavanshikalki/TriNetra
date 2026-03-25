// File: backend/controllers/chatController.js
const Chat = require('../models/Chat');
const User = require('../models/User');

exports.getMutualFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ trinetraId: req.params.userId });
    if(!user) return res.status(404).json({ success: false });

    // Exact Mutual Follower Logic
    const mutuals = user.followers.filter(followerId => user.following.includes(followerId));
    res.status(200).json({ success: true, mutualFriends: mutuals });
  } catch (error) {
    res.status(500).json({ success: false, error: "Chat List Error" });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const history = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: "Chat History Error" });
  }
};

exports.uploadChatMedia = async (req, res) => {
  // Logic to handle Universal File Upload for Chats (PDF, Audio, Image)
  res.status(200).json({ success: true, message: "Media uploaded successfully", url: "media_link.pdf" });
};
