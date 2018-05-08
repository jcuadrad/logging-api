// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var cors     = require('cors');

const dotenv = require('dotenv');

dotenv.config();

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup CORS
app.use(cors());

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


// Import models
var Action = require('./app/models/action');
var Query = require('./app/models/query');

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
router.route('/log')

	// create a movie (accessed at POST http://localhost:8080/movies)
	.post(function(req, res) {
		console.log(req.body);
		if (req.body.characters) {
			var query = new Query();
			query.queryID = req.body.queryID;
			query.characters = req.body.characters;
			query.filters = req.body.filters;

			query.save(err => {
				if (err)
					res.send(err);
				res.json({ message: 'QUERY LOGGED!' });
			})
		} else if (req.body.action) {
			var action = new Action();
			action.sessionID = req.body.sessionId;
			action.action = req.body.action;
			action.queryID = req.body.queryId;
			action.Timestamp = req.body.Timestamp;

			action.save(err => {
				if (err)
					res.send(err);
				res.json({ message: 'ACTION LOGGED!' });
			})
		}
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
