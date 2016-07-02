var panner, cam, ice, p2, pfetch, player2, pid, ray, peer, users, peers, connections, pSelectorId;


import { Meteor } from 'meteor/meteor';
import { Peers } from "../../api/peers/peers";
import { Users } from "../../api/users/users";

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

AFRAME.registerComponent('growBombListener', {
  // When the window is clicked, emit a click event from the entity.
  init: function () {
    var el = this.el;
    window.addEventListener('mousedown', function () {
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
		
// 		panner.update(Math.atan2(player2.getAttribute('position').z - cam.getAttribute('position').z,(player2.getAttribute('position').x - cam.getAttribute('position').x ) * (180 / Math.PI)) - (Math.atan2(  ray.raycaster.ray.direction.z  ,  ray.raycaster.ray.direction.x   )* (180 / Math.PI)) + 45,0);	
// 			console.log(Math.atan2(player2.getAttribute('position').z - cam.getAttribute('position').z,(player2.getAttribute('position').x - cam.getAttribute('position').x ) * (180 / Math.PI) - 90) - (Math.atan2(  ray.raycaster.ray.direction.z  ,  ray.raycaster.ray.direction.x   )* (180 / Math.PI) - 90));	
	}
});

/*
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
*/

AFRAME.registerComponent('user', {
	init: () => {
		connections = [];
		cam = document.querySelector("#mainCamera");
		player2 = document.querySelector("#player2");
		Meteor.subscribe('users', () => {
			users = Users.find().fetch();
			console.log(users);
 		   //  users.forEach((obj) => {
		    //     Users.remove(obj._id);
		   	// });
			user = new Peer(Users.constructorParams);
			user.on('open', () => {
				//connect to other users when they join
 				var camPID = user.id;
 				console.log("My pid is: "+camPID.substr(0,3));
 				Users.insert({
		 			pid: camPID,
		 			pos: "0 0 0",
				}, (err, res) => {
			 		if(!err) {
		 			} else {
				 		console.log("camPID: "+camPID+" not added to Users Collection");
				 		console.log(err);
		 			}
 				});		
 				Users.find().observeChanges({
	 				added: (id,otherUser) => {	
	 					console.log(otherUser.pid.substr(0,3));
		 				if(otherUser.pid!=camPID) {
		 					console.log("uAddedPID");
	 						console.log(otherUser.pid.substr(0,3));
					 		connections.push(user.connect(otherUser.pid));
		 				}
	 				}
 				});
			    console.log(Users.find().fetch());
				user.on('connection', function (conn) {
				    conn.on('open', function() {
				  	    console.log("peer "+conn.peer.substr(0,3)+" added");
					    conn.on('data', function(data) {
				    	    console.log(data);
				       	    console.log(player2);
				       	    document.querySelector("#player2").setAttribute('position', data);
				        });
				    });	
				
		    	});		 
			});
		});
	},
	tick: function() {
		connections.forEach( (c) => {
			c.send(cam.getAttribute('position'));
		});
	}
});

//https://www.smashingmagazine.com/2016/06/make-music-in-the-browser-with-a-web-audio-theremin/

