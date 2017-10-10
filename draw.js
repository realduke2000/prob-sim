function draw1() {
  var options = {
    width: 800,
    height: 1000,
    low: 0,
    showLine: false
  };

  var chart = new Chartist.Line('.ct-chart', {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    series: [
      [3, 4, 2, 8, 5, 4, 6, 2, 3, 3, 4, 6],
      // [4, 8, 9, 3, 7, 2, 10, 5, 8, 1, 7, 10]
    ]
  }, options);
  duration = 500;
  seq = 0;

  chart.on('created', function() {
    seq = 0;
  });

  chart.on('draw', function(data) {
    if (data.type == 'point') {
      data.element.animate({
        opacity: {
          begin: seq++ * duration,
          dur: duration,
          from: 0,
          to: 1
        }
      });
    }
  });
}
