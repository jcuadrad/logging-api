// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

const dotenv = require('dotenv');

dotenv.config();

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

// DATABASE SETUP
var mongoose   = require('mongoose');
mongoose.connect(process.env.MONGODB_URI); // connect to our database

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("DB connection alive");
});

// Movie models lives here
var Movie     = require('./app/models/movie');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// on routes that end in /movies
// ----------------------------------------------------
router.route('/movies')

	// create a movie (accessed at POST http://localhost:8080/movies)
	.post(function(req, res) {
		console.log(req.body);
		var movie = new Movie();		// create a new instance of the Movie model
		movie.name = req.body.name;  // set the movies name (comes from the request)
		movie.url = req.body.url;
		movie.length = req.body.length;
		movie.images = req.body.images;
		movie.categories = req.body.categories;
		movie.videos = req.body.videos;
		movie.description = req.body.description;
		movie.year = req.body.year;
		movie.status = req.body.status;
		movie.country = req.body.country;
		movie.director = req.body.director;
		movie.producer = req.body.producer;
		movie.actors = req.body.actors;
		movie.book = req.body.book;
		movie.history = req.body.history;

		movie.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'movie created whaaat!' });
		});

		
	})

	// get all the movies (accessed at GET http://localhost:8080/api/movies)
	.get(function(req, res) {
		Movie.find(function(err, movies) {
			if (err){
				console.log(err);
				return res.send(err);
			} else {
				return res.json(movies);
			}
		});
	});

// on routes that end in /movies/:movie_id
// ----------------------------------------------------
router.route('/movies/:movie_id')

	// get the movie with that id
	.get(function(req, res) {
		Movie.findById(req.params.movie_id, function(err, movie) {
			if (err)
				res.send(err);
			res.json(movie);
		});
	})

	// update the movie with this id
	.put(function(req, res) {
		Movie.findById(req.params.movie_id, function(err, movie) {

			if (err)
				res.send(err);

			movie.name = req.body.name;
			movie.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'movie updated!' });
			});

		});
	})

	// delete the movie with this id
	.delete(function(req, res) {
		Movie.remove({
			_id: req.params.movie_id
		}, function(err, movie) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
