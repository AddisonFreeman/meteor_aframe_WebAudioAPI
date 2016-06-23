var panner, cam, ice;

AFRAME.registerComponent('audio', {
	schema: {type: 'vec3' },
	init: function() {
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
	     //player.connect(audioContext.destination);
	     player.start(0); 
	   });
	  };
	  request.send();
	
	  //HRTF Panner
	  hrtfContainer = new HRTFContainer();
	  hrtfContainer.loadHrir("http://localhost:3000/kemar_L.bin");
	  window.panner = new HRTFPanner(audioContext, player, hrtfContainer);
	  window.panner.connect(audioContext.destination);  
	  window.panner.update(90,0);
	  cam = document.querySelector("#mainCamera");
		console.log(panner);
			  ice = document.querySelector("#iceberg");
	    
	},
	tick: function() {
		window.panner.update(90,10);
	
// 		window.panner.update( (Math.atan2(iceberg.getAttribute('position').z - cam.getAttribute('position').z,(iceberg.getAttribute('position').x - cam.getAttribute('position').x) ) * (180 / Math.PI) - 90),0);
	    
// 	    ice.setAttribute('position', (cam.getAttribute('position').x+10)+' 0 '+ cam.getAttribute('position').z+10);
	}
});


AFRAME.registerComponent('FOA', {
	schema: {type: 'vec3' },
	init: function() {
   	  var AudioContext = window.AudioContext || window.webkitAudioContext;
	  var audioContext = new AudioContext();
	  var player = audioContext.createBufferSource();
	  // ---------------------------- local request file 
	  var request = new XMLHttpRequest();
	  request.open('GET', 'http://localhost:3000/04_Rhodes.wav', true);
	  request.responseType = 'arraybuffer';
	  request.onload = function () {
	   var undecodedAudio = request.response;
	   audioContext.decodeAudioData(undecodedAudio).then(function(decodedData) {
	     player.buffer = decodedData;
	     player.loop = true;
	     //player.connect(audioContext.destination);
	     player.start(0); 
	   });
	  };
	  request.send();
	      
	      	    
	},
	tick: function() {
		
		
		
		
	}
});

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
  cam = document.querySelector("#mainCamera");
  iceberg = document.querySelector("#iceberg");

  peer.on('connection', function (conn) {
    console.log("you're connected!"+conn);
    conn.on('open', function() {
      conn.on('data', function(data) {
        iceberg.setAttribute('position', data);
      });
    });  
  });


  
  //check if B above A on z-axis
  // (iceberg.getAttribute('position').z - cam.getAttribute('position').z) > 0 

  // && (iceberg.getAttribute('position').x - cam.getAttribute('position').x) > 0


/*

  updPos = function () {
    panner.update((Math.atan2(iceberg.getAttribute('position').z - cam.getAttribute('position').z,((iceberg.getAttribute('position').x - cam.getAttribute('position').x)))) * (180 / Math.PI) - 90,0);
    console.log("updated sound");
    setTimeout(updPos(), 1000); 
  }
*/
  

//   setTimeout(updPos(), 1000);

  // function iceberg() {
  //   iceberg.setAttribute('position', (cam.getAttribute('position').x + 10+' '+cam.getAttribute('position').y+' '+cam.getAttribute('position').z));
  // }
  
  
  
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
