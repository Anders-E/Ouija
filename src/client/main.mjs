import { Marker } from '/marker.mjs';
import { Vector2 } from '/vector2.mjs';
import {EventSystem, Event} from '/Events.mjs';

main();

function main() {
    /* EXAMPLE THREE JS */
    window.scene = new THREE.Scene();

    window.renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    // window.addEventListener('wheel', mouseWheel, false);
    document.body.appendChild(renderer.domElement );

    window.clock = new THREE.Clock;

    initScene(scene, renderer);

    window.lightningListener = new THREE.AudioListener();
    window.LightningSound = new THREE.Audio(lightningListener);
    window.lightningAudioLoader = new THREE.AudioLoader();

    window.eventSystem = new EventSystem ();
    window.eventSystem.addEvent(new Event(function () {
      console.log("hehe bög!!!!");
      window.lightningLight.intensity = 100;

      window.lightningAudioLoader.load('res/lightning.mp3', function (buffer) {
        LightningSound.setBuffer(buffer)
        LightningSound.setLoop(false);
        LightningSound.setVolume(0.5);
        LightningSound.play();
      });
    }, 0.001));



    window.accelerateDistance = 1;
    window.accelerateSpeed = 0.5;

    window.addEventListener('mousemove', setMousePosition, false);
    window.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, true);

    window.socket = io();
};

function initScene (scene, renderer) {
  renderer.setSize(window.innerWidth, window.innerHeight );
  renderer.setClearColor (new THREE.Color(0.02, 0.04, 0.06));

  //cameras
  window.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0,5,7);
  camera.rotation.set(-90, 0, 0);
  window.minCameraPosition = new THREE.Vector3(0,0,0);
  window.maxCameraPosition = new THREE.Vector3(0, 5, 7);
  window.zoomFactor = 0.5;
  // camera.lookAt(new THREE.Vector3(0,0,0));

  scene.add(camera);

  window.mixer = new THREE.AnimationMixer ();

  //light
  // var ambientLight = new THREE.AmbientLight( 0xffffff, 1000); // soft white light
  // scene.add( ambientLight );

  var light = new THREE.PointLight(0x66b2ff, 3);
  light.position.set(0, 2, 0);

  scene.add(light);

  window.lightningLight = new THREE.PointLight(0x66b2ff, 0);
  lightningLight.position.set(3, 5, 12);
  lightningLight.castShadow = true;
  lightningLight.shadow.mapSize.width = 1024 * 4;
  lightningLight.shadow.mapSize.height = 1024 * 4;

  scene.add(lightningLight);

  //geometry
  var loader = new THREE.GLTFLoader();

  // Load a glTF resource
  loader.load(
  	// resource URL
  	'/res/board.glb',
  	// called when the resource is loaded
  	function ( gltf ) {


  		gltf.animations; // Array<THREE.AnimationClip>
  		gltf.scene; // THREE.Scene

      //activate shadows for objects in scene
      gltf.scene.traverse( (node) => {
        if ( node instanceof THREE.Mesh ) {
          node.castShadow = true;
          node.receiveShadow = true;

          console.log(node.name);
          if(node.name == "BoardCollider") {
            window.boardCollider = node;
            window.boardCollider.visible = false;
          }

          if(node.name == "Marker") {
            window.marker = node;
          }
         }

    } );
      window.clips = gltf.animations;
      window.mixer = new THREE.AnimationMixer (camera);
      var action = mixer.clipAction(THREE.AnimationClip.findByName(window.clips, 'Action.002'));
      action.timeScale = 5 ; // add this

      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.play();
      // gltf.scenes; // Array<THREE.Scene>
  		// gltf.cameras; // Array<THREE.Camera>
  		gltf.asset; // Object

      gltf.scene.castShadow = true;
      gltf.scene.receiveShadow = true;

      // window.boardCollider = scene.getObjectByName("Board001");
      // console.log(window.boardCollider);
      scene.add( gltf.scene);
  	},
  	// called while loading is progressing
  	function ( xhr ) {
  		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  	},
  	// called when loading has errors
  	function ( error ) {
  		console.log( 'An error happened' );
  	}
  );
}

function animate() {
  var delta = clock.getDelta();
  update(delta);
  window.mixer.update(delta);

  camera.lookAt(new THREE.Vector3(0,0,0));
  // if(window.marker != null) {
  //   var pos = new THREE.Vector3(0,0,0);
  //   pos.copy(window.marker.position);
  //   pos = pos.multiplyScalar(0.1);
  //   pos.x = 0;
  //   camera.lookAt(pos);
  // }

  window.lightningLight.intensity = THREE.Math.clamp(window.lightningLight.intensity - delta * 200, 0, 100);


  //if using orbit controls, update each frame
  // window.controls.update();
	renderer.render(window.scene, window.camera);
  requestAnimationFrame( animate );
}
animate();


function update(dt) {
    //events
    var rand = THREE.Math.randFloat(0.0, 1.0);
    window.eventSystem.getEvents().forEach(function(event) {
      // console.log(rand);
      if(rand > event.getRate()) {
        // console.log(event.getRate());
      }

      if(rand <= event.getRate()) {
        event.getFunction()();
      }
    });
    // marker.update(dt, mouse);
    if(window.mouseDown) {
      var raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(window.mouse, window.camera);
      var intersects = [];
      window.boardCollider.raycast(raycaster, intersects);
      // var intersects = raycaster.intersectObject(window.boardCollider, false);
      if(intersects.length > 0) {
        var point = intersects[0].point;
        var epsilon = 0.00;
        var dist = point.distanceTo(window.marker.position);
        if(dist > epsilon) {
          var mouseDirectionVector = new THREE.Vector3(0.0,0.0,0.0);
          mouseDirectionVector.subVectors(point, window.marker.position);
          mouseDirectionVector.y = 0.0;
          // console.log(point);

          mouseDirectionVector.normalize ();
          window.marker.position.setY(0);
          window.marker.position.x += mouseDirectionVector.x * dt * Math.sqrt(0.5 * dist);
          window.marker.position.z += mouseDirectionVector.z * dt * Math.sqrt(0.5 * dist);
          // window.marker.translateOnAxis(mouseDirectionVector.normalize(), dt * -0.5);

        }
      }
    }
  // if(Inp)
}

function render(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // marker.render(ctx);
}

function setCanvasSize(canvas) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

function setMousePosition(e) {
    window.mouse = new Vector2((e.clientX/window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
}

function mouseWheel(e) {

  //zoom camera here
  zoomFactor = THREE.Math.clamp(zoomFactor + e.deltaY * 0.0001, 0, 1);
}

function mouseDown(e) {
    window.mouseDown = true;
}

function mouseUp(e) {
    window.mouseDown = false;
}
