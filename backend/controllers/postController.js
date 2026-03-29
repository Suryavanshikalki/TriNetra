// ==========================================
// TRINETRA BACKEND - POST & MEDIA CONTROLLER (File 7)
// Blueprint: Point 4 (Original Format Upload to AWS S3)
// ==========================================
import Post from '../models/Post.js';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// 100% Asli AWS S3 Config (Uses keys from .env)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const createPost = async (req, res) => {
  try {
    const { userId, userName, userAvatar, content, mediaType } = req.body;
    let mediaUrl = "";

    // Point 4: Upload Original File to TriNetra AWS S3 Bucket
    if (req.file) {
      const fileExtension = req.file.originalname.split('.').pop();
      // No compression used here to ensure 'Original Format' policy
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `trinetra_media/${uuidv4()}.${fileExtension}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        // ACL: 'public-read' // Enable if public read is required
      };

      const s3Upload = await s3.upload(params).promise();
      mediaUrl = s3Upload.Location; // Asli Cloud URL
    }

    const newPost = new Post({
      userId,
      userName,
      userAvatar,
      content,
      mediaUrl,
      mediaType: mediaType || 'none'
    });

    await newPost.save();
    console.log(`[AWS S3] Media successfully locked in cloud for post: ${newPost._id}`);

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error(`[POST CRASH] AWS S3 or DB Error: ${error.message}`);
    res.status(500).json({ success: false, message: "Media Upload Failed. Check AWS Keys." });
  }
};

export const getFeed = async (req, res) => {
  try {
    // Fetch latest posts for the Home Feed
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Feed Engine Error" });
  }
};
