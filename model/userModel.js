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
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  familyName: String,
  givenName: String,
  photos: String,
  provider: String,
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
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
const UserAuth = mongoose.model('User', userAuthSchema);

module.exports = UserAuth;
