// BASE SETUP
// =============================================================================

// Add the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var cors = require('cors');

const dotenv = require('dotenv');

dotenv.config();

// Configure app
app.use(morgan('dev')); // log requests to the console

// Configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup CORS
app.use(cors());

var port = process.env.PORT || 8080; // set our port

// DATABASE SETUP
var mongoose   = require('mongoose');
mongoose.connect(process.env.MONGODB_URI); // Connect to our database

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

// Create our router
var router = express.Router();

// Middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// Test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// Route used to log
// ----------------------------------------------------
router.route('/log')
	// Create a log (accessed at POST http://localhost:8080/api/log)
	.post(function(req, res) {
		console.log(req.body);
		if (req.body.characters) {
			var query = new Query();
			query.origin = req.headers.origin;
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
			action.origin = req.headers.origin;
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

	// get all the logs (accessed at GET http://localhost:8080/api/log)
	.get(function(req, res) {
		Action.find({}, (err, action) => {
			if (err)
				res.send(err);
			res.json(action);
		})
	});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
