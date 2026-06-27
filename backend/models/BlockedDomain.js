const mongoose = require('mongoose');

const BlockedDomainSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: [true, 'Please add a domain name'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  reason: {
    type: String,
    default: 'Suspicious or malicious activity',
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BlockedDomain', BlockedDomainSchema);
