const ScamReport = require('../models/ScamReport');
const SystemAnalytics = require('../models/SystemAnalytics');
const AuditLog = require('../models/AuditLog');

// @desc    Report a job scam
// @route   POST /api/scams
// @access  Private
exports.createScamReport = async (req, res) => {
  try {
    const { jobTitle, companyName, jobDetails, scamDetails, evidenceUrl } = req.body;

    if (!jobTitle || !companyName || !jobDetails || !scamDetails) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title, company name, job details, and scam details',
      });
    }

    const report = await ScamReport.create({
      jobTitle,
      companyName,
      jobDetails,
      scamDetails,
      evidenceUrl: evidenceUrl || '',
      reporter: req.user.id,
    });

    // Update Daily Analytics in DB
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await SystemAnalytics.findOneAndUpdate(
      { date: today },
      { $inc: { scamReportsCount: 1 } },
      { upsert: true, new: true }
    );

    // Log action
    await AuditLog.create({
      action: 'SCAM_REPORTED',
      actor: req.user.id,
      ip: req.ip || '',
      details: `Scam reported: '${jobTitle}' at '${companyName}'`,
    });

    res.status(201).json({
      success: true,
      message: 'Scam report submitted successfully! Thank you for protecting the community.',
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all scam reports
// @route   GET /api/scams
// @access  Public
exports.getScamReports = async (req, res) => {
  try {
    const reports = await ScamReport.find()
      .populate('reporter', 'name email')
      .sort('-createdAt');
    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Moderate scam report (Admin Only)
// @route   PUT /api/scams/:id/status
// @access  Private/Admin
exports.updateScamReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const report = await ScamReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Scam report not found' });
    }

    report.status = status;
    await report.save();

    // Log action
    await AuditLog.create({
      action: 'SCAM_REPORT_MODERATED',
      actor: req.user.id,
      ip: req.ip || '',
      details: `Scam report ID ${report._id} status updated to ${status}`,
    });

    res.status(200).json({
      success: true,
      message: `Scam report marked as ${status}!`,
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
