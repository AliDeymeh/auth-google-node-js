const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

const GITHUB_CLIENT_ID = '0861c406f204ba4c0e23';
const GITHUB_CLIENT_SECRET = 'afac58f29813aac4acb7efcec73031a7f438bada';

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback'
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

exports.googleAuth = passport.authenticate('github', { scope: 'profile' });

exports.googleCallBack = passport.authenticate('github', {
  failureRedirect: '/ '
});
// getOne(Tour, { path: 'reviews' });
exports.saveData = catchAsync(async (req, res, next) => {
  const idUser = req.user.id;

  const user = await User.findOne({ customId: idUser });
  if (user) {
    res.status(400).json({
      status: 'success',
      message: 'کاربری با این مشخصات وجود دارد مجددا امتحان کنید',
      data: user
    });
  }
  if (!user) {
    const data = {
      displayName: req.user.displayName,
      customId: req.user.id,
      familyName: req.user.username,
      givenName: req.user.displayName,
      photos: req.user.photos[0].value,
      provider: req.user.provider
    };

    const newData = await User.create(data);

    res.status(201).json({
      status: 'success',
      message: 'کاربر جدید ایجاد شد',
      data: newData
    });
  }
});
