var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuerySchema = new Schema({
	origin: String,
	queryID: String,
	characters: Array,
	filters: {
		maxAge: Number,
		minAge: Number,
		sex: String
	}
});

module.exports = mongoose.model('Query', QuerySchema);