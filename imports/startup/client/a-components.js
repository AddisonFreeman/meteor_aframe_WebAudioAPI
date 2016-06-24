var panner, cam, ice, p2, pfetch, player2, pid, ray, peer, peers, connections, pSelectorId;


import { Meteor } from 'meteor/meteor';
import { Peers } from "../../api/peers/peers";

AFRAME.registerComponent('projectile', {
  schema: {
    speed: { default: -0.4 }
  },

  tick: function () {
    this.el.object3D.translateY(this.data.speed);
  }
});

AFRAME.registerComponent('collider', {
  schema: {
    target: { default: '' }
  },

  /**
   * Calculate targets.
   */
  init: function () {
    var targetEls = this.el.sceneEl.querySelectorAll(this.data.target);
    this.targets = [];
    for (var i = 0; i < targetEls.length; i++) {
      this.targets.push(targetEls[i].object3D);
    }
    this.el.object3D.updateMatrixWorld();
  },

  /**
   * Check for collisions (for cylinder).
   */
  tick: function (t) {
    var collisionResults;
    var directionVector;
    var el = this.el;
    var sceneEl = el.sceneEl;
    var mesh = el.getObject3D('mesh');
    var object3D = el.object3D;
    var raycaster;
    var vertices = mesh.geometry.vertices;
    var bottomVertex = vertices[0].clone();
    var topVertex = vertices[vertices.length - 1].clone();

    // Calculate absolute positions of start and end of entity.
    bottomVertex.applyMatrix4(object3D.matrixWorld);
    topVertex.applyMatrix4(object3D.matrixWorld);

    // Direction vector from start to end of entity.
    directionVector = topVertex.clone().sub(bottomVertex).normalize();

    // Raycast for collision.
    raycaster = new THREE.Raycaster(bottomVertex, directionVector, 1);
    collisionResults = raycaster.intersectObjects(this.targets, true);
    collisionResults.forEach(function (target) {
      // Tell collided entity about the collision.
      target.object.el.emit('collider-hit', {target: el});
    });
  }
});

AFRAME.registerComponent('spawner', {
  schema: {
    on: { default: 'click' },
    mixin: { default: '' }
  },

  /**
   * Add event listener to entity that when emitted, spawns the entity.
   */
  update: function (oldData) {
    this.el.addEventListener(this.data.on, this.spawn.bind(this));
  },

  /**
   * Spawn new entity with a mixin of componnets at the entity's current position.
   */
  spawn: function () {
    var el = this.el;
    var entity = document.createElement('a-entity');
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotation = el.getAttribute('rotation');
    var entityRotation;

    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);

    // Have the spawned entity face the same direction as the entity.
    // Allow the entity to further modify the inherited rotation.
    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);
    entity.setAttribute('mixin', this.data.mixin);
    entity.addEventListener('loaded', function () {
      entityRotation = entity.getComputedAttribute('rotation');
      entity.setAttribute('rotation', {
        x: entityRotation.x + rotation.x,
        y: entityRotation.y + rotation.y,
        z: entityRotation.z + rotation.z
      });
    });
    el.sceneEl.appendChild(entity);
  }
});

AFRAME.registerComponent('click-listener', {
  // When the window is clicked, emit a click event from the entity.
  init: function () {
    var el = this.el;
    window.addEventListener('click', function () {
      el.emit('click', null, false);
    });
  }
});




