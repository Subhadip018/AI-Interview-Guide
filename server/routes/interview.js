const express = require('express');
const router = express.Router();
const { getFeedback } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/interview/feedback  (protected)
router.post('/feedback', protect, getFeedback);

module.exports = router;
