module.exports = function Perception() {
    this.server = null;
    this.handleAccelerometer = null;
    this.handleGyroscope = null;
}

var net = require('net');

Perception.prototype.perceive = function() {
    this.server = net.createServer(function(c) {
      l("Connection opened");

      c.on('data', function(data) {

      });

      c.on('end', function() {
        l('Connection closed');
      });

      c.pipe(c);
    });

    server.listen(3000, function() {
        l('Server is listening port 3000');
    });
}

Perception.prototype.gyroscope = function(handler) {
    if (typeof callback === 'function') {
        this.handleGyroscope = handler;
    }
}

Perception.prototype.accelerometer = function(handler) {
    if (typeof callback === 'function') {
        this.handleAccelerometer = handler;
    }
}
