$ = jQuery;
Template.peer.onCreated(function () {

  window.peer = new Peer({
    key: 'npgldigfyu3gcik9',
    debug: 3,
    config: {'iceServers': [
      { url: 'stun:stun.l.google.com:19302' },
      { url: 'stun:stun1.l.google.com:19302' },
    ]}
  });
  peer.on('open', function () {
    console.log(peer.id);
  });


});

window.onload = function() {
  var cam = document.querySelector("#mainCamera");
  var iceberg = document.querySelector("#iceberg");

  // function iceberg() {
  //   iceberg.setAttribute('position', (cam.getAttribute('position').x + 10+' '+cam.getAttribute('position').y+' '+cam.getAttribute('position').z));
  // }

  peer.on('connection', function (conn) {
    console.log("you're connected!"+conn);
    conn.on('open', function() {
      conn.on('data', function(data) {
        iceberg.setAttribute('position', data);
      });
    });  
  });




  // ----------------- Audio Things
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext = new AudioContext();
  // var playerBuffer = audioContext.createBuffer(2, 200, audioContext.sampleRate);
  var player = audioContext.createBufferSource();
  // player.buffer = playerBuffer;

  // ---------------------------- local request file 
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:3000/04_Rhodes.wav', true);
  request.responseType = 'arraybuffer';
  request.onload = function () {
   var undecodedAudio = request.response;
   audioContext.decodeAudioData(undecodedAudio).then(function(decodedData) {
     player.buffer = decodedData;
     player.loop = true;
  //      player.connect(audioContext.destination);
     // binauralPanner.connectInputByIndex(0, player);
     player.start(0); 
   });
  };
  request.send();

  //HRTF Panner
  var hrtfContainer = new HRTFContainer();
  hrtfContainer.loadHrir("./kemar_L.bin");
  var panner = new HRTFPanner(audioContext, player, hrtfContainer);
  panner.connect(audioContext.destination);  
  // panner.update(0,0);
  // setTimeout(function () {
  //   panner.update(10,0);
  //   console.log(10);
  // },500);
  //   setTimeout(function () {
  //   panner.update(20,0);
  //   console.log(20);
  // },500);
  // setTimeout(function () {
  //   panner.update(30,0);
  //   console.log(30);
  // },500);
  // setTimeout(function () {
  //   panner.update(40,0);
  //   console.log(40);
  // },500);
  // setTimeout(panner.update(50,0),500);
  // setTimeout(panner.update(60,0),500);
  // setTimeout(panner.update(70,0),500);
  // setTimeout(panner.update(80,0),500);
  // setTimeout(panner.update(90,0),500);
  // setTimeout(panner.update(100,0),500);
  // setTimeout(panner.update(90,0),500);
  // setTimeout(panner.update(80,0),500);
  // setTimeout(panner.update(70,0),500);
  // setTimeout(panner.update(60,0),500);
  // setTimeout(panner.update(50,0),500);
  // setTimeout(panner.update(40,0),500);
  // setTimeout(panner.update(30,0),500);
  // setTimeout(panner.update(20,0),500);
  // setTimeout(panner.update(10,0),500);
  // setTimeout(panner.update(0,0),500);
  // setTimeout(panner.update(-10,0),500);
  // setTimeout(panner.update(-20,0),500);
  // setTimeout(panner.update(-30,0),500);
  // setTimeout(panner.update(-40,0),500);
  // setTimeout(panner.update(-50,0),500);
  // setTimeout(panner.update(-60,0),500);
  // setTimeout(panner.update(-70,0),500);
  // setTimeout(panner.update(-80,0),500);
  // setTimeout(panner.update(-90,0),500);
  // setTimeout(panner.update(-100,0),500);
  
  




};




//https://www.smashingmagazine.com/2016/06/make-music-in-the-browser-with-a-web-audio-theremin/
// });
