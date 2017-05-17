function Tooltip(owner) {
  var __ = this;
  __.owner = owner;
  var $$ = __.owner;

  __.createTooltip = function (data) {
    var predictedData = data ? data['sales'].predicted : $$.data['sales'].predicted;
    var actualData = data ? data['sales'].actual : $$.data['sales'].actual;
    var dates = data ? data['sales'].dates : $$.data['sales'].dates;
    var largestDeviationIdx = getLargetDeviaton(predictedData, actualData);

    var tooltipHtml = function () {
      var innerHtml = "<table>";
      innerHtml += "<tr>" + "<td><img style='width: 50px;height: 50px;' src='data/Screenshot_1.png' /></td><td>"
        + (data ? data.productName : $$.data.productName) + "</td></tr>";
      innerHtml += "<tr>" + "<td><span>Actual</span> $" + actualData[largestDeviationIdx]
        + "</td> <td><span>Planned</span> $" +
        predictedData[largestDeviationIdx];
      +"</td></tr>";
      innerHtml += "<tr>" + "<td><span>Deviation</span></td> <td>" +
        (actualData[largestDeviationIdx] - predictedData[largestDeviationIdx])
        + "%</td></tr>";
      innerHtml += "</table>";
      return innerHtml;
    };

    $$.tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset((data ? [100, 100] : [500, 500]))
      .html(tooltipHtml);

  };
  
  __.updateTooltip = function () {
    var tooltipHtml = function () {
      var innerHtml = "<table>";
      innerHtml += "<tr>" + "<td><img style='width: 50px;height: 50px;' src='data/Screenshot_1.png' /></td><td>"
        + $$.data.productName + "</td></tr>";
      innerHtml += "<tr>" + "<td><span>Actual</span> $" + actualData[largestDeviationIdx]
        + "</td> <td><span>Planned</span> $" +
        predictedData[largestDeviationIdx];
      +"</td></tr>";
      innerHtml += "<tr>" + "<td><span>Deviation</span></td> <td>" +
        (actualData[largestDeviationIdx] - predictedData[largestDeviationIdx])
        + "%</td></tr>";
      innerHtml += "</table>";
      return innerHtml;
    };

    $$.tip.html(tooltipHtml);
  }

};