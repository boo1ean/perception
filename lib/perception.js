var express  = require('express')
  , socketio = require('socket.io')
  , http     = require('http')
  , net      = require('net');

//app.get('/', function (req, res) {
	//res.sendfile(__dirname + '/index.html');
//});

//io.sockets.on('connection', function (socket) {
	//socket.emit('news', { hello: 'world' });
	//socket.on('my other event', function (data) {
		//console.log(data);
	//});
//});

module.exports = exports = Perception;

exports.ports = {
	server: 3000,
	io: 3001
}

exports.SIGNAL_TYPE_GYROSCOPE = 71;
exports.SIGNAL_TYPE_ACCELEROMETER = 65;

var l = function() {
	console.log.apply(console, arguments);
}

var m = function(message) {
	return function() {
		console.log(message);
	}
}

function Perception() {
    this.server   = null;
    this.ioServer = null;
    this.app      = null;
    this.io       = null;
    this.handlers = {};
}


Perception.prototype.perceive = function() {
	if (!this.configured()) {
		l('Perception server is not properly configured.');
		return false;
	}

	this.setupSocketIO();
	this.setupServer();

	this.ioServer.listen(exports.ports.io);
	this.server.listen(exports.ports.server, m('Start listen port ' + exports.ports.server));
}

Perception.prototype.configured = function() {
	return typeof this.handlers[exports.SIGNAL_TYPE_GYROSCOPE] === 'function' &&
		typeof this.handlers[exports.SIGNAL_TYPE_ACCELEROMETER] === 'function';
}

Perception.prototype.setupServer = function() {
	var that = this;
	this.server = net.createServer(function(c) {
		l("Connection opened");
		c.on('data', function(data) {
			var type = data.readUInt8(32);

			var time = data.readDoubleLE(0);
			var x = data.readDoubleLE(8);
			var y = data.readDoubleLE(16);
			var z = data.readDoubleLE(24);

			that.handlers[type](time, x, y, z);
		});

		c.on('end', function() {
			l('Connection closed');
		});

		c.pipe(c);
	});
}

Perception.prototype.setupSocketIO = function() {
	this.app = express();
	this.ioServer = http.createServer(this.app)
	this.io = socketio.listen(this.ioServer);
}

Perception.prototype.gyroscope = function(handler) {
	if (typeof handler === 'function') {
		this.handlers[exports.SIGNAL_TYPE_GYROSCOPE] = handler;
	}
	return this;
}

Perception.prototype.accelerometer = function(handler) {
	if (typeof handler === 'function') {
		this.handlers[exports.SIGNAL_TYPE_ACCELEROMETER] = handler;
	}
	return this;
}
