var l = function() {
    console.log.apply(console, arguments);
}

var net = require('net');

var gyro = 71;
var acc  = 65;

var server = net.createServer(function(c) {
  l("Connection opened");

  c.on('data', function(data) {
      var time = data.readDoubleLE(0);
      var type = data.readUInt8(32);

      var x = data.readDoubleLE(8);
      var y = data.readDoubleLE(16);
      var z = data.readDoubleLE(24);

      l(x.toFixed(10), y.toFixed(10), z.toFixed(10));
  });

  c.on('end', function() {
    l('Connection closed');
  });

  c.pipe(c);
});

server.listen(3000, function() {
    l('Server is listening port 3000');
});
