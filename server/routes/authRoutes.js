const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // JWT token generate பண்ணு
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Frontend-க்கு redirect பண்ணு token-உடன்
    res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}&userId=${req.user._id}`);
  }
);

module.exports = router;