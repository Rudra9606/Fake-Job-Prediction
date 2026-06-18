const mongoose = require('mongoose');

const ScamReportSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
  },
  jobDetails: {
    type: String,
    required: [true, 'Please add job details (description/email)'],
  },
  scamDetails: {
    type: String,
    required: [true, 'Please explain why this is a scam'],
  },
  evidenceUrl: {
    type: String,
    default: '',
  },
  reporter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Reporter user is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ScamReport', ScamReportSchema);
