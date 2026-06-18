const mongoose = require('mongoose');

const SystemAnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  scansCount: {
    type: Number,
    default: 0,
  },
  fraudulentCount: {
    type: Number,
    default: 0,
  },
  genuineCount: {
    type: Number,
    default: 0,
  },
  registrationsCount: {
    type: Number,
    default: 0,
  },
  scamReportsCount: {
    type: Number,
    default: 0,
  },
  averageTrustScore: {
    type: Number,
    default: 100,
  },
});

module.exports = mongoose.model('SystemAnalytics', SystemAnalyticsSchema);
