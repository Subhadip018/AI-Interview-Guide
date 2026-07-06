const Achievement = require('../models/Achievement');

// @desc    Get all achievements for the logged-in user
// @route   GET /api/achievements
// @access  Private
const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.id })
      .sort({ unlockedAt: -1 });

    res.status(200).json({ success: true, count: achievements.length, achievements });
  } catch (error) {
    console.error('GetAchievements error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching achievements' });
  }
};

// @desc    Unlock a new achievement (badge) for the logged-in user
// @route   POST /api/achievements/unlock
// @access  Private
const unlockAchievement = async (req, res) => {
  try {
    const { badgeId, badgeName } = req.body;

    if (!badgeId || !badgeName) {
      return res.status(400).json({ success: false, message: 'badgeId and badgeName are required' });
    }

    // Check for duplicate — one badge per user
    const existing = await Achievement.findOne({ userId: req.user.id, badgeId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Achievement already unlocked',
        achievement: existing
      });
    }

    const achievement = await Achievement.create({
      userId: req.user.id,
      badgeId,
      badgeName
    });

    res.status(201).json({ success: true, achievement });
  } catch (error) {
    console.error('UnlockAchievement error:', error.message);
    res.status(500).json({ success: false, message: 'Server error unlocking achievement' });
  }
};

// @desc    Daily challenge completion — update maxStreak and unlock streak badges
// @route   POST /api/achievements/daily-complete
// @access  Private
const dailyComplete = async (req, res) => {
  try {
    const { streak, score } = req.body;
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (streak > (user.maxStreak || 0)) {
      user.maxStreak = streak;
    }

    if (score >= 60) {
      const now = new Date();
      const lastActive = user.lastActive ? new Date(user.lastActive) : null;
      if (lastActive) {
        const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) user.streak = (user.streak || 0) + 1;
        else if (diffDays > 1) user.streak = 1;
      } else {
        user.streak = 1;
      }
      if (user.streak > (user.maxStreak || 0)) user.maxStreak = user.streak;
      user.lastActive = now;
    }

    await user.save();

    const badgeChecks = [
      { id: 'streak_3', name: '3-Day Streak', condition: (user.streak || 0) >= 3 },
      { id: 'streak_7', name: '7-Day Streak', condition: (user.streak || 0) >= 7 },
      { id: 'streak_30', name: '30-Day Streak', condition: (user.streak || 0) >= 30 },
    ];

    const newBadges = [];
    for (const badge of badgeChecks) {
      if (badge.condition) {
        const existing = await Achievement.findOne({ userId: req.user.id, badgeId: badge.id });
        if (!existing) {
          const created = await Achievement.create({ userId: req.user.id, badgeId: badge.id, badgeName: badge.name });
          newBadges.push(created);
        }
      }
    }

    res.status(200).json({ success: true, streak: user.streak, maxStreak: user.maxStreak, newBadges });
  } catch (error) {
    console.error('DailyComplete error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAchievements, unlockAchievement, dailyComplete };
