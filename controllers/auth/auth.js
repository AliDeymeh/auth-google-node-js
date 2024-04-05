const jwt = require('jsonwebtoken');
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const catchAsync = require('../../utils/catchAsync');
const UserAuth = require('../../model/userModel');
const AppError = require('../../utils/appError');
//?? This is BUILD TOKEN
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
//?? BUILD TOKEN USER
const createSendNewToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('token', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    message,
    data: user
  });
};
//??SIGN UP SELF USER
exports.signup = catchAsync(async (req, res, next) => {
  const data = {
    displayName: req.body.displayName,
    customId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    familyName: req.body.familyName,
    givenName: req.body.givenName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  };
  if (!data.email)
    return next(new AppError('ایمیل برای ساخت کاربر الزامی می باشد', 400));
  const user = await UserAuth.findOne({ email: data.email });
  if (user) {
    return next(
      new AppError('کاربری با این مشخصات قبلا ثبت نام شده است ', 400)
    );
  }
  if (!user) {
    if (!data.password || !data.passwordConfirm)
      return next(new AppError('رمز عبور الزامی می باشد', 400));
    if (!data.password !== !data.passwordConfirm)
      return next(
        new AppError(
          'رمز عبور با تایید رمز عبور برابر نیستند مجدد امتحان کنید',
          400
        )
      );

    const newUser = await UserAuth.create(data);
    createSendNewToken(newUser, 201, res, 'با موفقیت کاربر ساخته شده');
  }
});
//?? LOGIN USER
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email) {
    return next(new AppError('لطفا ایمیل را به درستی وارد نمایید', 400));
  }
  if (!password) {
    return next(new AppError('لطفا رمز عبور را به درستی وارد نمایید', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await UserAuth.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('کاربری با مشخصات وارد شده یافت نشد', 400));
  }
  if (user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError('رمز  عبور وراد شده اشتباه می باشد.مجددا امتحان کنید', 401)
    );
  }

  // 3) If everything ok, send token to client
  createSendNewToken(user, 200, res, 'با موفقیت وارد شدید');
});

//??SIGN UP OR LOGIN USER FOR THE GIT
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
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
exports.createSendToken = createSendNewToken;
