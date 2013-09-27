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

			var x = graph('x');
			var y = graph('y');
			var z = graph('z');
			var v = graph('v');

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
