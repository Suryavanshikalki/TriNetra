import Post from '../models/Post.js';

// Point 4: Chain of Command (The Justice Engine)
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

    // अगर अभी तक एस्केलेट नहीं हुआ है, तो लोकल अधिकारी को भेजें
    if (!post.isEscalated || post.escalationLevel === 'None') {
      post.isEscalated = true;
      post.escalationLevel = 'Local Authority';
      post.escalationHistory.push({ level: 'Local Authority', status: 'Pending', timestamp: new Date() });
      
      await post.save();
      console.log(`[JUSTICE ENGINE] Issue ${postId} reported to LOCAL AUTHORITY by ${userId}`);
      
      return res.status(200).json({ 
        success: true, 
        message: "Escalation initiated. Local Authorities Notified.",
        level: post.escalationLevel
      });
    }

    // Auto-Escalation Logic: अगर समाधान नहीं हुआ, तो अगले लेवल (जैसे MLA -> CM) पर बढ़ाएं
    const currentIndex = CHAIN_OF_COMMAND.indexOf(post.escalationLevel);
    
    // अगर इंटरनेशनल लेवल पर पहुँच गया है
    if (currentIndex >= CHAIN_OF_COMMAND.length - 1) {
      return res.status(200).json({ 
        success: true, 
        message: "Maximum Escalation (International Level) reached. Awaiting global intervention.",
        level: post.escalationLevel
      });
    }

    // अगले अधिकारी को प्रमोट करें
    const nextLevel = CHAIN_OF_COMMAND[currentIndex + 1];
    
    // पुराने लेवल को 'Escalated' मार्क करें
    if (post.escalationHistory.length > 0) {
      post.escalationHistory[post.escalationHistory.length - 1].status = 'Escalated';
    }

    // नया लेवल ऐड करें
    post.escalationLevel = nextLevel;
    post.escalationHistory.push({ level: nextLevel, status: 'Pending', timestamp: new Date() });

    await post.save();
    console.log(`[JUSTICE ENGINE] Auto-Escalated issue to -> ${nextLevel.toUpperCase()}`);

    res.status(200).json({ 
      success: true, 
      message: `System Auto-Escalated issue to: ${nextLevel}`,
      level: nextLevel
    });

  } catch (error) {
    console.error(`[JUSTICE ENGINE CRASH] ${error.message}`);
    res.status(500).json({ success: false, message: "Justice Engine offline." });
  }
};
