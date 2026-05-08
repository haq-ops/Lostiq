const express = require('express');
const router = express.Router();
const { findMatches } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.get('/match/:itemId', protect, findMatches);

module.exports = router;