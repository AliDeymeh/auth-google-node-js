const UserAuth = require('../model/userModel');
const catchAsync = require('./catchAsync');

// const factory = require('./handlerFactory');
const AppError = require('./appError');
const { createSendNewToken } = require('./createToken');

// const saveNewData = data => {
//   factory.createOne(UserAuth, data);
// };
exports.saveDataUser = catchAsync(async (req, res, next) => {
  const user = req.user ? true : false;
  const emailUser = user ? req.user.emails[0].value : req.body.email;

  const doc = await UserAuth.findOne({ email: emailUser });

  if (doc && user) {
    createSendNewToken(doc, 200, res, 'ورود با موفقیت انجام شد');
  }
  if (doc && !user) {
    return AppError(
      'failed',
      400,
      res,
      'با این ایمیل کاربری وجود دارد مجددا امتحان کنید'
    );
  }

  if (!doc) {
    const data = {
      displayName: user ? req.user.displayName : req.body.displayName,
      customId: user
        ? req.user.id
        : Math.floor(10000000 + Math.random() * 90000000).toString(),
      familyName: user
        ? req.user.provider === 'google'
          ? req.user.name.familyName
          : req.user.familyName
        : req.body.familyName,
      givenName: user
        ? req.user.provider === 'google'
          ? req.user.name.givenName
          : req.user.givenName
        : req.body.givenName,

      provider: user ? req.user.provider : 'selfSignUp',
      email: user ? emailUser : req.body.email,
      password: user ? '12345678' : req.body.password,
      passwordConfirm: user ? '12345678' : req.body.passwordConfirm
    };

    if (!data.password || !data.passwordConfirm) {
      return AppError(
        'failed',
        400,
        res,
        'رمز عبور با تایید رمز عبور الزامی می باشد  مجدد امتحان کنید'
      );
    }
    if (data.password !== data.passwordConfirm) {
      return next(
        AppError(
          'failed',
          400,
          res,
          'رمز عبور با تایید رمز عبور برابر نیستند مجدد امتحان کنید'
        )
      );
    }

    const newData = await UserAuth.create(data);

    createSendNewToken(
      newData,
      201,
      res,
      'ثبت نام با موفقیت انجام شد. خوش آمدید'
    );
  }
});
