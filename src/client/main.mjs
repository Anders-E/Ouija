import { Marker } from '/marker.mjs';
import { Vector2 } from '/vector2.mjs';

main();

function main() {
    /* EXAMPLE THREE JS */
    window.scene = new THREE.Scene();

    window.renderer = new THREE.WebGLRenderer({antialias:true});

    // window.addEventListener('wheel', mouseWheel, false);
    document.body.appendChild(renderer.domElement );

    window.clock = new THREE.Clock;

    initScene(scene, renderer);

    window.controls = new THREE.OrbitControls (camera);
    window.controls.update();

    window.socket = io();
};

// function init(renderer) {
//     window.addEventListener('resize', () => setCanvasSize(canvas), false);
//     setCanvasSize(canvas);
//     renderer.addEventListener('mousemove', setMousePosition, false);
//     renderer.addEventListener('mousedown', mouseDown, false);
//     renderer.addEventListener('mouseup', mouseUp, false);
//     renderer.addEventListener('wheel', mouseWheel, false);
//     // canvas.addEventListener('mouseleave', mouseUp, false);
//     window.mouse = new Vector2(0, 0);
//     window.mouseDown = false;
//     window.marker = new Marker(0, 0);
//     window.canvasPos = canvas.getBoundingClientRect();
// }

function initScene (scene, renderer) {
  renderer.setSize(window.innerWidth, window.innerHeight );
  renderer.setClearColor (new THREE.Color(1, 1, 1));

  //cameras
  window.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(0,5,7);
  window.minCameraPosition = new THREE.Vector3(0,0,0);
  window.maxCameraPosition = new THREE.Vector3(0, 5, 7);
  window.zoomFactor = 0.5;
  camera.lookAt(new THREE.Vector3(0,0,0));
  scene.add(camera);

  //light
  var ambientLight = new THREE.AmbientLight( 0xffffff, 10 ); // soft white light
  scene.add( ambientLight );

  var light = new THREE.PointLight(0xffffff, 5);
  light.position.set (-100, 200, 100);
  scene.add(light);

  //geometry
  var loader = new THREE.GLTFLoader();

  // Load a glTF resource
  loader.load(
  	// resource URL
  	'/res/board.glb',
  	// called when the resource is loaded
  	function ( gltf ) {

  		scene.add( gltf.scene );

  		// gltf.animations; // Array<THREE.AnimationClip>
  		gltf.scene; // THREE.Scene
  		// gltf.scenes; // Array<THREE.Scene>
  		// gltf.cameras; // Array<THREE.Camera>
  		gltf.asset; // Object

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
	requestAnimationFrame( animate );
  update(clock.getDelta ());

  window.controls.update();
	renderer.render(window.scene, window.camera);

}
animate();


function update(dt) {
    // marker.update(dt, mouse);
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
    window.mouse = new Vector2(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
}

function mouseWheel(e) {

  //move camera
  // camera.translateZ( e.deltaY * 0.01);
  zoomFactor = THREE.Math.clamp(zoomFactor + e.deltaY * 0.0001, 0, 1);
  var camPos = new THREE.Vector3(0,0,0);
  console.log(camera.position.x + " " + camera.position.y + " " + camera.position.z);

  // var tar = minCameraPosition, maxCameraPosition, zoomFactor);
  camera.position.lerp(window.minCameraPosition, window.maxCameraPosition, zoomFactor);
  // // camera.lookAt(new THREE.Vector3(0,0,0));
  // console.log(camera.position.x + " " + camera.position.y + " " + camera.position.z);
}

function mouseDown(e) {
    window.mouseDown = true;
}

function mouseUp(e) {
    window.mouseDown = false;
}
