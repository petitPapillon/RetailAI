function LineChart(options) {
  var $$ = this;
  $$.options = options;
  $$.container = $$.options.container;
  $$.width = $$.options.width;
  $$.height = $$.options.height;
  $$.data = $$.options.data;
  $$.xAxisHeight = 15;
  $$.yAxisWidth = 15;
  $$.padding_left = $$.options.padding_left;
  $$.padding_top = $$.options.padding_top;
  $$.property = $$.options.property;

  $$.width = $$.width - $$.yAxisWidth * 2 - $$.padding_left;
  $$.height = $$.height - $$.xAxisHeight;

  $$.mainContainer = d3.select(asId($$.container))
    .attr("width", $$.width + $$.yAxisWidth)
    .attr("height", $$.height + $$.xAxisHeight)
    .attr("transform", "translate(5, 0)");

  $$.width -= $$.padding_left;
  $$.height -= $$.padding_top;
  var translateLeft = $$.yAxisWidth;
  var translateTop = $$.padding_top / 2;

  $$.tooltip = new Tooltip($$);
  $$.tooltip.createTooltip();
  $$.svg = $$.mainContainer
    .append('g')
    .attr('class', 'line-chart')
    .attr("width", $$.width)
    .attr("height", $$.height)
    .attr("transform", "translate(" + translateLeft + "," + translateTop + ")");

  $$.axis = new Axis($$, $$.data['sales'], 'dates', ['actual', 'predicted']);
  $$.axis.draw();

  $$.updateData = function (data) {
    $$.data = data;
    // $$.tooltip.updateTooltip();
    $$.draw();
  };

  $$.draw = function () {

    $$.xOffset = $$.xScale.bandwidth() / 2;
    var line = d3.line()
      .x(function (d, i) {
        return $$.xScale($$.data['sales'].dates[i]);
      })
      .y(function (d) {
        return $$.yScale(d);
      });

    var predictedData = $$.data['sales'].predicted;
    var actualData = $$.data['sales'].actual;
    var dates = $$.data['sales'].dates;

    var actualLine =
      d3.select(asClass("line-chart"))
        .selectAll(asClass('actual-line'))
        .data([actualData]);
    actualLine
      .enter()
      .append("path")
      .attr("class", "line actual-line");
    actualLine
      .exit()
      .remove();

    actualLine =
      d3.select(asClass("line-chart"))
        .selectAll(asClass('actual-line'));

    actualLine
      .attr("d", line)
      .attr('transform', 'translate(' + $$.xOffset + ",0)")
      .style('stroke', $$.options.colors.mainColor);

    var predictedLine =
      d3.select(asClass("line-chart"))
        .selectAll(asClass("predicted-line"))
        .data([predictedData]);

    predictedLine
      .enter()
      .append('path')
      .attr("class", "line-dash predicted-line");

    predictedLine
      .exit()
      .remove();

    predictedLine =
      d3.select(asClass("line-chart"))
        .selectAll(asClass("predicted-line"));

    predictedLine
        .attr("d", line)
        .attr('transform', 'translate(' + $$.xOffset + ",0)")
        .style('stroke', $$.options.colors.mainColor);

    var actualCircles = d3.select(asClass("line-chart"))
      .selectAll('.circle-actual')
      .data(actualData);

    actualCircles
      .enter()
      .append('circle')
      .attr('class', 'circle-actual');

    actualCircles
      .exit()
      .remove();

    actualCircles = d3.select(asClass("line-chart"))
      .selectAll('.circle-actual');

    actualCircles
      .attr("cx", function (d, i) {
        return $$.xScale(dates[i]) + $$.xOffset;
      })
      .attr("cy", function (d) {
        return $$.yScale(d);
      })
      .attr("r", "2px")
      .style('stroke', $$.options.colors.mainColor);

    var predictedCircles = d3.select(asClass("line-chart"))
      .selectAll('.circle-predicted')
      .data(predictedData);
    predictedCircles
      .enter()
      .append('circle')
      .attr('class', 'circle-predicted');

    predictedCircles
      .exit()
      .remove();

    predictedCircles = d3.select(asClass("line-chart"))
      .selectAll('.circle-predicted');

    predictedCircles
      .attr("cx", function (d, i) {
        return $$.xScale(dates[i]) + $$.xOffset;
      })
      .attr("cy", function (d) {
        return $$.yScale(d);
      })
      .attr("r", "2px")
      .style('stroke', $$.options.colors.mainColor);

    $$.drawLargestDeviation();
    $$.svg.call($$.tip);
    $$.tip.show();

  };

  $$.drawLargestDeviation = function () {
    var predictedData = $$.data['sales'].predicted;
    var actualData = $$.data['sales'].actual;
    var dates = $$.data['sales'].dates;

    var largestDeviationIdx = getLargetDeviaton(predictedData, actualData);
    $$.largestDevIdx = largestDeviationIdx;
    var deviationLineData = [{
      x1: $$.xScale(dates[largestDeviationIdx]) + $$.xOffset,
      x2: $$.xScale(dates[largestDeviationIdx]) + $$.xOffset,
      y1: $$.yScale(actualData[largestDeviationIdx]),
      y2: $$.yScale(predictedData[largestDeviationIdx])
    }];

    var deviationLine = $$.svg
      .selectAll("line.deviation-line")
      .data(deviationLineData);

    deviationLine
      .enter()
      .append("line")
      .attr("class", "deviation-line");
    // exclude the deviation line
    deviationLine
      .exit()
      .remove();

    // important after update of the data -> select everything that didn't enter the enter section
    deviationLine = $$.svg
      .selectAll("line.deviation-line");

    deviationLine
      .attr("x1", function (d) {
        return d.x1
      })
      .attr("x2", function (d) {
        return d.x2;
      })
      .attr("y1", function (d) {
        return d.y1
      })
      .attr("y2", function (d) {
        return d.y2;
      })
      .style('stroke', $$.options.colors.mainColor)
      .attr("stroke-width", "3px");

  };
}