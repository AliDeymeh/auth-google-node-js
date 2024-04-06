const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;

const catchAsync = require('../../services/catchAsync');
const UserAuth = require('../../model/userModel');
const AppError = require('../../services/appError');
const { saveDataUser } = require('../../services/saveData');
const { createSendNewToken } = require('../../services/createToken');

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

exports.signup = saveDataUser;
//?? LOGIN USER
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email) {
    return AppError('failed', 400, res, 'ایمیل اجباری می باشد');
  }
  if (!password) {
    return AppError('failed', 400, res, 'رمز عبور را وارد نمایید');
  }
  // 2) Check if user exists && password is correct
  const user = await UserAuth.findOne({ email }).select('+password');
  if (!user) {
    return AppError('failed', 404, res, 'کاربر مورد نظر یافت نشد');
  }
  if (user || !(await user.correctPassword(password, user.password))) {
    return AppError(
      'failed',
      400,
      res,
      'رمز عبور یا نام کاربری اشتباه می باشد'
    );
  }

  // 3) If everything ok, send token to client
  createSendNewToken(user, 200, res, 'با موفقیت وارد شدید');
});

//??SIGN UP OR LOGIN USER FOR THE GIT

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CLIENT_CALLBACK,
      scope: 'user:email'
    },
    function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
exports.gitAuth = passport.authenticate('github', {
  scope: 'user:email'
});

exports.gitCallBack = passport.authenticate('github', {
  failureRedirect: '/ '
});

//??LOGIN OR SIGN UP FOR THE GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACK
    },

    function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

exports.googleCallBack = passport.authenticate('google', {
  failureRedirect: '/'
});
//?? LOGIN OR SIGN UP FOR THE MICROSOFT

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MIC_ID,
      clientSecret: process.env.MIC_SECRET,
      callbackURL: process.env.MIC_CALLBACK
    },
    function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
exports.micAuth = passport.authenticate('microsoft', { scope: 'user.read' });

exports.micCallBack = passport.authenticate('microsoft', {
  failureRedirect: '/ '
});
