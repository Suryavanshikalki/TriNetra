// ==========================================
// TRINETRA BACKEND - FILE 14: controllers/userController.js
// Blueprint: Point 3 (Profile, 3D Avatar, Mutual Connections) 
// Blueprint: Point 12 (Settings A to H)
// 🚨 DEEP SEARCH UPDATE: 100% REAL MUTUAL LOGIC & DEEP SETTINGS 🚨
// ==========================================
import User from '../models/User.js';

// ==========================================
// 1. UPDATE PROFILE & DEEP SETTINGS (Point 3 & 12)
// ==========================================
export const updateSettings = async (req, res) => {
  try {
    const { 
        trinetraId, 
        // Point 3: Profile Data
        bio, profilePic, coverPic, avatar3dUrl, 
        // Point 12: Deep Settings (A to H)
        accountsCentre, toolsResources, preferences, 
        audienceVisibility, permissionsSafety, paymentsActivity 
    } = req.body;

    const user = await User.findOne({ trinetraId });
    if (!user) return res.status(404).json({ success: false, message: "TriNetra Firewall: User not found." });

    // --- Update Profile (Point 3) ---
    if (bio !== undefined) user.bio = bio;
    if (profilePic !== undefined) user.profilePic = profilePic;
    if (coverPic !== undefined) user.coverPic = coverPic;
    if (avatar3dUrl !== undefined) user.avatar3dUrl = avatar3dUrl; // 🚨 3D Avatar Sync

    // --- Update Deep Settings A-H (Point 12) ---
    // असली ऐप में नेस्टेड ऑब्जेक्ट्स (Nested Objects) को इस तरह स्प्रेड करके सेव करते हैं
    if (!user.settings) user.settings = {};

    if (accountsCentre) user.settings.accountsCentre = { ...user.settings.accountsCentre, ...accountsCentre };
    if (toolsResources) user.settings.toolsResources = { ...user.settings.toolsResources, ...toolsResources };
    if (preferences) user.settings.preferences = { ...user.settings.preferences, ...preferences };
    if (audienceVisibility) user.settings.audienceVisibility = { ...user.settings.audienceVisibility, ...audienceVisibility };
    if (permissionsSafety) user.settings.permissionsSafety = { ...user.settings.permissionsSafety, ...permissionsSafety };
    if (paymentsActivity) user.settings.paymentsActivity = { ...user.settings.paymentsActivity, ...paymentsActivity };

    // Mongoose को बताना कि नेस्टेड 'settings' ऑब्जेक्ट बदला गया है
    user.markModified('settings');

    await user.save();
    
    console.log(`[TriNetra Privacy Engine] Settings & Profile locked for ${trinetraId}`);
    
    res.status(200).json({ 
        success: true, 
        message: "Settings & Profile Locked Successfully on AWS DB.",
        userSettings: user.settings
    });
  } catch (error) {
    console.error("[TriNetra Settings Update Error]:", error);
    res.status(500).json({ success: false, message: "Settings Update Error. Check DB Connection." });
  }
};

// ==========================================
// 2. THE MUTUAL CONNECTION ENGINE (Point 3 & 5)
// ==========================================
export const handleFollow = async (req, res) => {
  try {
    const { myId, targetId, action } = req.body; // action: 'follow' or 'unfollow'
    
    // Security Check: Self-following logic block
    if (myId === targetId) {
        return res.status(400).json({ success: false, message: "TriNetra Logic Rule: You cannot follow yourself." });
    }

    const me = await User.findOne({ trinetraId: myId });
    const them = await User.findOne({ trinetraId: targetId });

    if (!me || !them) return res.status(404).json({ success: false, message: "User(s) not found." });

    if (action === 'follow') {
      if (!me.following.includes(targetId)) me.following.push(targetId);
      if (!them.followers.includes(myId)) them.followers.push(myId);
      
      // असली ऐप में यहाँ AWS SNS नोटिफिकेशन जाएगा कि "User X started following you"
      console.log(`[TriNetra Connection] ${myId} started following ${targetId}`);
    } else if (action === 'unfollow') {
      me.following = me.following.filter(id => id !== targetId);
      them.followers = them.followers.filter(id => id !== myId);
      
      console.log(`[TriNetra Connection] ${myId} unfollowed ${targetId}`);
    } else {
        return res.status(400).json({ success: false, message: "Invalid Action. Use 'follow' or 'unfollow'." });
    }

    await me.save();
    await them.save();

    // 🚨 THE MASTER RULE (Point 3 & 5): Check Mutual Status 🚨
    // यह चेक करेगा कि क्या दोनों एक-दूसरे को फॉलो कर रहे हैं?
    const isMutual = me.following.includes(targetId) && me.followers.includes(targetId);

    res.status(200).json({ 
        success: true, 
        message: `Successfully ${action}ed`,
        isMutualConnection: isMutual, // <-- फ्रंटएंड इसी वैल्यू से मैसेंजर का चैट बॉक्स खोलेगा या लॉक करेगा
        messengerStatus: isMutual ? "UNLOCKED" : "LOCKED"
    });
  } catch (error) {
    console.error("[TriNetra Connection Engine Error]:", error);
    res.status(500).json({ success: false, message: "Connection Routing Error." });
  }
};
