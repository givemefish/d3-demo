import * as d3 from 'd3';
import '../style.css';

var data = [2, 4, 8, 10];

var svg = d3.select('body').append('svg').attr('width', 500).attr('height', 400);

var width = svg.attr('width');
var height = svg.attr('height');
var titleHeight = 20;
var radius = Math.min(width, height - titleHeight) / 2;
var color = d3.scaleOrdinal(['#4daf4a', '#579ee8', '#ff9f30', '#c84ea3', '#e41a1c']);

var g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2 + titleHeight})`);

var pie = d3.pie().value(function (d) {
  return d.percent;
});

var path = d3
  .arc()
  .outerRadius(radius - 10)
  .innerRadius(100);

var label = d3
  .arc()
  .outerRadius(radius)
  .innerRadius(radius - 80);

d3.csv('data/browseruse.csv')
  .then(function (data) {
    var arc = g.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');
    arc
      .append('path')
      .attr('d', path)
      .attr('fill', function (d) {
        return color(d.data.browser);
      });

    arc
      .append('text')
      .attr('transform', function (d) {
        return 'translate(' + label.centroid(d) + ')';
      })
      .text(function (d) {
        return d.data.browser;
      });

    svg
      .append('g')
      .attr('transform', `translate(${width / 2 - 100},${titleHeight})`)
      .append('text')
      .text('Browser usage statistics')
      .attr('class', 'title');
  })
  .catch(function (error) {
    console.error(error);
  });
