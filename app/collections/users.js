// NOTE: this file is not needed when using MongoDB
var db = require('../config');
var User = require('../models/user');

var Users = User.collection;

// Users.model = User;

module.exports = Users;