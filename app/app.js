(function() {
	var l = function() { console.log.apply(console, arguments); }
	var app = {
		draw: null,
		socket: null,
		opt: {
			CANVAS_SIZE: 500
		}
	};

	app.draw = SVG('canvas').size(app.opt.CANVAS_SIZE, app.opt.CANVAS_SIZE)
	var rect = app.draw.rect(100, 100).attr({ fill: '#f06' })

	app.socket = io.connect('http://localhost:3001');
	app.socket.on('a', function (data) {
		console.log(data);
	});
	//app.socket.on('g', function (data) {
		//console.log(data);
	//});
})();





