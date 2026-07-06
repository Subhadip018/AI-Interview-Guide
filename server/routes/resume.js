const express = require('express');
const router = express.Router();
const { analyzeResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/resume/analyze  (protected)
router.post('/analyze', protect, analyzeResume);

module.exports = router;
