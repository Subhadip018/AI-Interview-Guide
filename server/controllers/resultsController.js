const InterviewResult = require('../models/InterviewResult');
const User = require('../models/User');
const Achievement = require('../models/Achievement');

// @desc    Get all results for the logged-in user
// @route   GET /api/results
// @access  Private
const getResults = async (req, res) => {
  try {
    const results = await InterviewResult.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: results.length, results });
  } catch (error) {
    console.error('GetResults error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching results' });
  }
};

// @desc    Get a single result by ID
// @route   GET /api/results/:id
// @access  Private
const getResult = async (req, res) => {
  try {
    const result = await InterviewResult.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    // Ensure the result belongs to the requesting user
    if (result.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this result' });
    }

    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('GetResult error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching result' });
  }
};

// @desc    Save a new interview result and update user stats
// @route   POST /api/results
// @access  Private
const saveResult = async (req, res) => {
  try {
    const {
      company,
      role,
      difficulty,
      interviewType,
      totalQuestions,
      answeredQuestions,
      score,
      accuracy,
      confidence,
      communication,
      speed,
      problemSolving,
      timeManagement,
      answers,
      aiFeedback,
      duration
    } = req.body;

    const result = await InterviewResult.create({
      userId: req.user.id,
      company,
      role,
      difficulty,
      interviewType,
      totalQuestions,
      answeredQuestions,
      score,
      accuracy,
      confidence,
      communication,
      speed,
      problemSolving,
      timeManagement,
      answers: answers || [],
      aiFeedback: aiFeedback || { strengths: [], weaknesses: [], suggestions: [] },
      duration: duration || 0
    });

    // Update user stats
    const user = await User.findById(req.user.id);
    if (user) {
      user.totalInterviews = (user.totalInterviews || 0) + 1;
      if (score > (user.bestScore || 0)) {
        user.bestScore = score;
      }

      // Update streak logic
      const now = new Date();
      const lastActive = user.lastActive ? new Date(user.lastActive) : null;
      if (lastActive) {
        const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          user.streak = (user.streak || 0) + 1;
        } else if (diffDays > 1) {
          user.streak = 1;
        }
      } else {
        user.streak = 1;
      }

      if (user.streak > (user.maxStreak || 0)) {
        user.maxStreak = user.streak;
      }

      user.lastActive = now;
      await user.save();

      // Auto-unlock badges
      const totalInterviews = user.totalInterviews || 0;
      const badgeChecks = [
        { id: 'first_interview', condition: totalInterviews >= 1 },
        { id: 'five_interviews', condition: totalInterviews >= 5 },
        { id: 'ten_interviews', condition: totalInterviews >= 10 },
        { id: 'perfect_score', condition: score === 100 },
        { id: 'streak_3', condition: (user.streak || 0) >= 3 },
        { id: 'streak_7', condition: (user.streak || 0) >= 7 },
        { id: 'streak_30', condition: (user.streak || 0) >= 30 },
      ];
      const badgeNames = {
        first_interview: 'First Interview', five_interviews: '5 Interviews Done', ten_interviews: '10 Interviews',
        perfect_score: 'Perfect Score', streak_3: '3-Day Streak', streak_7: '7-Day Streak', streak_30: '30-Day Streak',
      };
      for (const badge of badgeChecks) {
        if (badge.condition) {
          const existing = await Achievement.findOne({ userId: req.user.id, badgeId: badge.id });
          if (!existing) {
            await Achievement.create({ userId: req.user.id, badgeId: badge.id, badgeName: badgeNames[badge.id] || badge.id });
          }
        }
      }
    }

    res.status(201).json({ success: true, result });
  } catch (error) {
    console.error('SaveResult error:', error.message);
    res.status(500).json({ success: false, message: 'Server error saving result' });
  }
};

module.exports = { getResults, getResult, saveResult };
