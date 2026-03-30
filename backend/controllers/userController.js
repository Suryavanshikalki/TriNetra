import User from '../models/User.js';

// Point 3 & 12: Profile and Deep Settings (A to H)
export const updateSettings = async (req, res) => {
  try {
    const { trinetraId, bio, profilePic, coverPic, preferences, permissions } = req.body;

    const user = await User.findOne({ trinetraId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Update Profile (Point 3)
    if (bio) user.bio = bio;
    if (profilePic) user.profilePic = profilePic;
    if (coverPic) user.coverPic = coverPic;

    // Update Deep Settings A-H (Point 12: Privacy, Notifications, Language, etc.)
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    if (permissions) user.permissions = { ...user.permissions, ...permissions };

    await user.save();
    res.status(200).json({ success: true, message: "Settings & Profile Locked Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Settings Update Error" });
  }
};

// Point 3: Follow/Unfollow Rule (Mutual Connection)
export const handleFollow = async (req, res) => {
  try {
    const { myId, targetId, action } = req.body; // action: 'follow' or 'unfollow'
    const me = await User.findOne({ trinetraId: myId });
    const them = await User.findOne({ trinetraId: targetId });

    if (action === 'follow') {
      if (!me.following.includes(targetId)) me.following.push(targetId);
      if (!them.followers.includes(myId)) them.followers.push(myId);
    } else {
      me.following = me.following.filter(id => id !== targetId);
      them.followers = them.followers.filter(id => id !== myId);
    }

    await me.save();
    await them.save();
    res.status(200).json({ success: true, message: `Successfully ${action}ed` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Connection Error" });
  }
};
