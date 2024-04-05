//!!user controller
const User = require('../../model/userModel');

const AppError = require('../../services/appError');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../../services/catchAsync');
const factory = require('../../services/handlerFactory');

exports.getAllUsers = factory.getAll(User);
const filterObj = (Obj, ...allowedFiled) => {
  const newObj = {};
  Object.keys(Obj).forEach(el => {
    if (allowedFiled.includes(el)) {
      newObj[el] = Obj[el];
    }
  });
  return newObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for the update password ,please use /updateMyPassword',
        400
      )
    );
  }
  const filteredBy = filterObj(req.body, 'name', 'email', 'role');
  const user = await User.findByIdAndUpdate(req.user.id, filteredBy, {
    new: true,
    runValidation: true
  });
  // user.name = 'aliiiiiiiiiiiii';
  // await user.save({ validationBefore: false });
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = User.findByIdAndUpdate(req.user.id, { active: false });

  if (!user) {
    return next(new AppError('This user not founded for the in ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
