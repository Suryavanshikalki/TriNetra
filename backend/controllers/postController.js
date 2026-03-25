// File: backend/controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    const { userId, content, mediaUrl, mediaType, category, boostType } = req.body;
    const newPost = new Post({ userId, content, mediaUrl, mediaType, category, boostType });
    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: "Post Creation Error" });
  }
};

exports.getFeed = async (req, res) => {
  try {
    // Advanced algorithm will prioritize Auto-Boosted and mutual follower posts here
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, error: "Feed Fetch Error" });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    post.likes += 1;
    await post.save();
    res.status(200).json({ success: true, likes: post.likes });
  } catch (error) {
    res.status(500).json({ success: false, error: "Like Error" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId, userId, text, mediaUrl } = req.body;
    const post = await Post.findById(postId);
    post.comments.push({ userId, text, mediaUrl });
    await post.save();
    res.status(200).json({ success: true, comments: post.comments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Comment Error" });
  }
};
