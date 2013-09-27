define(function(require) {
	var d3 = require('d3');

	var n = 40
	  , random = d3.random.normal(0, .2);

	var margin = {top: 20, right: 20, bottom: 20, left: 40},
	width = 960 - margin.left - margin.right,
	height = 200 - margin.top - margin.bottom;

	var x = d3.scale.linear()
	.domain([0, n - 1])
	.range([0, width]);

	var y = d3.scale.linear()
	.domain([-1, 1])
	.range([height, 0]);

	return {
		create: function() {
			var svg = d3.select('body').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			svg.append('defs').append('clipPath')
			.append('rect')
			.attr('width', width)
			.attr('height', height);

			svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + y(0) + ')')
			.call(d3.svg.axis().scale(x).orient('bottom'));

			svg.append('g')
			.attr('class', 'y axis')
			.call(d3.svg.axis().scale(y).orient('left'));

			return function(color) {
				var data = d3.range(n).map(random);
				var line = d3.svg.line()
				.x(function(d, i) { return x(i); })
				.y(function(d, i) { return y(d); });

				var path = svg.append('g')
				.append('path')
				.datum(data)
				.attr('class', 'line')
				.attr('stroke', color)
				.attr('d', line);

				return function(value) {
					// push a new data point onto the back
					data.push(value);

					// redraw the line, and slide it to the left
					path
					.attr('d', line)
					.attr('transform', null)
					.transition()
					.duration(500)
					.ease('linear')
					.attr('transform', 'translate(' + x(-1) + ',0)');

					// pop the old data point off the front
					data.shift();
				}
			}
		}
	}
});
