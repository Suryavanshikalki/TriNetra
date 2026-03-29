// ==========================================
// TRINETRA BACKEND - ESCALATION JUSTICE ENGINE (File 8)
// Blueprint: Point 4 (Chain of Command: Local to Supreme Court)
// ==========================================
import Post from '../models/Post.js';

// The Absolute Chain of Command Defined in Blueprint
const CHAIN_OF_COMMAND = [
  'None',
  'Local Authority', 
  'MLA', 
  'CM', 
  'PM', 
  'Civil Court', 
  'High Court', 
  'Supreme Court', 
  'International Level'
];

export const triggerEscalation = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found in TriNetra DB" });
    }

    // Logic: If not escalated yet, start at Level 1 (Local Authority)
    if (!post.isEscalated || post.escalationLevel === 'None') {
      post.isEscalated = true;
      post.escalationLevel = 'Local Authority';
      post.escalationHistory.push({ level: 'Local Authority', status: 'Pending' });
      
      await post.save();
      console.log(`[JUSTICE ENGINE] Post ${postId} escalated to LOCAL AUTHORITY by user ${userId}`);
      
      return res.status(200).json({ 
        success: true, 
        message: "Escalation initiated. Notifying Local Authorities.",
        level: post.escalationLevel
      });
    }

    // Auto-Escalation Logic: Move to NEXT level if already escalated
    const currentIndex = CHAIN_OF_COMMAND.indexOf(post.escalationLevel);
    
    // Check if we hit the ceiling
    if (currentIndex >= CHAIN_OF_COMMAND.length - 1) {
      return res.status(200).json({ 
        success: true, 
        message: "Maximum Escalation (International Level) already reached. Awaiting global intervention.",
        level: post.escalationLevel
      });
    }

    // Promote to Next Level (e.g., MLA -> CM -> Supreme Court)
    const nextLevel = CHAIN_OF_COMMAND[currentIndex + 1];
    
    // Mark previous level as 'Escalated'
    if (post.escalationHistory.length > 0) {
      post.escalationHistory[post.escalationHistory.length - 1].status = 'Escalated';
    }

    // Push new level
    post.escalationLevel = nextLevel;
    post.escalationHistory.push({ level: nextLevel, status: 'Pending' });

    await post.save();
    console.log(`[JUSTICE ENGINE] System Auto-Escalated post ${postId} to -> ${nextLevel.toUpperCase()}`);

    res.status(200).json({ 
      success: true, 
      message: `System Auto-Escalated issue to: ${nextLevel}`,
      level: nextLevel
    });

  } catch (error) {
    console.error(`[JUSTICE ENGINE CRASH] ${error.message}`);
    res.status(500).json({ success: false, message: "Justice Engine offline. Try again later." });
  }
};
