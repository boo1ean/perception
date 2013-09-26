define(function(require) {
	var graph = require('graph');

	var app = {
		draw: null,
		socket: null,
		opt: {
			CANVAS_SIZE: 500
		},

		setupEvents: function() {
			this.socket = io.connect('http://localhost:3001');
			this.socket.on('a', function (data) {
				console.log(data);
			});
		},

		start: function() {
			this.setupEvents();
		}
	};

	return app;
});
