const express = require('express');
const router = express.Router();
const { getResults, getResult, saveResult } = require('../controllers/resultsController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/results  (protected)
router.get('/', protect, getResults);

// GET /api/results/:id  (protected)
router.get('/:id', protect, getResult);

// POST /api/results  (protected)
router.post('/', protect, saveResult);

module.exports = router;
