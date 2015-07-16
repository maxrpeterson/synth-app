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
		console.log(req.body);
		res.json({hello: "world"});
	});

	process.on('exit', function() {
		db.close();
	});


});