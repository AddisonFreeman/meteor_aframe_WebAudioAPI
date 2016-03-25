Template.audio.onRendered(function () {
    var context = new AudioContext();
    //  oscillator = context.createOscillator();
    //  oscillator.connect(context.destination);
    //  oscillator.start(context.currentTime);
    //  oscillator.stop(context.currentTime = 2);
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:3000/thrust.wav', true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
      var undecodedAudio = request.response;
      context.decodeAudioData(undecodedAudio, function(buffer) {
        var sourceBuffer = context.createBufferSource();
        sourceBuffer.buffer = buffer;
        sourceBuffer.connect(context.destination);
        console.log(buffer);
        sourceBuffer.start(context.currentTime);
      });
    };
    request.send();
  })
