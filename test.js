var request = require('supertest');
var app = require('./app');
var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);
client.flushdb();

describe('Requests to the root path', function(){

	it('Returns a 200 status code', function(done){
		request(app)
			.get('/')
			.expect(200, done);
	});

	it('Returns a html format', function(done){
		request(app)
			.get('/')
			.expect('Content-Type', /html/, done);
	});

	it('Returns a index file with Cities', function(done){
		request(app)
			.get('/')
			.expect(/cities/i, done);
	});

});

describe('Listening cities on /cities', function(){

	it('Returns a 200 status code', function(done){

		request(app)
			.get('/cities')
			.expect(200, done);
	});

	it('Returns JSON format', function(done){

		request(app)
			.get('/cities')
			.expect('Content-Type', /json/, done);
	});

	it('Returns initial cities', function(done){

		request(app)
			.get('/cities')
			.expect(JSON.stringify([]), done);

	});

});

describe('Creating new cities', function() {

	it('Returns a 201 status code', function(done){
		request(app)
			.post('/cities')
			.send('name=Springfield&description=Where+the+Simpsons+Live')
			.expect(201, done);
	});

	it('Return the city name', function(done){
		request(app)
			.post('/cities')
			.send('name=Springfield&description=Where+the+Simpsons+Live')
			.expect(/springfield/i, done);
	});

	it('Validates the new city form', function(done){
		request(app)
			.post('/cities')
			.send('name=&description=')
			.expect(400, done);
	});
});


describe('Deleting cities', function(){
	
	before(function(){
		client.hset('cities', 'banana', 'desc');
	});

	after(function(){
		client.flushdb();
	});
	

	it('Returns a 204 status code', function(done) {
		request(app)
			.delete('/cities/banana')
			.expect(204, done);
	});

});

describe('Shows city info', function(){

	before(function(){
		client.hset('cities', 'banana', 'desc');
	});

	after(function(){
		client.flushdb();
	});

	it('Returns 200 status code', function(done){
		request(app)
			.get('/cities/banana')
			.expect(200, done);
	});

	it('Returns HTML format', function(done){
		request(app)
			.get('/cities/banana')
			.expect('Content-Type', /html/, done);
	});

	it('Returns information about a specific city', function(done){
		request(app)
			.get('/cities/banana')
			.expect(/desc/, done);
	});

})
