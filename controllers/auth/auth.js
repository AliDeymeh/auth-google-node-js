const jwt = require('jsonwebtoken');

const catchAsync = require('../../utils/catchAsync');
const UserAuth = require('../../model/userModel');
const AppError = require('../../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
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
exports.signup = catchAsync(async (req, res, next) => {
  const data = {
    displayName: req.body.displayName,
    customId: Math.random().toString(),
    familyName: req.body.familyName,
    givenName: req.body.givenName,
    provider: 'selfSignUp',
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  };
  const newUser = await UserAuth.create(data);

  createSendNewToken(newUser, 201, res);
});

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

exports.createSendToken = createSendNewToken;
