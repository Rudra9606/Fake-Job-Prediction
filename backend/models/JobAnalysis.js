const mongoose = require('mongoose');

const JobAnalysisSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
  },
  requirements: {
    type: String,
    default: '',
  },
  benefits: {
    type: String,
    default: '',
  },
  recruiterEmail: {
    type: String,
    default: '',
  },
  companyWebsite: {
    type: String,
    default: '',
  },
  applicationUrl: {
    type: String,
    default: '',
  },
  fraudProbability: {
    type: Number,
    required: true,
  },
  trustScore: {
    type: Number,
    required: true,
  },
  riskLevel: {
    type: String,
    required: true,
  },
  explanation: [String],
  securityFlags: {
    uses_personal_email: { type: Boolean, default: false },
    email_domain_mismatch: { type: Boolean, default: false },
    young_domain: { type: Boolean, default: false },
    suspicious_url: { type: Boolean, default: false },
    requests_sensitive_data: { type: Boolean, default: false },
    high_urgency: { type: Boolean, default: false },
    weak_company_profile: { type: Boolean, default: false },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobAnalysis', JobAnalysisSchema);
