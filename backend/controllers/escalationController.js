// File: backend/controllers/escalationController.js
const Complaint = require('../models/Complaint');

exports.escalateIssue = async (req, res) => {
  try {
    const { postId, category } = req.body;
    const chainOfCommand = [
      'Local Authority', 'MLA', 'CM', 'PM', 'Civil Court', 'High Court', 'Supreme Court', 'International Level'
    ];

    let complaint = await Complaint.findOne({ postId });
    
    if (!complaint) {
      complaint = new Complaint({ postId, category, escalationLevel: 0 });
    } else {
      if (complaint.status !== 'Resolved' && complaint.escalationLevel < chainOfCommand.length - 1) {
        complaint.escalationLevel += 1;
        complaint.history.push({
          level: complaint.escalationLevel,
          actionTaken: `Auto-escalated to ${chainOfCommand[complaint.escalationLevel]} for category: ${category}`
        });
      } else {
        return res.status(400).json({ success: false, message: "Issue already at max level or resolved." });
      }
    }

    await complaint.save();
    res.status(200).json({ 
      success: true, 
      message: `Complaint escalated successfully to ${chainOfCommand[complaint.escalationLevel]}.` 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Escalation System Error" });
  }
};
