const express = require('express');
const router = express.Router();
const { register, login, getMe, getLeaderboard, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe);

// GET /api/auth/leaderboard  (public)
router.get('/leaderboard', getLeaderboard);

// GET /api/auth/users  (public)
router.get('/users', getAllUsers);

module.exports = router;