AFRAME.registerComponent('positionalAudio', {
	dependencies: ['raycaster'],
	schema: {type: 'vec3' },
	init: function() {
	  // -----------raycaster	
	  this.raycaster = this.el.components.raycaster;
	  ray = this.raycaster;
	  cam = document.querySelector("#mainCamera");
	  ice = document.querySelector("#iceberg");
	  player2 = document.querySelector("#player2");
	  
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
	  panner = new HRTFPanner(audioContext, player, hrtfContainer);
	  panner.connect(audioContext.destination);  
	  
	},
	tick: function() {
// 		console.log("atan(BA).toDegree: "+ (Math.atan2(ice.getAttribute('position').z - cam.getAttribute('position').z , ice.getAttribute('position').x - cam.getAttribute('position').x ) )* (180 / Math.PI) +" sightAngle: "+(Math.atan2(  ray.raycaster.ray.direction.z  ,  ray.raycaster.ray.direction.x   )* (180 / Math.PI) - 90));
// 		console.log("ABangle: "+Math.atan2(ice.getAttribute('position').z - cam.getAttribute('position').z,(ice.getAttribute('position').x - cam.getAttribute('position').x ) * (180 / Math.PI) - 90)+" sightAngle: "+(Math.atan2(  ray.raycaster.ray.direction.z  ,  ray.raycaster.ray.direction.x   )* (180 / Math.PI) - 90));
// 		console.log( Math.atan2(ice.getAttribute('position').z - cam.getAttribute('position').z,(ice.getAttribute('position').x - cam.getAttribute('position').x ) * (180 / Math.PI)) - (Math.atan2(  ray.raycaster.ray.direction.z  ,  ray.raycaster.ray.direction.x   )* (180 / Math.PI)) + 45);
		
		panner.update(Math.atan2(ice.getAttribute('position').z - cam.getAttribute('position').z,(ice.getAttribute('position').x - cam.getAttribute('position').x ) * (180 / Math.PI)) - (Math.atan2(  ray.raycaster.ray.direction.z  ,  ray.raycaster.ray.direction.x   )* (180 / Math.PI)) + 45,0);	
		// 	console.log(Math.atan2(ice.getAttribute('position').z - cam.getAttribute('position').z,(ice.getAttribute('position').x - cam.getAttribute('position').x ) * (180 / Math.PI) - 90) - (Math.atan2(  ray.raycaster.ray.direction.z  ,  ray.raycaster.ray.direction.x   )* (180 / Math.PI) - 90));	
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



AFRAME.registerComponent('peer', {
	schema: {type: 'int', default: 2 },
	init: function() {
	    cam = document.querySelector("#mainCamera");
		ice = document.querySelector("#iceberg");
		player2 = document.querySelector("#player2");
				
		connections = [];

/*
		var vowels = [1,5,9,15,21];
		var one = Math.floor(Math.random()*10);
		var three = Math.floor(Math.random()*10);
		one = ($.inArray(one,vowels) != -1) ? one-1 : one;
		three = ($.inArray(three,vowels) != -1) ? three-1 : three;
		one = (one === three) ? one+2 : one;  
		var pid = String.fromCharCode(97+ one)+''+String.fromCharCode(vowels[Math.floor(Math.random()*vowels.length)]+96)+''+String.fromCharCode(97+ three);
*/

		Meteor.subscribe('peers', () => {
 			peers = Peers.find().fetch();

/*
			peers.forEach((obj) => {
		        Peers.remove(obj._id);
		   	});
		});
*/
			pSelectorId = this.el.id;
			console.log(pSelectorId);

			console.log('current peers: '+Peers.find().fetch());		

  			peer = new Peer(Peers.constructorParams);

 			peer.on('open', () => {
	 			var pid = peer.id;	 			   	
	 			console.log('My pid: '+pid);
				
				Peers.insert({
					pid
				}, (err, res) => {
					if(!err) {	
						console.log("added "+pid+" to Peers | current peers: "+Peers.find().fetch());    
			    	} else {
					    console.log(pid+' not added current peers: | '+Peers.find().fetch());
						console.log(err);
			    	}
				});

				var pcursor = Peers.find();


				pcursor.observeChanges({ 
					added: function (objAddedId) {
						pfetch = pcursor.fetch(objAddedId);
						console.log('obsv');
						console.log(pfetch);
 						pfetch.forEach((otherPeer) => {
							if(otherPeer.pid!=pid) {
								connections.push(peer.connect(otherPeer.pid));
								console.log('obsv changes: pid2:'+otherPeer.pid+' pid:'+pid);
							}
						});
					}
				});
 			});


			peer.on('connection', function (conn) {
// 			  console.log("you're connected! | "+conn);
			  conn.on('open', function() {
			    conn.on('data', function(data) {
				    console.log('i gots data'+pSelectorId);
				    document.querySelector("#"+pSelectorId).setAttribute('position', data);
			    });
			  });		
			});   	

		});



	},//end init
	tick: function() {
// 		console.log(connections); 
		connections.forEach( (c) => {
			console.log('sending');
			c.send(cam.getAttribute('position'));
		});
	}
});


//https://www.smashingmagazine.com/2016/06/make-music-in-the-browser-with-a-web-audio-theremin/

