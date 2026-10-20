const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const callbackURL =
  process.env.NODE_ENV === 'production'
    ? 'https://lostiq-backend.onrender.com/api/auth/google/callback'
    : 'http://localhost:5000/api/auth/google/callback';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL,
  proxy: true
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      return done(null, user);
    }

    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: 'google_' + profile.id,
      avatar: profile.photos[0]?.value || '',
      city: 'Colombo'
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;