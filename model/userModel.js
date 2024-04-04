const mongoose = require('mongoose');

const userAuthSchema = new mongoose.Schema({
  displayName: String,
  customId: String,
  email: String,
  familyName: String,
  givenName: String,
  photos: String,
  provider: String
});
userAuthSchema.pre('save', function(next) {
  if (this.provider === 'google') {
    this._id = this.provider;
  }
  next();
});
const UserAuth = mongoose.model('User', userAuthSchema);

module.exports = UserAuth;
