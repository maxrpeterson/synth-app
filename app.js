var express = require('express');
var app = express();
var morgan = require('morgan');

app.use(express.static('public'));
app.use(morgan('combined'));

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

app.listen(3000);