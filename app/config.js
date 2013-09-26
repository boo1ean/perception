requirejs.config({
	paths: {
		'd3': 'vendor/d3/d3',
		'io': 'vendor/socket.io-client/dist/socket.io.min'
	},

	shim: {
		'd3': {
			'exports': 'd3'
		}
	}
});

require(['app'], function(app) {
	app.start();
});
