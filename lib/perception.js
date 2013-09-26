var express  = require('express')
  , socketio = require('socket.io')
  , http     = require('http')
  , path     = require('path')
  , net      = require('net');

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
	this.server    = null;
	this.ioServer  = null;
	this.express   = null;
	this.io        = null;
	this.ioSockets = [];
	this.handlers  = {};
}

Perception.prototype.perceive = function() {
	if (!this.configured()) {
		l('Perception server is not properly configured.');
		return false;
	}

	this.setupSocketIO();
	this.setupServer();
	this.listen();
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

			that.handlers[type].apply(that, [time, x, y, z]);
		});

		c.on('end', function() {
			l('Connection closed');
		});

		c.pipe(c);
	});
}

Perception.prototype.setupSocketIO = function() {
	this.express = express();
	this.ioServer = http.createServer(this.express)
	this.io = socketio.listen(this.ioServer);

	this.express.get('/', function(req, res) {
		var index = path.resolve(__dirname + '/../index.html');
		res.sendfile(index);
	});

	this.express.use(express.static(__dirname + '/../app'));

	var that = this;
	this.io.sockets.on('connection', function (socket) {
		l('Bound new IO socket.');
		that.ioSockets.push(socket);
	});
}

Perception.prototype.listen = function() {
	this.ioServer.listen(exports.ports.io);
	this.server.listen(exports.ports.server, m('Start listen port ' + exports.ports.server));
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

Perception.prototype.emit = function() {
	var args = arguments;
	this.ioSockets.forEach(function(socket) {
		socket.emit.apply(socket, args);
	});
}
