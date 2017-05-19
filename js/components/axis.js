function Axis(owner, data, xAxisData, yAxisData, type) { //TODO define types of data
  var $$ = owner;
  var __ = this;
  $$.xDomain = data[xAxisData];
  $$.yDomain = [];

  $$.xScale = d3.scaleBand()
    .domain($$.xDomain)
    .range([0, $$.width]);

  $$.yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([$$.height, 0]);

  __.draw = function () {
    $$.xAxis = d3.select(asClass('line-chart'))
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + $$.height + 5 + ")")
      .call(d3.axisBottom($$.xScale))
      .selectAll('.tick')
      .selectAll('line').remove();

    $$.yAxis = d3.select(asClass('line-chart'))
      .append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(0, 0)")
      .call(d3.axisLeft($$.yScale))
      .selectAll('.tick')
      .selectAll('line').remove();

    __.drawGird();
  };

  __.drawGird = function () {

    // method to calculate x position
    var x = function (d) {
      return $$.xScale(d) + $$.xScale.bandwidth() / 2;
    };

    // method calculate y position
    var y = function (d) {
      return $$.yScale(d);
    };

    var horizontalGridData = $$.yScale.ticks(10).slice(1); // exclude the zero

    // set the horizontal Grid Lines -> binding with the data
    var horizontalGridLines = d3.select(asClass('line-chart'))
      .selectAll("line.horizontal-grid")
      .data(horizontalGridData);

    horizontalGridLines
      .enter()
      .append("line")
      .attr("class", "horizontal-grid");
    // exclude the unnecessary lines
    horizontalGridLines
      .exit()
      .remove();

    // important after update of the data -> select the current lines
    horizontalGridLines = d3.select(asClass('line-chart'))
      .selectAll("line.horizontal-grid");

    horizontalGridLines
      .attr("x1", 5)
      .attr("x2", $$.width)
      .attr("y1", y)
      .attr("y2", y)
      .attr("fill", "none")
      .attr("shape-rendering", "crispEdges")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", "2,2");

    var verticalGridData = $$.xDomain;

    // set the vertical Grid Lines -> binding with the data
    var verticalGridLines = d3.select(asClass('line-chart'))
      .selectAll("line.vertical-grid")
      .data(verticalGridData);

    verticalGridLines
      .enter()
      .append("line")
      .attr("class", "vertical-grid");
    // exclude the unnecessary lines
    verticalGridLines
      .exit()
      .remove();

    // important after update of the data -> select the current lines
    verticalGridLines = d3.select(asClass('line-chart'))
      .selectAll("line.vertical-grid");

    verticalGridLines
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", 0)
      .attr("y2", $$.height - 5)
      .attr("fill", "none")
      .attr("shape-rendering", "crispEdges")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", "2,2");
  };
};