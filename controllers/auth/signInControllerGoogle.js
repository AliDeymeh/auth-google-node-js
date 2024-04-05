const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID =
  '585194670917-friq9kl43ustm1b4s2pqam4i6pcto5of.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },

    function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

exports.googleCallBack = passport.authenticate('google', {
  failureRedirect: '/'
});
