var l = function() {
	console.log.apply(console, arguments);
}

var Perception = require('./lib/perception');
var app = new Perception();

var handleGyroscope = function(time, x, y, z) {
	if (this.ioSockets[0]) {
		this.ioSockets[0].emit('g', {x: x, y: y, z: z});
	}
}

var handleAccelerometer = function(time, x, y, z) {
	return;
	if (this.ioSockets[0]) {
		this.ioSockets[0].emit('a', {x: x, y: y, z: z});
	}
}

app.gyroscope(handleGyroscope)
.accelerometer(handleAccelerometer)
.perceive();
