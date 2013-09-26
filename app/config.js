requirejs.config({
	paths: {
		'd3': 'bower_components/d3/d3'
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
