var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

// Redis Connection 
var redis = require('redis');
if (process.env.REDISTOGO_URL) 
{
   	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	var client = require("redis").createClient(rtg.port, rtg.hostname);

	redis.auth(rtg.auth.split(":")[1]);
} 
else 
{
	var client = redis.createClient();
	client.select((process.env.NODE_ENV || 'development').length);

}
// End Redis Connection

app.get('/cities', function(req, res) {
	client.hkeys('cities', function(error, names){
		res.json(names);
	});
});

app.post('/cities', urlencoded, function(req, res){
	var newCity = req.body;
	if(!newCity.name || !newCity.description) {
		res.sendStatus(400);
		return false;
	}

	client.hset('cities', newCity.name, newCity.description, function(error){
		if(error) throw error; 
		res.status(201).json(newCity.name);
	});
	
});

app.delete('/cities/:name', function(req, res){
	client.hdel('cities', req.params.name, function(error){
		if(error) throw error;
		res.sendStatus(204);
	});
});

module.exports = app;
