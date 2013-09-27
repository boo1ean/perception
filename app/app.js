define(function(require) {
	var graph = require('graph')
	  , io    = require('io');

	var l = function() {
		console.log.apply(console, arguments);
	}

	var app = {
		draw: null,
		socket: null,
		opt: {
			CANVAS_SIZE: 500
		},

		setupEvents: function() {
			this.socket = io.connect('http://localhost:3001');

			var g = graph.create();

			var x = g('red');
			var y = g('green');
			var z = g('blue');

			var vel = graph.create();
			var v = vel('black');

			var prev     = 0;
			var delta    = 0;
			var velocity = 0;
			var boost    = 0;

			this.socket.on('a', function(data) {
				delta = data.time - prev;
				prev  = data.time;
				boost = delta * data.x;

				velocity += boost;

				x(data.x);
				y(data.y);
				z(data.z);
                v(velocity);
			});

			document.getElementById('reset').onclick = function() {
				velocity = 0;
			};
		},

		start: function() {
			this.setupEvents();
		}
	};

	return app;
});
