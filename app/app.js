define(function(require) {
	var graph = require('graph')
	  , io    = require('io');

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

			this.socket.on('a', function(data) {
				x(data.x);
				y(data.y);
				z(data.z);
			});
		},

		start: function() {
			this.setupEvents();
		}
	};

	return app;
});
