const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const GITHUB_CLIENT_ID = '0861c406f204ba4c0e23';
const GITHUB_CLIENT_SECRET = 'afac58f29813aac4acb7efcec73031a7f438bada';

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: 'user:email'
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

exports.gitAuth = passport.authenticate('github', {
  scope: 'user:email'
});

exports.gitCallBack = passport.authenticate('github', {
  failureRedirect: '/ '
});
