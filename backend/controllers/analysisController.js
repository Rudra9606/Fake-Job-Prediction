const JobAnalysis = require('../models/JobAnalysis');
const User = require('../models/User');
const SystemAnalytics = require('../models/SystemAnalytics');
const AuditLog = require('../models/AuditLog');
const BlockedDomain = require('../models/BlockedDomain');
const axios = require('axios');

// Free email domains helper
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
  'aol.com', 'icloud.com', 'protonmail.com', 'mail.com', 'yandex.com'
]);

// Cybersecurity validation logic in Node.js
const extractSecurityFlags = (text, email, website, company) => {
  text = text.lower ? text.lower() : text.toLowerCase();
  email = (email || '').toLowerCase().trim();
  website = (website || '').toLowerCase().trim();
  company = (company || '').toLowerCase().trim();

  // 1. Recruiter Email checks
  let uses_personal_email = false;
  let email_domain_mismatch = false;
  let young_domain = false;

  if (email && email.includes('@')) {
    const domain = email.split('@')[1];
    uses_personal_email = FREE_EMAIL_DOMAINS.has(domain);

    if (company && !uses_personal_email) {
      // Check if company tokens are in email domain
      const companyTokens = company.split(/[^a-z0-9]/).filter(t => t.length > 2);
      if (companyTokens.length > 0) {
        email_domain_mismatch = !companyTokens.some(token => domain.includes(token));
      }
    }
  }

  // 2. Sensitive requests
  const requests_sensitive_data = /otp|one[- ]time[- ]password|aadhaar|aadhar|uidai|pan card|\bpan\b|passport|bank account|routing number|debit card|credit card|cvv|card number|registration fee|processing fee|interview fee|application fee|wire transfer/i.test(text);

  // 3. High Urgency
  const high_urgency = /urgent|immediately|act now|limited slots|guaranteed|instant hire|quick money|easy money/i.test(text);

  const suspicious_url = /bit\.ly|tinyurl|goo\.gl|\.tk/i.test(text) || !!(website && /bit\.ly|tinyurl|goo\.gl/i.test(website));

  // 5. Weak Profile
  const weak_company_profile = company.length < 3 || text.length < 100;

  return {
    uses_personal_email,
    email_domain_mismatch,
    young_domain,
    suspicious_url,
    requests_sensitive_data,
    high_urgency,
    weak_company_profile
  };
};

