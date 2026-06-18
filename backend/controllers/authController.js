const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AuditLog = require('../models/AuditLog');
const SystemAnalytics = require('../models/SystemAnalytics');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_fake_job_shield_jwt_key_12345', {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Determine role (first user could be admin, otherwise standard 'user')
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      isVerified: true, // Auto-verify for ease of MERN demo testing
    });

    // Track registrations in analytics
    const today = new Date();
    today.setHours(0,0,0,0);
    await SystemAnalytics.findOneAndUpdate(
      { date: today },
      { $inc: { registrationsCount: 1 } },
      { upsert: true, new: true }
    );

    // Log action
    await AuditLog.create({
      action: 'USER_REGISTERED',
      actor: user._id,
      ip: req.ip || '',
      details: `User registered with email: ${email}`,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Log action
    await AuditLog.create({
      action: 'USER_LOGGED_IN',
      actor: user._id,
      ip: req.ip || '',
      details: `User logged in`,
    });

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mock Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Simulation: in production we would send reset email
    res.status(200).json({
      success: true,
      message: 'Password reset link sent (simulated). Check console log for details.',
      resetToken: 'dummy_reset_token_67890',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mock Reset Password
// @route   PUT /api/auth/resetpassword/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    // For MERN demo, we find a user by a mock search or use the first user
    const user = await User.findOne();
    if (!user) {
      return res.status(400).json({ success: false, message: 'No users in database' });
    }
    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
