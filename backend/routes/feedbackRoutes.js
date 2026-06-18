const express = require('express');
const {
  createFeedback,
  getFeedbacks,
  updateFeedbackStatus,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', createFeedback);
router.get('/', protect, authorize('admin'), getFeedbacks);
router.put('/:id', protect, authorize('admin'), updateFeedbackStatus);

module.exports = router;
