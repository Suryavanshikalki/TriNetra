// File: backend/controllers/escalationController.js
const Complaint = require('../models/Complaint');
const User = require('../models/User');

/**
 * 👁️🔥 TRINETRA SUPREME JUSTICE CONTROLLER
 * Point 4: Step-by-Step Chain of Command Logic
 */

const chainOfCommand = [
  'Local_Officer', 'MLA', 'CM', 'PM', 'Civil_Court', 'High_Court', 'Supreme_Court', 'International_Level'
];

// 1. नई शिकायत दर्ज करना (Local Level)
exports.createComplaint = async (req, res) => {
  try {
    const { postId, category, content } = req.body;
    const userId = req.user.id; // From Auth Middleware

    // Check if complaint already exists for this post
    let complaint = await Complaint.findOne({ postId });
    if (complaint) return res.status(400).json({ success: false, message: "Complaint already active for this post." });

    complaint = new Complaint({
      postId,
      reporterId: userId,
      category,
      status: 'Open',
      history: [{
        level: 'Local_Officer',
        actionTaken: "Complaint registered at Local Level. System tracking initiated.",
        remarks: content
      }]
    });

    await complaint.save();
    res.status(201).json({ success: true, message: "Complaint filed at Local Level. 👁️ TriNetra is watching." });
  } catch (error) {
    res.status(500).json({ success: false, error: "System Error in filing complaint." });
  }
};

// 2. एस्केलेशन को प्रोमोट करना (The Real Power Engine)
exports.promoteEscalation = async (req, res) => {
  try {
    const { complaintId } = req.body;
    const userId = req.user.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found." });

    const user = await User.findById(userId);
    
    // Find current level index
    const currentIndex = chainOfCommand.indexOf(complaint.escalationLevel);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= chainOfCommand.length) {
      return res.status(400).json({ success: false, message: "Complaint has reached the International Level (Max)." });
    }

    // 🚨 ₹20,000 JUSTICE RULE (Point 4)
    // PM Level (Index 3) aur uske upar jane ke liye Paid Plan zaroori hai
    if (nextIndex >= 3 && !user.isPaidEscalation) {
      return res.status(403).json({ 
        success: false, 
        message: "UPGRADE REQUIRED: To reach PM, Supreme Court or International levels, please activate the ₹20,000 Justice Plan." 
      });
    }

    // Promoting to Next Level
    const nextLevel = chainOfCommand[nextIndex];
    complaint.escalationLevel = nextLevel;
    complaint.status = 'Escalated';
    
    complaint.history.push({
      level: nextLevel,
      actionTaken: `Case officially transferred to ${nextLevel} Office.`,
      remarks: `Automated escalation due to unresolved status at ${chainOfCommand[currentIndex]} level.`
    });

    await complaint.save();
    res.status(200).json({ 
      success: true, 
      message: `Success! Complaint escalated to ${nextLevel}.`,
      currentLevel: nextLevel
    });

  } catch (error) {
    res.status(500).json({ success: false, error: "Escalation Promotion Error." });
  }
};

// 3. बहस स्कोर अपडेट करना (High Engagement Logic - Point 4)
exports.updateDebateScore = async (req, res) => {
  try {
    const { postId, engagementBoost } = req.body;
    
    const complaint = await Complaint.findOne({ postId });
    if (!complaint) return res.status(404).json({ success: false, message: "No active complaint found for this post." });

    // Increase debate score based on comments/shares
    complaint.debateScore += engagementBoost;

    // Point 4 Rule: System tracks high engagement for auto-alert
    if (complaint.debateScore > 1000 && complaint.status === 'Open') {
      complaint.status = 'Under_Review'; // Urgent Attention
    }

    await complaint.save();
    res.status(200).json({ success: true, score: complaint.debateScore });
  } catch (error) {
    res.status(500).json({ success: false, error: "Score Update Error." });
  }
};

// 4. स्टेटस ट्रैक करना (Point 12 - Dashboard)
exports.getEscalationStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findById(complaintId).populate('history');
    
    if (!complaint) return res.status(404).json({ success: false, message: "No data found." });

    res.status(200).json({
      success: true,
      data: {
        currentLevel: complaint.escalationLevel,
        status: complaint.status,
        debatePower: complaint.debateScore,
        timeline: complaint.history
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Tracking Error." });
  }
};
