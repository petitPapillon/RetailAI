window.onload = function () {

  var margin = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 30
    },
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom + 10;

  var y = d3.scaleLinear()
    .domain([-50, 50])
    .range([height - 20, 0]);

  var xDomain = [];
  for (var i = 0; i <= 50; i++) {
    xDomain.push(i);
  }
  var x = d3.scaleBand()
    .domain(xDomain)
    .range([width, 0]);

  var xAxisScale = d3.scaleLinear()
    .domain([50, 0])
    .range([0, width]);

  var xAxis = d3.axisBottom(xAxisScale).ticks(3);

  var xTopAxis = d3.axisTop(xAxisScale).ticks(3);

  var yAxis = d3.axisLeft(y);

  var svg = d3.select("#bar-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  d3.json("data/retail-data.json", function (error, data) {

    data.forEach(function (d) {
      var predictedData = d['sales'].predicted;
      var actualData = d['sales'].actual;
      var largestDeviationIdx = getLargetDeviaton(predictedData, actualData);
      d.deviation = actualData[largestDeviationIdx] - predictedData[largestDeviationIdx];
    });

    var horizontalGridData = y.ticks(11) // exclude the zero

    // set the horizontal Grid Lines -> binding with the data
    var horizontalGridLines = svg
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
    horizontalGridLines = svg
      .selectAll("line.horizontal-grid");

    horizontalGridLines
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", function (d) {
        return y(d) + 15;
      })
      .attr("y2", function (d) {
        return y(d) + 15;
      })
      .attr("fill", "none")
      .attr("shape-rendering", "crispEdges")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", "2,2");

    var verticalGridData = [-5, 20, 40, 50];

    // set the vertical Grid Lines -> binding with the data
    var verticalGridLines = svg
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
    verticalGridLines = svg
      .selectAll("line.vertical-grid");

    verticalGridLines
      .attr("x1", function (d) {
        return x(d) ;
      })
      .attr("x2", function (d) {
        return x(d);
      })
      .attr("y1", 15)
      .attr("y2", height - 5)
      .attr("fill", "none")
      .attr("shape-rendering", "crispEdges")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", "2,2");

    svg.selectAll(asClass("bar"))
      .data(data)
      .enter().append("rect")
      .attr("class", function (d) {
        console.log('d');
        if (d.deviation < 0) {
          return "bar negative";
        } else {
          return "bar positive";
        }

      })
      .attr("data-yr", function (d, i) {
        return d.productName;
      })
      .attr("data-c", function (d) {
        return d.deviation;
      })
      .attr("title", function (d) {
        return (d.productName + ": " + d.deviation + " °C")
      })
      .attr("y", function (d) {

        if (d.deviation > 0) {
          return y(d.deviation) + 15;
        } else {
          return y(0) + 15;
        }

      })
      .attr("x", function (d, i) {
        return x(Math.abs(d.deviation));
      })
      .attr("width", 5)
      .attr("height", function (d) {
        return Math.abs(y(d.deviation) - y(0));
      })
      .on("mouseover", function (d) {
        d3.select("#_yr")
          .text("Product: " + d.productName);
        d3.select("#degrree")
          .text(d.deviation + "%");
      });

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-5, 15)")
      .call(yAxis);

    // svg.append("g")
    //   .attr("class", "y axis")
    //   .append("text")
    //   .text("°deviation")
    //   .attr("transform", "translate(15, 40), rotate(-90)")

    svg.append("g")
      .attr("class", "X axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "X axis")
      .attr("transform", "translate(0,8)")
      .call(xTopAxis);

    svg.append("g")
      .attr("class", "x axis")
      .append("line")
      .attr("y1", y(0) + 15)
      .attr("y2", y(0) + 15)
      .attr("x2", width);

    // svg.append("g")
    //   .attr("class", "infowin")
    //   .attr("transform", "translate(50, 5)")
    //   .append("text")
    //   .attr("id", "_yr");
    //
    // svg.append("g")
    //   .attr("class", "infowin")
    //   .attr("transform", "translate(250, 5)")
    //   .append("text")
    //   .attr("id", "degrree");

  });
}();