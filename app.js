var express = require('express');
var app = express();
var morgan = require('morgan');
var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var bodyParser = require('body-parser');

var mongoUri = "mongodb://localhost:27017/synth-app";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(morgan('combined'));

MongoClient.connect(mongoUri, function(error, db) {
	if(error) {throw error};
	console.log("connected to that database shit");

	app.listen(process.env.PORT || 3000);

	app.get('/', function(req, res) {
		res.redirect('/index.html');
	});

	app.post('/presets', function(req, res) {
		var response = {};
		response.user = req.body.user
		db.collection("presets").find({user: req.body.user}).toArray(function(err, result) {
			if (result.length === 0) {
				db.collection("presets").insert(req.body, function(err, results) {
					response.results = results;
					res.json(response);
				});
			} else {
				db.collection("presets").update({user: req.body.user}, {$set: req.body.synth}, function(err, results) {
					response.results = results;
					res.json(response);
				});
			}
		});

	});

	app.get('/presets/:user', function(req, res) {
		console.log(req.params);
		db.collection("presets").find({user: req.params["user"]}).toArray(function(err, preset) {
			if(err) {throw err};
			console.log(preset);
			res.json({hello: "world"});
		});
	});

	process.on('exit', function() {
		db.close();
	});


});