const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  someData: { type: String },
  anotherData: { type: String }
});

module.exports = mongoose.model('user', UserSchema);
