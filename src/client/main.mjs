import { Vector2 } from './vector2.mjs';
import { EventSystem, Event } from './eventSystem.mjs';

function mouseDown(e) {
    window.mouseDown = true;
}

function mouseUp(e) {
    window.mouseDown = false;
}

function initScene(scene, renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0.02, 0.04, 0.06));

    //cameras
    window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 7);
    camera.rotation.set(-90, 0, 0);
    window.minCameraPosition = new THREE.Vector3(0, 0, 0);
    window.maxCameraPosition = new THREE.Vector3(0, 5, 7);
    window.zoomFactor = 0.5;
    // camera.lookAt(new THREE.Vector3(0,0,0));

    scene.add(camera);

    window.mixer = new THREE.AnimationMixer();

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
        function(gltf) {
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Scene

            //activate shadows for objects in scene
            gltf.scene.traverse(node => {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;

                    if (node.name == 'BoardCollider') {
                        window.boardCollider = node;
                        window.boardCollider.visible = false;
                    }

                    if (node.name == 'Marker') {
                        window.marker = node;

                        //socket setup
                        window.socket = io();
                        socket.on('connect', () => {
                          console.log('connected to server');
                          console.log(socket);

                          socket.on('game_marker_pos', pos => {
                              window.marker.position.set(pos.x, 0, pos.y);
                            });
                        });
                    }
                }
            });
            window.clips = gltf.animations;
            window.mixer = new THREE.AnimationMixer(camera);
            var action = mixer.clipAction(THREE.AnimationClip.findByName(window.clips, 'Action.002'));
            action.timeScale = 5; // add this

            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
            // gltf.scenes; // Array<THREE.Scene>
            // gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

            gltf.scene.castShadow = true;
            gltf.scene.receiveShadow = true;

            scene.add(gltf.scene);
        },
        // called while loading is progressing
        function(xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        // called when loading has errors
        function(error) {
            console.log('An error happened');
        }
    );
}

function main() {
    /* EXAMPLE THREE JS */
    window.scene = new THREE.Scene();

    window.renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    //TODO: Zoom?
    // window.addEventListener('wheel', mouseWheel, false)
    ;
    document.body.appendChild(renderer.domElement);

    window.clock = new THREE.Clock();

    initScene(scene, renderer);

    initSounds();

    window.lightningListener = new THREE.AudioListener();
    window.LightningSound = new THREE.Audio(lightningListener);
    window.lightningAudioLoader = new THREE.AudioLoader();

    window.eventSystem = new EventSystem();
    window.eventSystem.addEvent(
        new Event(() => {
            window.lightningLight.intensity = 100;
            window.lightningAudioLoader.load('res/lightning.mp3', buffer => {
                LightningSound.setBuffer(buffer);
                LightningSound.setLoop(false);
                LightningSound.setVolume(0.1);
                LightningSound.play();
            });
        }, 0.001)
    );

    window.accelerateDistance = 1;
    window.accelerateSpeed = 0.5;

    window.addEventListener('mousemove', setMousePosition, false);
    window.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, true);
}

function initSounds() {
    window.ambientListener = new THREE.AudioListener();
    window.ambientSound = new THREE.Audio(ambientListener);
    window.ambientAudioLoader = new THREE.AudioLoader();
    window.ambientAudioLoader.load('res/393808__pfranzen__windy-creaky-old-house-ambience.ogg', function(buffer) {
        ambientSound.setBuffer(buffer);
        ambientSound.setLoop(false);
        ambientSound.setVolume(0.05);
        ambientSound.play();
    });
}

function animate() {
    var delta = clock.getDelta();
    update(delta);
    window.mixer.update(delta);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    window.lightningLight.intensity = THREE.Math.clamp(window.lightningLight.intensity - delta * 200, 0, 100);

    //if using orbit controls, update each frame
    // window.controls.update();

    renderer.render(window.scene, window.camera);
    requestAnimationFrame(animate);
}

function update(dt) {
    //events
    var rand = THREE.Math.randFloat(0.0, 1.0);
    window.eventSystem.getEvents().forEach(event => {
        if (rand > event.getRate()) {
            // console.log(event.getRate());
        }

        if (rand <= event.getRate()) {
            event.getFunction()();
        }
    });
    if (window.mouseDown) {
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(window.mouse, window.camera);
        var intersects = [];
        window.boardCollider.raycast(raycaster, intersects);
        // var intersects = raycaster.intersectObject(window.boardCollider, false);
        if (intersects.length > 0) {
            var point = intersects[0].point;

            //emit point to Server
            window.socket.emit('player_marker_pos', new Vector2(point.x, point.z));
            console.log(point.x + ";" + point.y + ";" + point.z);
        }
    }
}

function setMousePosition(e) {
    window.mouse = new Vector2((e.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
}

main();
animate();
