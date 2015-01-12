var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

var cities = {
	"Lotopia": "description1",
	"Caspiana": "description2",
	"Indigo": "description3"
};

app.get('/cities', function(req, res) {
	res.json(Object.keys(cities));	
});

app.post('/cities', urlencoded, function(req, res){
	var newCity = req.body;
	cities[newCity.name] = newCity.description
	res.status(201).json(newCity.name);
});

module.exports = app;
