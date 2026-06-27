const express = require('express');
const {
  register,
  login,
  googleLogin,
  getMe,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getNotifications,
  markNotificationRead,
  getAllUsers,
  sendUserMessage,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.put('/resetpassword', resetPassword);

// User notification routes
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);

// User directory route
router.get('/users', protect, getAllUsers);

// Chat messaging route
router.post('/messages', protect, sendUserMessage);

module.exports = router;
