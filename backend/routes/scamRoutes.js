const express = require('express');
const {
  createScamReport,
  getScamReports,
  updateScamReportStatus,
} = require('../controllers/scamController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createScamReport);
router.get('/', getScamReports);
router.put('/:id/status', protect, authorize('admin'), updateScamReportStatus);

module.exports = router;
