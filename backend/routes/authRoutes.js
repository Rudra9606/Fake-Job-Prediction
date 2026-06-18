const express = require('express');
const {
  register,
  login,
  googleLogin,
  getMe,
  forgotPassword,
  verifyOTP,
  resetPassword,
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

module.exports = router;
