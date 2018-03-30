var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
	name: String,
	poster: String,
	length: Number,
	images: Array,
	categories: Array,
	trailer: String,
	description: String,
	year: Number,
	status: String,
	country: String,
	director: String,
	producer: String,
	actors: Array,
	book: String,
	history: String
});

module.exports = mongoose.model('Movie', MovieSchema);