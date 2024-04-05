const UserAuth = require('../../model/userModel');
const catchAsync = require('../../utils/catchAsync');
const { createSendToken } = require('./auth');

exports.saveDataUser = catchAsync(async (req, res, next) => {
  const emailUser = req.user.emails[0].value;

  const user = await UserAuth.findOne({ email: emailUser });
  if (user) {
    createSendToken(user, 200, res, 'ورود با موفقیت انجام شد');
  }
  if (!user) {
    const data = {
      displayName: req.user.displayName,
      customId: req.user.id,
      familyName:
        req.user.provider === 'google'
          ? req.user.name.familyName
          : req.user.familyName,
      givenName:
        req.user.provider === 'google'
          ? req.user.name.givenName
          : req.user.givenName,
      photos: req.user.photos[0].value,
      provider: req.user.provider,
      email: emailUser,
      password: '12345678',
      passwordConfirm: '12345678'
    };

    const newData = await UserAuth.create(data);

    createSendToken(newData, 201, res, 'ثبت نام با موفقیت انجام شد. خوش آمدید');
  }
});
