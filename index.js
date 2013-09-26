var l = function() {
	console.log.apply(console, arguments);
}

var Perception = require('./lib/perception');
var app = new Perception();

app.gyroscope(function() {
	l('gyroscope');
}).accelerometer(function() {
	l('accelerometer');
}).perceive();
