import Post from '../models/Post.js';
import User from '../models/User.js';

// Point 4: Feed, Reels, and Media Upload (Original Quality)
export const createPost = async (req, res) => {
  try {
    const { userId, content, mediaUrl, mediaType, isReel, isMarketplace, price } = req.body;

    const newPost = new Post({
      userId,
      content,
      mediaUrl, // AWS S3 link for original format download
      mediaType, // Photo, Video, Audio, PDF, etc.
      isReel: isReel || false,
      isMarketplace: isMarketplace || false,
      price: price || 0
    });

    await newPost.save();
    res.status(201).json({ success: true, message: "Post Published Successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Feed Error" });
  }
};

// Universal Media Download: ओरिजिनल फाइल भेजने का लॉजिक
export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch Error" });
  }
};
