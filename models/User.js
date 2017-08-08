var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: String,
	password: String,
	token: String
}, {
	collection: 'users'
});

module.exports = mongoose.model('User', UserSchema);