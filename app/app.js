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
			var v = vel('cyan');

			var dist = graph.create();
			var d = dist('magenta');

			var gyro = graph.create();
			var gx = gyro('red');
			var gy = gyro('green');
			var gz = gyro('blue');

			var gyrot = graph.create();
			var gt = gyrot('black');

			var prev     = 0;
			var delta    = 0;
			var velocity = 0;
			var distance = 0;
			var boost    = 0;

			var gprev     = 0;
			var gdelta    = 0;
			var gdistance = 0;
			var gboost    = 0;

			var ui = {
				ax: document.getElementById('ax'),
				ay: document.getElementById('ay'),
				az: document.getElementById('az'),
				gx: document.getElementById('gx'),
				gy: document.getElementById('gy'),
				gz: document.getElementById('gz'),
				v: document.getElementById('v'),
				d: document.getElementById('d'),
				gd: document.getElementById('gd')
			}

			var fixed = 12;

			this.socket.on('a', function(data) {
				delta = data.time - prev;
				prev  = data.time;
				boost = delta * data.x;

				velocity += boost;

				if (Math.abs(data.x) < 0.03) {
					velocity = 0;
				}

				diff = delta * velocity;
				distance += diff;

				x(data.x);
				y(data.y);
				z(data.z);
				v(velocity);
				d(distance / 5);

				ui.ax.innerHTML = (data.x).toFixed(fixed);
				ui.ay.innerHTML = (data.y).toFixed(fixed);
				ui.az.innerHTML = (data.z).toFixed(fixed);
				ui.v.innerHTML  = (velocity).toFixed(fixed);
				ui.d.innerHTML  = (distance / 5).toFixed(fixed);
			});

			this.socket.on('g', function(data) {
				gdelta = data.time - gprev;
				gprev  = data.time;
				gboost = gdelta * data.x;

				gdistance += gboost;

				gx(data.x);
				gy(data.y);
				gz(data.z);

                gt(gdistance);

				ui.gx.innerHTML = data.x.toFixed(fixed);
				ui.gy.innerHTML = data.y.toFixed(fixed);
				ui.gz.innerHTML = data.z.toFixed(fixed);
				ui.gd.innerHTML = gdistance.toFixed(fixed);
			});

			document.getElementById('reset').onclick = function() {
				velocity = 0;
				gdistance = 0;
				distance = 0;
			};
		},

		start: function() {
			this.setupEvents();
		}
	};

	return app;
});
