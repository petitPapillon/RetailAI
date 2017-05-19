function DonutChart(options) {

  var $$ = this;
  $$.options = options;
  $$.container = $$.options.container;
  $$.width = $$.options.width;
  $$.height = $$.options.height;
  $$.allData = $$.options.data;
  $$.radius = $$.width / 2;
  $$._innerRadius = $$.radius - 60;
  $$._outerRadius = $$.radius - 10;
  $$.property = $$.options.property;
  $$.data = $$.allData[0];


  $$.draw = function () {
    var onElementFocused = function (d, i) {
      d3.selectAll(asClass("arc")).classed('hovered', true);
      d3.select(this).classed('hovered', false);
      var arr = d3.arc()
        .outerRadius($$._outerRadius + 2)
        .innerRadius($$._innerRadius - 2);

      d3.select(this)
        .select('path')
        .attr('d', arr);
      $$.data = $$.allData[i];
      $$.onMouseOver($$.data);
      $$.updateInnerInfo();
    };

    var onElementOut = function (d) {
      d3.selectAll(asClass("arc")).classed('hovered', false);
      d3.select(this)
        .select('path')
        .attr('d', $$.arc);
      document.getElementById('donut-info').parentNode.removeChild(document.getElementById('donut-info'));
    };

    $$.arc = d3.arc()
      .outerRadius($$._outerRadius)
      .innerRadius($$._innerRadius);

    var pie = d3.pie()
      .sort(null)
      .value(function (d) {
        return d[$$.property]
      });

    d3.select(asId($$.container))
      .attr("transform", "translate(" + $$.width * 0.15 + "," + 0 + ")");
    $$.svgChart = d3.select(asId($$.container))
      .attr("width", $$.width)
      .attr("height", $$.height)
      .append("g")
      .attr("transform", "translate(" + $$.width * 0.5 + "," + $$.height / 2 + ")");

    $$.arcs = $$.svgChart.selectAll(asClass("arc"))
      .data(pie($$.allData))
      .enter()
      .append("g")
      .attr("class", "arc");

    $$.arcs
      .exit()
      .remove();
    $$.arcs = $$.svgChart.selectAll(asClass("arc"));
    $$.arcs.append("path")
      .attr("d", $$.arc)
      .style("fill", $$.options.colors.mainColor);
    $$.arcs
      .on('mouseover', onElementFocused)
      .on('mouseout', onElementOut);

  };

  $$.updateData = function () {

  };

  $$.changeData = function () {

  };

  $$.updateInnerInfo = function () {
    var predictedData =  $$.data['sales'].predicted;
    var actualData = $$.data['sales'].actual;
    var dates =  $$.data['sales'].dates;
    var largestDeviationIdx = getLargetDeviaton(predictedData, actualData);

    var innerHtml = "<table>";
    innerHtml += "<tr><td colspan='2' style='text-align: center'> <span>Total Sales</span><p><b>$"+ $$.data.profit+"</b></p></td></tr>"
    innerHtml += "<tr>" + "<td><img style='width: 50px;height: 50px;' src='data/Screenshot_1.png' /></td><td><b>"
      + $$.data.productName + "</b></td></tr>";
    innerHtml += "<tr>" + "<td  colspan='2' style='text-align: center'><span>Contribution</span></td></tr>";
    innerHtml += "<tr>" + "<td><p><b>%" + $$.data.actualContribution
      + "</b></p><span>Actual</span> </td> <td><p><b>%" +
      $$.data.plannedContribution +"</b></p> <span>Planned</span> </td></tr>";
    innerHtml += "</table>";

    // innerHtml = "<div><span>Total Sales</span><p>$" + $$.data.profit + "</p></div>"
    // innerHtml += "<img style='width: 50px;height: 50px;' src='data/Screenshot_1.png' />" + $$
    var div = document.getElementById('donut-info') || document.createElement('div');
    div.setAttribute('id', 'donut-info');
    div.innerHTML = innerHtml;
    document.getElementById($$.container).parentNode.appendChild(div);
  };

  $$.onMouseOver = function (data) {
    var container = "chart-right";
    var width = document.getElementById(container).parentElement.clientWidth;
    var height = width * 0.6;
    var options = new Options({
      height: height,
      width: width,
      padding_left: 10,
      padding_top: 10,
      container: container,
      data: data
    });
    $$.lineChart = $$.lineChart || new LineChart(options);
    $$.lineChart.updateData(data);
  };
}