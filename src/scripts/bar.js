import * as d3 from 'd3';
import '../style.css';

var svg = d3.select('body').append('svg').attr('width', 600).attr('height', 500);
var margin = 200;
var width = svg.attr('width') - margin;
var height = svg.attr('height') - margin;

var xScale = d3.scaleBand().range([0, width]).padding(0.4);
var yScale = d3.scaleLinear().range([height, 0]);

var g = svg.append('g').attr('transform', 'translate(100,100)');

d3.csv('data/users.csv')
  .then(function (data) {
    xScale.domain(
      data.map(function (d) {
        return d.year;
      })
    );
    yScale.domain([
      0,
      d3.max(data, function (d) {
        return d.value;
      })
    ]);

    g.append('g')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('y', height - 250)
      .attr('x', width - 100)
      .attr('font-size', '16px')
      .attr('text-anchor', 'end')
      .attr('stroke', 'black')
      //.attr('fill', 'black')
      .text('Year');

    g.append('g')
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat(function (d) {
            return '$' + d;
          })
          .ticks(10)
      )
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '-5.1em')
      .attr('font-size', '16px')
      .attr('text-anchor', 'end')
      .attr('stroke', 'black')
      .text('Stock Price');

    g.selectAll('bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) {
        return xScale(d.year);
      })
      .attr('y', function (d) {
        return yScale(d.value);
      })
      .attr('width', xScale.bandwidth())
      .attr('height', function (d) {
        return height - yScale(d.value);
      })
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut);

    svg
      .append('text')
      .attr('transform', 'translate(100,0)')
      .attr('x', 150)
      .attr('y', 50)
      .attr('font-size', '24px')
      .text('Stock Price Analysis');
  })
  .catch(function (error) {
    console.error(error);
  });

function onMouseOver(d, i) {
  d3.select(this).attr('class', 'highlight');

  d3.select(this)
    .transition()
    .duration(400)
    .attr('width', xScale.bandwidth() + 5)
    .attr('y', function (d) {
      return yScale(d.value) - 10;
    })
    .attr('height', function (d) {
      return height - yScale(d.value) + 10;
    });
}

function onMouseOut(d, i) {
  d3.select(this).attr('class', 'bar');
  d3.select(this)
    .transition() // adds animation
    .duration(400)
    .attr('width', xScale.bandwidth())
    .attr('y', function (d) {
      return yScale(d.value);
    })
    .attr('height', function (d) {
      return height - yScale(d.value);
    });

  // d3.selectAll('.val').remove();
}
