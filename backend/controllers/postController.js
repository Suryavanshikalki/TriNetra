import Post from '../models/Post.js';
import User from '../models/User.js';

// Point 4: Feed, Reels, Marketplace & Original Media Download
export const createPost = async (req, res) => {
  try {
    const { userId, content, mediaUrl, mediaType, isReel } = req.body;
    const newPost = new Post({ userId, content, mediaUrl, mediaType, isReel });
    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Post Logic Error" });
  }
};

// Point 3: Profile & 3D Avatar Update
export const updateProfile = async (req, res) => {
  try {
    const { userId, bio, avatarUrl, coverPic } = req.body;
    const user = await User.findById(userId);
    if (bio) user.bio = bio;
    if (avatarUrl) user.profilePic = avatarUrl; // 3D Avatar
    if (coverPic) user.coverPic = coverPic;
    await user.save();
    res.status(200).json({ success: true, message: "Profile Updated Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Profile Sync Error" });
  }
};
