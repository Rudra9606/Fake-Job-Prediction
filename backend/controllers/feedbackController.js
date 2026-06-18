const Feedback = require('../models/Feedback');
const AuditLog = require('../models/AuditLog');

// @desc    Submit feedback or contact message
// @route   POST /api/feedback
// @access  Public
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, subject, message, rating } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message',
      });
    }

    const feedback = await Feedback.create({
      name,
      email,
      subject,
      message,
      rating: rating || 5,
    });

    // Log action
    await AuditLog.create({
      action: 'FEEDBACK_SUBMITTED',
      actor: null,
      ip: req.ip || '',
      details: `Feedback submitted by: ${name} (${email})`,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! Thank you for helping us improve FakeJobShield.',
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all feedback (Admin Only)
// @route   GET /api/feedback
// @access  Private/Admin
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Moderate feedback status (Admin Only)
// @route   PUT /api/feedback/:id
// @access  Private/Admin
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback record not found' });
    }

    feedback.status = status;
    await feedback.save();

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
