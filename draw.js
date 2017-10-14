/*
  description:
    Random generate equally likely possibility frequence numbers

  params:
    maxtimes:1000
    probs:3

  returns:
    [
      times:[1,2,3,5,8,13...], // fab
      counters:[
        0:[10,...,333], // length = 20
        1:[15,...,333],
        2:[25,...,334]
      ]
    ]
*/
function rand_freq(maxtimes, probs) {
  freq = {};
  freq.times = [1];
  // compose Fibonacci sequence
  for (i = 2; i < maxtimes; i = freq.times[freq.times.length - 2] + freq.times[freq.times.length - 1]) {
    freq.times.push(i);
  }

  if (freq.times[freq.times.length - 1] != maxtimes) {
    freq.times.push(maxtimes);
  }

  freq.counters = [];
  for (i = 0; i < freq.times.length; i++) {
    freq.counters[i] = [];
  }

  slices_index = 0;

  // initialize each counter
  for (i = 0; i < probs; i++) {
    freq.counters[0][i] = 0;
  }

  for (i = 0; i < maxtimes; i++) {
    r = Math.floor(Math.random() * probs); // random nubmer between 0 ~ probs
    freq.counters[slices_index][r]++;

    if (i + 1 == freq.times[slices_index] && slices_index + 1 < freq.times.length) {
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
  }
  return freq;
}

function drawbychartist() {
  var options = {
    width: 1000,
    height: 500,
    low: 0,
    showLine: true,
    showPoint: false,
    // lineSmooth: false,
  };

  max_times = parseInt(document.getElementById("times").value);
  if (isNaN(max_times)) {
    alert("Experiment times are not integer!");
    return;
  }

  max_probs = -1;
  radios = document.getElementsByName("probs-types");
  for (i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      max_probs = parseInt(radios[i].value);
    }
  }

  if (max_probs == -1 || isNaN(max_probs)) {
    alert("Please select an experiment(dice, coin, ball)");
    return;
  }


  freq = rand_freq(max_times, max_probs);
  probs = [];
  refprobs = []
  for (i = 0; i < freq.times.length; i++) {
    probs[i] = freq.counters[i][0] / freq.times[i];
    refprobs[i] = 1.0 / max_probs;
  }

  var chart = new Chartist.Line('.ct-chart', {
    labels: freq.times,
    series: [refprobs, probs]
  }, options);
  duration = 1000;
  seq = 0;

  chart.on('created', function() {
    seq = 0;
  });

  chart.on('draw', function(data) {

    if (data.type == 'point' || data.type == 'line') {
      console.log(data);
      data.element.animate({
        opacity: {
          begin: seq++ * duration,
          dur: duration,
          from: 0,
          to: 1,
        },
      });

      var paths = document.querySelectorAll('path');
      for (i = 0; i < paths.length; i++){
        path = paths[i];
        var length = path.getTotalLength();
        // Clear any previous transition
        path.style.transition = path.style.WebkitTransition =
          'none';
        // Set up the starting positions
        path.style.strokeDasharray = length + ' ' + length;
        path.style.strokeDashoffset = length;
        // Trigger a layout so styles are calculated & the browser
        // picks up the starting position before animating
        path.getBoundingClientRect();
        // Define our transition
        if (i == 0){
          path.style.transition = path.style.WebkitTransition =
            'stroke-dashoffset 0.1s ease-in-out';
        }else {
          path.style.transition = path.style.WebkitTransition =
            'stroke-dashoffset 8s ease-in-out';
        }

        // Go!
        path.style.strokeDashoffset = '0';
      }
    }
  });
}
