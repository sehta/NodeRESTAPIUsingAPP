var express = require('express');
var api = express();

module.exports = function(passport){


	/* Handle Login POST */
	api.post('/login', function (req, res) {
        
		console.log(req);
        res.json(req);
	});

	/* Handle Login POST */
	api.get('/login', function (req, res) {
        var quotes = [
  { author : 'Audrey Hepburn', text : "Nothing is impossible, the word itself says 'I'm possible'!"},
  { author : 'Walt Disney', text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"},
  { author : 'Unknown', text : "Even the greatest was once a beginner. Don't be afraid to take that first step."},
  { author : 'Neale Donald Walsch', text : "You are afraid to die, and you're afraid to live. What a way to exist."}
];
		console.log(req);
        res.json(quotes);
	});


	return api;
}





