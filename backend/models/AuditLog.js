const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  actor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false,
  },
  ip: {
    type: String,
    default: '',
  },
  details: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
