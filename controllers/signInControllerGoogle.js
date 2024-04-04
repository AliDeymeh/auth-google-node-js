const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

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

exports.googleAuth = passport.authenticate('google', { scope: 'profile' });

exports.googleCallBack = passport.authenticate('google', {
  failureRedirect: '/'
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
      familyName: req.user.name.familyName,
      givenName: req.user.name.givenName,
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
