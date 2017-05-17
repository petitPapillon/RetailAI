window.onload = function () {

  var dataSource = "data/retail-data.json";
  d3.json(dataSource, function (error, data) {
    var container = "chart-left";
    var width = document.getElementById(container).parentElement.clientWidth * 0.75;
    var height = width;
    var options = new Options({
      height: height,
      width: width,
      padding_left: 0,
      padding_top: 0,
      container: container,
      data: data,
      property: "profit"
    });
    var donut = new DonutChart(options);
    donut.draw();


  });

};