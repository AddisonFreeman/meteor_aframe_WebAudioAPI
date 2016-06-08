Template.audio.onRendered(function () {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  var sourceNode = context.createBufferSource();
  var on = false;

  $ = jQuery;
  var box = $(".box");

  console.log(box);
  console.log(sourceNode);

  var osc = context.createOscillator();
  var real = new Float32Array([0,0.1,1,1,1,1,0.3,0.7,0.6,0.5,0,0.8]);
  var imag = new Float32Array(real.length);
  var wave = context.createPeriodicWave(real, imag);
  osc.setPeriodicWave(wave);
  osc.frequency.value = 60;
  osc.connect(context.destination);
  osc.start(context.currentTime);
  $(document.body).click(function (e) {
    osc.frequency.value = 600;
  });


  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:3000/thrust.wav', true);
  request.responseType = 'arraybuffer';
  request.onload = function () {
    var undecodedAudio = request.response;
    sourceNode.buffer = context.decodeAudioData(undecodedAudio).then(function(decodedData) {
      sourceNode.buffer = decodedData;
      sourceNode.connect(context.destination);
      sourceNode.loop = true;
      //sourceNode.start(context.currentTime);
    });
  };
  request.send();
  });
