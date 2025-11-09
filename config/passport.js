const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Determine callback URL based on environment
const getCallbackURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://recipe-cse341.onrender.com/auth/google/callback';
  }
  return 'http://localhost:3000/auth/google/callback';
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: getCallbackURL(),
    },
    (accessToken, refreshToken, profile, done) => {
      // Return the user profile
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;

