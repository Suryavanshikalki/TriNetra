// ==========================================
// TRINETRA BACKEND - FILE 21: controllers/userActivityController.js
// Blueprint: Point 3 (Profile & Connections) & Point 4 (Feed, Marketplace, Reels)
// 🚨 DEEP SEARCH UPDATE: 100% REAL LOGIC, ORIGINAL MEDIA & MUTUAL RULES 🚨
// ==========================================
import Post from '../models/Post.js';
import User from '../models/User.js';
import { generatePostId } from '../utils/generateId.js';
import { sendSuccess, sendError, findUserOrFail } from '../utils/apiResponse.js';

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

    const user = await findUserOrFail(User, userId, res);
    if (!user) return;

    // असली पोस्ट/रील जनरेशन
    const newPost = new Post({ 
        postId: generatePostId(),
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

    sendSuccess(res, { post: newPost }, 'Content Published to TriNetra AWS Servers successfully.', 201);

  } catch (error) {
    console.error('[TriNetra Post Error]:', error);
    sendError(res, 'TriNetra Post Engine Crash.');
  }
};

// ==========================================
// 2. PROFILE & 3D AVATAR UPDATE (Point 3)
// ==========================================
export const updateProfile = async (req, res) => {
  try {
    const { userId, bio, avatar3dUrl, profilePic, coverPic } = req.body;
    
    const user = await findUserOrFail(User, userId, res);
    if (!user) return;

    if (bio !== undefined) user.bio = bio;
    if (profilePic !== undefined) user.profilePic = profilePic; // Normal Photo
    if (avatar3dUrl !== undefined) user.avatar3dUrl = avatar3dUrl; // 🚨 3D Avatar Support
    if (coverPic !== undefined) user.coverPic = coverPic;

    await user.save();
    
    sendSuccess(res, {
        user: { bio: user.bio, profilePic: user.profilePic, avatar3dUrl: user.avatar3dUrl, coverPic: user.coverPic }
    }, 'TriNetra Profile & 3D Avatar Synced Successfully.');

  } catch (error) {
    console.error('[TriNetra Profile Error]:', error);
    sendError(res, 'Profile Sync Error on AWS.');
  }
};

// ==========================================
// 3. THE CONNECTION RULE (Follow/Unfollow - Point 3)
// ==========================================
export const toggleFollowUser = async (req, res) => {
  try {
    const { followerId, targetUserId } = req.body;

    if (followerId === targetUserId) {
        return sendError(res, 'You cannot follow yourself.', 400);
    }

    const follower = await User.findOne({ trinetraId: followerId });
    const targetUser = await User.findOne({ trinetraId: targetUserId });

    if (!follower || !targetUser) return sendError(res, 'User not found.', 404);

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

    sendSuccess(res, {
        isMutualConnection: isNowMutual,
        action: isFollowing ? 'unfollow' : 'follow'
    }, isFollowing ? 'Unfollowed successfully.' : 'Followed successfully.');

  } catch (error) {
    console.error('[TriNetra Connection Error]:', error);
    sendError(res, 'Connection Routing Error.');
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
  
      if (!blocker || !targetUser) return sendError(res, 'User not found.', 404);
  
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
  
      sendSuccess(res, {
          action: isBlocked ? 'unblock' : 'block'
      }, isBlocked ? 'User Unblocked.' : 'User Blocked. Mutual Connection Destroyed.');
  
    } catch (error) {
      console.error('[TriNetra Block Error]:', error);
      sendError(res, 'Blocking System Error.');
    }
  };
