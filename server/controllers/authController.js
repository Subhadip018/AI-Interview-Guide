const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InterviewResult = require('../models/InterviewResult');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper to sanitize user object
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  streak: user.streak,
  maxStreak: user.maxStreak,
  totalInterviews: user.totalInterviews,
  bestScore: user.bestScore,
  lastActive: user.lastActive,
  createdAt: user.createdAt
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching user data' });
  }
};

// @desc    Get leaderboard (top performers by best score)
// @route   GET /api/auth/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ totalInterviews: { $gt: 0 } })
      .select('name avatar streak totalInterviews bestScore lastActive')
      .sort({ bestScore: -1, totalInterviews: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: users.length,
      leaderboard: users.map((u, i) => ({
        rank: i + 1,
        name: u.name,
        avatar: u.avatar,
        score: u.bestScore || 0,
        interviews: u.totalInterviews || 0,
        streak: u.streak || 0,
        date: u.lastActive
      }))
    });
  } catch (error) {
    console.error('GetLeaderboard error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching leaderboard' });
  }
};

// @desc    Get all users with their stats
// @route   GET /api/auth/users
// @access  Public
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name avatar streak maxStreak totalInterviews bestScore lastActive createdAt')
      .sort({ bestScore: -1, totalInterviews: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        avatar: u.avatar,
        streak: u.streak || 0,
        maxStreak: u.maxStreak || 0,
        totalInterviews: u.totalInterviews || 0,
        bestScore: u.bestScore || 0,
        lastActive: u.lastActive
      }))
    });
  } catch (error) {
    console.error('GetAllUsers error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

module.exports = { register, login, getMe, getLeaderboard, getAllUsers };
