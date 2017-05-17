function asClass(className) {
  return "." + className;
}

function asId(id) {
  return "#" + id;
}

function getLargetDeviaton(ds1, ds2) {
  var maximum = 0;
  var position = 0;
  for (var i = 0; i < ds1.length; i++) {
    if (Math.abs(ds1[i] - ds2[i]) > maximum) {
      maximum = Math.abs(ds1[i] - ds2[i]);
      position = i;
    }
  }
  return position;
}