// @desc    Submit job for fraud analysis
// @route   POST /api/analyze
// @access  Public (Optional Auth)
exports.analyzeJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      benefits,
      recruiterEmail,
      companyWebsite,
      applicationUrl,
    } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title, company name, and job description',
      });
    }

    // Check if recruiter email domain or company website domain is in the blacklist
    let isBlacklisted = false;
    let blacklistReason = '';
    
    try {
      const blockedDomains = await BlockedDomain.find();
      const blockedSet = new Set(blockedDomains.map(d => d.domain.toLowerCase().trim()));
      
      if (recruiterEmail && recruiterEmail.includes('@')) {
        const emailDomain = recruiterEmail.split('@')[1].toLowerCase().trim();
        if (blockedSet.has(emailDomain)) {
          isBlacklisted = true;
          const matched = blockedDomains.find(d => d.domain.toLowerCase().trim() === emailDomain);
          blacklistReason = matched ? matched.reason : 'Domain is blacklisted';
        }
      }
      
      if (!isBlacklisted && companyWebsite) {
        const cleanWebsite = companyWebsite.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].trim();
        if (blockedSet.has(cleanWebsite)) {
          isBlacklisted = true;
          const matched = blockedDomains.find(d => d.domain.toLowerCase().trim() === cleanWebsite);
          blacklistReason = matched ? matched.reason : 'Domain is blacklisted';
        }
      }
    } catch (err) {
      console.error('Error checking blacklisted domains:', err);
    }

    // Call Python FastAPI AI Service
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    let fraudProbability = 0.05;
    let trustScore = 95.0;
    let riskLevel = 'Trusted';
    let explanation = ['AI Service unavailable: fell back to heuristics.'];

    if (isBlacklisted) {
      fraudProbability = 1.0;
      trustScore = 0;
      riskLevel = 'Highly Fraudulent';
      explanation = [`Security Alert: Recruiter domain is blacklisted by administrator. Reason: ${blacklistReason}`];
    } else {
      try {
        const aiResponse = await axios.post(`${aiServiceUrl}/predict`, {
          title,
          description,
          requirements: requirements || '',
          benefits: benefits || '',
        });

        if (aiResponse.data) {
          fraudProbability = aiResponse.data.fraud_probability;
          trustScore = aiResponse.data.trust_score;
          riskLevel = aiResponse.data.risk_level;
          explanation = aiResponse.data.explanation || [];
        }
      } catch (aiErr) {
        console.log(`FastAPI request failed: ${aiErr.message}. Running fallback local analysis.`);
        // Fallback local heuristic scoring if FastAPI is down
        const secFlags = extractSecurityFlags(description + " " + requirements, recruiterEmail, companyWebsite, company);
        let penalty = 0;
        if (secFlags.requests_sensitive_data) penalty += 0.35;
        if (secFlags.uses_personal_email) penalty += 0.20;
        if (secFlags.high_urgency) penalty += 0.15;
        if (secFlags.suspicious_url) penalty += 0.15;
        fraudProbability = Math.min(0.99, penalty + (description.length < 200 ? 0.20 : 0.05));
        trustScore = Math.round((1 - fraudProbability) * 100);
        
        if (trustScore >= 81) riskLevel = 'Trusted';
        else if (trustScore >= 61) riskLevel = 'Low Risk';
        else if (trustScore >= 41) riskLevel = 'Medium Risk';
        else if (trustScore >= 21) riskLevel = 'High Risk';
        else riskLevel = 'Highly Fraudulent';

        explanation = [
          'Warning: Python AI FastAPI server is offline. Local heuristics computed the risk.',
          secFlags.requests_sensitive_data ? 'Suspicious requests for sensitive data (bank/ID) found.' : null,
          secFlags.uses_personal_email ? 'Recruiter email domain is a free public provider.' : null,
          secFlags.high_urgency ? 'Pressure-inducing urgency language detected.' : null,
        ].filter(Boolean);
      }
    }

    // Compute cybersecurity flags in Node.js
    const securityFlags = extractSecurityFlags(
      `${description} ${requirements} ${benefits}`,
      recruiterEmail,
      companyWebsite,
      company
    );

    // Prepare data
    const analysisData = {
      title,
      company,
      description,
      requirements: requirements || '',
      benefits: benefits || '',
      recruiterEmail: recruiterEmail || '',
      companyWebsite: companyWebsite || '',
      applicationUrl: applicationUrl || '',
      fraudProbability,
      trustScore,
      riskLevel,
      explanation,
      securityFlags,
    };

    // If logged in, associate with user
    if (req.user) {
      analysisData.user = req.user.id;
      // Increment user scan count
      await User.findByIdAndUpdate(req.user.id, { $inc: { scanCount: 1 } });
    }

    // Save report in DB
    const analysis = await JobAnalysis.create(analysisData);

    // Update Daily Analytics in MERN DB
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isFraud = fraudProbability >= 0.5 ? 1 : 0;
    const isGenuine = isFraud ? 0 : 1;

    await SystemAnalytics.findOneAndUpdate(
      { date: today },
      { 
        $inc: { 
          scansCount: 1,
          fraudulentCount: isFraud,
          genuineCount: isGenuine
        } 
      },
      { upsert: true, new: true }
    );

    // Log scan
    await AuditLog.create({
      action: 'JOB_SCANNED',
      actor: req.user ? req.user.id : null,
      ip: req.ip || '',
      details: `Job scanned: '${title}' at '${company}' - Risk: ${riskLevel} (${trustScore})`,
    });

    res.status(201).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user scan history
// @route   GET /api/analyze/history
// @access  Private
exports.getJobAnalyses = async (req, res) => {
  try {
    const history = await JobAnalysis.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get job analysis detail by ID
// @route   GET /api/analyze/:id
// @access  Public
exports.getJobAnalysisById = async (req, res) => {
  try {
    const analysis = await JobAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job analysis
// @route   DELETE /api/analyze/:id
// @access  Private
exports.deleteJobAnalysis = async (req, res) => {
  try {
    const analysis = await JobAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    // Verify ownership
    if (analysis.user && analysis.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this record' });
    }

    await JobAnalysis.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Scan record deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
