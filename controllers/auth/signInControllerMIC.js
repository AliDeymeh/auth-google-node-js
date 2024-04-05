const passport = require('passport');
const MicrosoftStrategy = require('passport-microsoft').Strategy;

const User = require('../../model/userModel');
const catchAsync = require('../../utils/catchAsync');

const MIC_ID = '6e619621-d903-4aa7-9b9e-de1ba8cfc8daf';
const MIC_SECRET = '3b193387-a047-4d60-a4ab-7fc8d610f8d6';

passport.use(
  new MicrosoftStrategy(
    {
      clientID: MIC_ID,
      clientSecret: MIC_SECRET,
      callbackURL: 'http://localhost:3000/auth/microsoft/callback'
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

exports.googleAuth = passport.authenticate('microsoft', { scope: 'user.read' });

exports.googleCallBack = passport.authenticate('microsoft', {
  failureRedirect: '/ '
});
// getOne(Tour, { path: 'reviews' });
exports.saveData = catchAsync(async (req, res, next) => {
  const idUser = req.user.id;
  console.log('data', req.user);
  // const user = await User.findOne({ customId: idUser });
  // if (user) {
  //   res.status(400).json({
  //     status: 'success',
  //     message: 'کاربری با این مشخصات وجود دارد مجددا امتحان کنید',
  //     data: user
  //   });
  // }
  // if (!user) {
  //   const data = {
  //     displayName: req.user.displayName,
  //     customId: req.user.id,
  //     familyName: req.user.username,
  //     givenName: req.user.displayName,
  //     photos: req.user.photos[0].value,
  //     provider: req.user.provider
  //   };

  //   const newData = await User.create(data);

  //   res.status(201).json({
  //     status: 'success',
  //     message: 'کاربر جدید ایجاد شد',
  //     data: newData
  //   });
  // }
});
