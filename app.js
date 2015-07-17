var express = require('express');
var app = express();
var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

// if (app.get('env') === 'development') {
// 	console.log("app is in development environment");
// 	var morgan = require('morgan');
// 	app.use(morgan('combined'));
// }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

var mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost:27017/synth-app";

MongoClient.connect(mongoUri, function(error, db) {
	if(error) {throw error};

	app.listen(port);
	console.log("dat database tho, listening on port " + port);


	app.get('/', function(req, res) {
		res.send('/index.html');
	});

	app.post('/presets', function(req, res) {
		var response = {};
		if (req.body.user) {
			response.user = req.body.user
			db.collection("presets").update({user: req.body.user}, {$set: {synth: req.body.synth, effects: req.body.effects, user: req.body.user}}, {upsert: true}, function(err, result) {
				response.result = result;
				res.json(response);
			});
		} else {
			response.result = {ok: false};
			res.json(response);
		};

	});

	app.get('/presets/:user', function(req, res) {
		var response = {};
		db.collection("presets").find({user: req.params["user"]}).toArray(function(err, preset) {
			if(err) {throw err};
			if (preset.length === 0) {
				response.result = "not_found";
			} else {
				response.result = preset[0];
			}
			res.json(response);
		});
	});

	process.on('exit', function() {
		db.close();
	});


});