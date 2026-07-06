const express = require('express');
const router = express.Router();
const { getAchievements, unlockAchievement, dailyComplete } = require('../controllers/achievementsController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/achievements  (protected)
router.get('/', protect, getAchievements);

// POST /api/achievements/unlock  (protected)
router.post('/unlock', protect, unlockAchievement);

// POST /api/achievements/daily-complete  (protected)
router.post('/daily-complete', protect, dailyComplete);

module.exports = router;
