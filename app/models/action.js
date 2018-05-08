var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ActionSchema = new Schema({
	sessionID: String,
	queryID: String,
	action: String,
	Meta: Object,
	Timestamp: Date
});

module.exports = mongoose.model('Action', ActionSchema);