const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const User = require('../../model/userModel');
const catchAsync = require('../../utils/catchAsync');
const { createSendToken } = require('./auth');

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

exports.googleAuth = passport.authenticate('github', {
  scope: 'user:email'
});

exports.googleCallBack = passport.authenticate('github', {
  failureRedirect: '/ '
});
// getOne(Tour, { path: 'reviews' });
exports.saveData = catchAsync(async (req, res, next) => {
  const emailUser = req.user.emails[0].value;
  const user = await User.findOne({ email: emailUser });
  if (user) {
    createSendToken(user, 200, res, 'ورود با موفقیت انجام شد');
  }
  if (!user) {
    const data = {
      displayName: req.user.displayName,
      customId: req.user.id,
      familyName: req.user.username,
      givenName: req.user.displayName,
      photos: req.user.photos[0].value,
      provider: req.user.provider,
      email: emailUser,
      password: '12345678',
      passwordConfirm: '12345678'
    };

    const newData = await User.create(data);

    createSendToken(newData, 201, res, 'ثبت نام با موفقیت انجام شد. خوش آمدید');
  }
});
