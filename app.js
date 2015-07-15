var express = require('express');
var app = express();
var morgan = require('morgan');

app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(morgan('combined'));

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

// app.post('/presets')

app.listen(process.env.PORT || 3000);