// ==========================================
// TRINETRA BACKEND - FILE 21: controllers/userActivityController.js
// Blueprint: Point 3 (Profile & Connections) & Point 4 (Feed, Marketplace, Reels)
// 🚨 DEEP SEARCH UPDATE: 100% REAL LOGIC, ORIGINAL MEDIA & MUTUAL RULES 🚨
// ==========================================
import Post from '../models/Post.js';
import User from '../models/User.js';
import crypto from 'crypto';

// ==========================================
// 1. CREATE POST / REEL / MARKETPLACE ITEM (Point 4)
// ==========================================
export const createPost = async (req, res) => {
  try {
    const { 
        userId, content, mediaUrl, mediaType, 
        isReel, 
        // Original Media Download Data
        originalFileName, mediaSize, 
        // Marketplace Data
        isMarketplace, price, currency, productCondition 
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "TriNetra: User not found." });

    // असली पोस्ट/रील जनरेशन
    const newPost = new Post({ 
        postId: `POST-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
        userId, 
        content: content || "", 
        
        // Universal Download Support Data
        mediaUrl: mediaUrl || null, 
        mediaType: mediaType || "text", 
        originalFileName: originalFileName || "TriNetra_Media",
        mediaSize: mediaSize || 0,
        
        isReel: isReel || false,
        
        // Marketplace Support
        isMarketplace: isMarketplace || false,
        price: isMarketplace ? price : 0,
        currency: isMarketplace ? (currency || 'INR') : null,
        productCondition: isMarketplace ? productCondition : null,

        // 🚨 Point 4: Justice Engine (Auto-Escalation) Defaults 🚨
        isEscalated: false,
        escalationLevel: 'None',
        escalationHistory: []
    });

    await newPost.save();

    console.log(`[TriNetra Feed] New ${isMarketplace ? 'Marketplace Item' : (isReel ? 'Reel' : 'Post')} created by ${userId}`);

    res.status(201).json({ 
        success: true, 
        message: "Content Published to TriNetra AWS Servers successfully.",
        post: newPost 
    });

  } catch (error) {
    console.error("[TriNetra Post Error]:", error);
    res.status(500).json({ success: false, message: "TriNetra Post Engine Crash." });
  }
};

// ==========================================
// 2. PROFILE & 3D AVATAR UPDATE (Point 3)
// ==========================================
export const updateProfile = async (req, res) => {
  try {
    const { userId, bio, avatar3dUrl, profilePic, coverPic } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (bio !== undefined) user.bio = bio;
    if (profilePic !== undefined) user.profilePic = profilePic; // Normal Photo
    if (avatar3dUrl !== undefined) user.avatar3dUrl = avatar3dUrl; // 🚨 3D Avatar Support
    if (coverPic !== undefined) user.coverPic = coverPic;

    await user.save();
    
    res.status(200).json({ 
        success: true, 
        message: "TriNetra Profile & 3D Avatar Synced Successfully.",
        user: {
            bio: user.bio,
            profilePic: user.profilePic,
            avatar3dUrl: user.avatar3dUrl,
            coverPic: user.coverPic
        }
    });

  } catch (error) {
    console.error("[TriNetra Profile Error]:", error);
    res.status(500).json({ success: false, message: "Profile Sync Error on AWS." });
  }
};

// ==========================================
// 3. THE CONNECTION RULE (Follow/Unfollow - Point 3)
// ==========================================
export const toggleFollowUser = async (req, res) => {
  try {
    const { followerId, targetUserId } = req.body;

    if (followerId === targetUserId) {
        return res.status(400).json({ success: false, message: "You cannot follow yourself." });
    }

    const follower = await User.findOne({ trinetraId: followerId });
    const targetUser = await User.findOne({ trinetraId: targetUserId });

    if (!follower || !targetUser) return res.status(404).json({ success: false, message: "User not found." });

    const isFollowing = follower.following.includes(targetUserId);

    if (isFollowing) {
        // Unfollow Logic
        follower.following = follower.following.filter(id => id !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id !== followerId);
    } else {
        // Follow Logic
        follower.following.push(targetUserId);
        targetUser.followers.push(followerId);
        
        // असली ऐप में यहाँ AWS SNS के ज़रिए नोटिफिकेशन जाएगा
        console.log(`[TriNetra Notice] ${follower.name} started following ${targetUser.name}`);
    }

    await follower.save();
    await targetUser.save();

    // 🚨 Point 3 & 5 Check: Mutual Connection Rule 🚨
    const isNowMutual = follower.following.includes(targetUserId) && targetUser.following.includes(followerId);

    res.status(200).json({ 
        success: true, 
        message: isFollowing ? "Unfollowed successfully." : "Followed successfully.",
        isMutualConnection: isNowMutual, // Frontend can use this to unlock Messenger
        action: isFollowing ? 'unfollow' : 'follow'
    });

  } catch (error) {
    console.error("[TriNetra Connection Error]:", error);
    res.status(500).json({ success: false, message: "Connection Routing Error." });
  }
};

// ==========================================
// 4. BLOCK / UNBLOCK LOGIC (Point 3)
// ==========================================
export const toggleBlockUser = async (req, res) => {
    try {
      const { blockerId, targetUserId } = req.body;
  
      const blocker = await User.findOne({ trinetraId: blockerId });
      const targetUser = await User.findOne({ trinetraId: targetUserId });
  
      if (!blocker || !targetUser) return res.status(404).json({ success: false, message: "User not found." });
  
      const isBlocked = blocker.blockedUsers.includes(targetUserId);
  
      if (isBlocked) {
          // Unblock
          blocker.blockedUsers = blocker.blockedUsers.filter(id => id !== targetUserId);
      } else {
          // Block Logic (Also forces unfollow both ways)
          blocker.blockedUsers.push(targetUserId);
          
          blocker.following = blocker.following.filter(id => id !== targetUserId);
          blocker.followers = blocker.followers.filter(id => id !== targetUserId);
          
          targetUser.following = targetUser.following.filter(id => id !== blockerId);
          targetUser.followers = targetUser.followers.filter(id => id !== blockerId);
          
          await targetUser.save();
      }
  
      await blocker.save();
  
      res.status(200).json({ 
          success: true, 
          message: isBlocked ? "User Unblocked." : "User Blocked. Mutual Connection Destroyed.",
          action: isBlocked ? 'unblock' : 'block'
      });
  
    } catch (error) {
      console.error("[TriNetra Block Error]:", error);
      res.status(500).json({ success: false, message: "Blocking System Error." });
    }
  };
