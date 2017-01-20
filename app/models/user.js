var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var db = require('../config');

var Schema = mongoose.Schema;

userSchema = new Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true}
});

userSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(user.password, null, null).bind(user)
      .then(function(hash) {
        user.password = hash;
        next();
      });
  }
  next();
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

var User = mongoose.model('User', userSchema);
// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

module.exports = User;
