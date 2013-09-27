var l = function() {
	console.log.apply(console, arguments);
}

var Perception = require('./lib/perception');
var app = new Perception();

var handleGyroscope = function(time, x, y, z) {
    this.emit('g', {x: x, y: y, z: z});
}

var handleAccelerometer = function(time, x, y, z) {
	this.emit('a', {time: time, x: x, y: y, z: z});
}

app.gyroscope(handleGyroscope)
.accelerometer(handleAccelerometer)
.perceive();
