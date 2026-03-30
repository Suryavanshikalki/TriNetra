// ==========================================
// TRINETRA BACKEND - FILE 12: controllers/postController.js
// Blueprint: Point 4 (Feed, Reels, Marketplace, Original Media)
// ==========================================
import Post from '../models/Post.js';
// (In production, AWS SDK logic will be implemented here to upload original media)

export const createPost = async (req, res) => {
  try {
    const { userId, userName, userAvatar, content, mediaUrl, mediaType, isReel, targetLanguage } = req.body;

    // मल्टीलिंगुअल ट्रांसलेशन लॉजिक (API integration needed for real translation)
    const translatedContent = content ? `[Translated to ${targetLanguage || 'en'}]: ${content}` : "";

    const newPost = new Post({
      userId,
      userName,
      userAvatar,
      content: translatedContent || content,
      mediaUrl, // Point 4: URL to original AWS S3 file for direct download
      mediaType, // text, image, video, audio, pdf, none
      isReel: isReel || false
    });

    await newPost.save();
    
    console.log(`[FEED UPDATE] New ${isReel ? 'Reel' : 'Post'} created by ${userId}. Media: ${mediaType}`);

    res.status(201).json({ 
      success: true, 
      message: `${isReel ? 'Reel' : 'Post'} published successfully.`,
      post: newPost 
    });
  } catch (error) {
    console.error(`[POST CRASH] ${error.message}`);
    res.status(500).json({ success: false, message: "Error publishing post." });
  }
};

export const fetchFeed = async (req, res) => {
  try {
    // असली दुनिया में यहाँ Pagination (limit, skip) और एल्गोरिदम लगेगा
    const feed = await Post.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, count: feed.length, data: feed });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch feed." });
  }
};
