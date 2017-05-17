function Options(settings) {

  this.colors = settings.colors || {
    mainColor: "#522f94",
    positiveDeviationColor: "#00FF80",
    negativeDeviationColor: "#ff1155"
  };


  this.width = settings.width;
  this.height = settings.height;
  this.container = settings.container;
  this.padding_left = settings.padding_left;
  this.padding_top = settings.padding_top;
  this.property = settings.property;
  this.data = settings.data;
}