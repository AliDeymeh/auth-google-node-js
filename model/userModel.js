const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userAuthSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: [true, 'نام کاربری الزامی می باشد ']
  },
  customId: String,
  email: {
    type: String,
    required: [true, 'ایمیل را وارد کنید'],
    unique: [true, 'این ایمیل از قبل ثبت شده است '],

    lowercase: true,
    validate: [validator.isEmail, 'لطفا ایمیل را به درستی وارد نمایید']
  },
  familyName: String,
  givenName: String,
  photos: String,
  provider: { type: String, default: 'selfSignUp' },
  password: {
    type: String,
    required: [true, 'لطفا رمز عبور را به درستی وارد نمایید   '],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, ' لطفا رمز عبور را تایید فرمایید'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: ' رمز عبور و تایید رمز عبور باهم برابر نیستند'
    }
  }
});

userAuthSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userAuthSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const UserAuth = mongoose.model('User', userAuthSchema);

module.exports = UserAuth;
