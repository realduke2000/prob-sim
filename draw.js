/*
  description:
    Random generate equally likely possibility frequence numbers

  params:
    maxtimes:1000
    steps:20
    probs:3

  returns:
    [
      times:[50,100,150,...,1000],
      counters:[
        0:[10,...,333], // length = 20
        1:[15,...,333],
        2:[25,...,334]
      ]
    ]
*/
function rand_freq(maxtimes, slices, probs) {
  interval = Math.floor(maxtimes / slices);
  freq = {};
  freq.times = [];
  freq.counters = [];
  for (i = 0; i < slices; i++) {
    freq.counters[i] = [];
    freq.times[i] = (i + 1) * interval;
  }

  slices_index = 0;

  // initialize each counter
  for (i = 0; i < probs; i++) {
    freq.counters[0][i] = 0;
  }

  for (i = 0; i < maxtimes; i++) {
    if (i == freq.times[slices_index]) {
      // all counters step up, accumulate with previous counter
      for (j = 0; j < probs; j++) {
        try {
          freq.counters[slices_index + 1][j] = freq.counters[slices_index][j];
        } catch (e) {
          console.log("i=" + i, ",j=" + j + ",slices_index=" + slices_index);
          throw e;
        } finally {

        }

      }
      slices_index++;
    }

    r = Math.floor(Math.random() * probs); // random nubmer between 0 ~ probs
    freq.counters[slices_index][r]++;
  }
  return freq;
}

function drawbychartjs() {
  var ctx = document.getElementById("myChart").getContext('2d');
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });
}

function drawbychartist() {
  var options = {
    width: 1000,
    height: 500,
    low: 0,
    showLine: true,
  };
  MAX_TIMES = 1000;
  SLICES = 25;
  PROBS = 6;
  freq = rand_freq(MAX_TIMES, SLICES, PROBS);
  probs = [];
  refprobs = []
  for (i = 0; i < SLICES; i++) {
    probs[i] = freq.counters[i][0] / freq.times[i];
    refprobs[i] = 1.0 / PROBS;
  }

  var chart = new Chartist.Line('.ct-chart', {
    labels: freq.times,
    series: [probs, refprobs]
  }, options);
  duration = 100;
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
