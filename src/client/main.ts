import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import io from 'socket.io-client';

import { Vector2 } from './vector2';
import { EventSystem, Event } from './eventSystem';

function mouseDown(e: MouseEvent) {
    window.mouseDown = true;
}

function mouseUp(e: MouseEvent) {
    window.mouseDown = false;
}

function enterLoadingScreen() {
    unfade(document.getElementById('loading-screen'));

    //TODO: Match-making; Currently only setting up renderer
    window.scene = new THREE.Scene();

    window.renderer = new THREE.WebGLRenderer({ antialias: true });

    initScene(window.scene, window.renderer);
    // initUI(renderer);
    initSounds();

    window.accelerateDistance = 1;
    window.accelerateSpeed = 0.5;

    //TODO: Call start session when session has been found instead
    setTimeout(function() {
        startSession();
    }, 5000);
}

function startSession() {
    document.body.appendChild(window.renderer.domElement);
    $(window.renderer.domElement).hide();
    window.eventSystem = new EventSystem();
    window.eventSystem.addEvent(
        new Event(() => {
            window.lightningLight.intensity = 100;
            window.lightningAudioLoader.load('res/lightning.mp3', (buffer: any) => {
                window.LightningSound.setBuffer(buffer);
                window.LightningSound.setLoop(false);
                window.LightningSound.setVolume(0.1);
                window.LightningSound.play();
            });
        }, 0.001)
    );

    window.addEventListener('mousemove', setMousePosition, false);
    window.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, true);

    animate();

    //Slight delay before fading out the loading screen
    setTimeout(function() {
        fade(document.getElementById('loading-screen'));
        unfade(window.renderer.domElement);
    }, 1000);
}

//duration in ms
function showMessage(message: string, duration: number) {
    window.eventText.innerHTML = message;
    unfade(window.eventText);
    setTimeout(function() {
        fade(window.eventText);
    }, duration * 1000);
}

function fade(element: HTMLElement) {
    $(element).fadeOut(1000);
}

function unfade(element: HTMLElement) {
    $(element).fadeIn(1000);
}

function endSession() {
    //TODO: Do something here, perhaps transition back to main menu
}

function initScene(scene: any, renderer: any) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color('#050a0f'));

    //cameras
    window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    window.camera.position.set(0, 5, 7);
    window.camera.rotation.set(-90, 0, 0);
    window.minCameraPosition = new THREE.Vector3(0, 0, 0);
    window.maxCameraPosition = new THREE.Vector3(0, 5, 7);
    window.zoomFactor = 0.5;
    // camera.lookAt(new THREE.Vector3(0,0,0));

    scene.add(window.camera);

    window.clock = new THREE.Clock();

    window.mixer = new THREE.AnimationMixer();

    //light
    // let ambientLight = new THREE.AmbientLight( 0xffffff, 1000); // soft white light
    // scene.add( ambientLight );

    let light = new THREE.PointLight(0x66b2ff, 3);
    light.position.set(0, 2, 0);

    scene.add(light);

    window.lightningLight = new THREE.PointLight(0x66b2ff, 0);
    window.lightningLight.position.set(3, 5, 12);
    window.lightningLight.castShadow = true;
    window.lightningLight.shadow.mapSize.width = 1024 * 4;
    window.lightningLight.shadow.mapSize.height = 1024 * 4;

    scene.add(window.lightningLight);

    //geometry
    let loader = new GLTFLoader();

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
                    window.socket.on('connect', () => {
                        console.log('connected to server');
                        console.log(window.socket);

                        window.socket.on('game_marker_pos', (pos: Vector2) => {
                            window.marker.position.set(pos.x, 0, pos.y);
                        });

                        window.socket.on('playerJoined', (id: string) => {
                            console.log('Player ' + id + ' connected');
                            onPlayerJoined();
                        });

                        window.socket.on('playerLeft', (id: string) => {
                            console.log('Player ' + id + ' left');
                            onPlayerLeft();
                        });
                    });
                }
            });
            window.clips = gltf.animations;
            window.mixer = new THREE.AnimationMixer(window.camera);
            let action = window.mixer.clipAction(THREE.AnimationClip.findByName(window.clips, 'Action.002'));
            action.timeScale = 2; // add this
            window.mixer.addEventListener('finished', function(e) {
                unfade(document.getElementById('game'));
            }); //

            action.setLoop(THREE.LoopOnce, 1);
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

function initSounds() {
    window.audioListener = new THREE.AudioListener();

    window.ambientSound = new THREE.Audio(audioListener);
    window.audioLoader = new THREE.AudioLoader();
    window.audioLoader.load('res/393808__pfranzen__windy-creaky-old-house-ambience.ogg', (buffer) => {
        window.ambientSound.setBuffer(buffer);
        window.ambientSound.setLoop(false);
        window.ambientSound.setVolume(0.05);
        window.ambientSound.play();
    });

    window.effectSound = new THREE.Audio(audioListener);
    window.audioLoader.load('res/excited horror sound.wav', (buffer) => {
        window.effectSound.setBuffer(buffer);
        window.effectSound.setLoop(false);
    });

    window.lightningListener = new THREE.AudioListener();
    window.LightningSound = new THREE.Audio(window.lightningListener);
    window.lightningAudioLoader = new THREE.AudioLoader();
}

function setMousePosition(e) {
    window.mouse = new Vector2((e.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
}

function main() {
    /* EXAMPLE THREE JS */

    //TODO: Add buttons here
    window.findSessionButton = document.getElementById('findSession');
    window.mainMenu = document.getElementById('menu');
    window.loadingScreen = document.getElementById('loading-screen');
    window.gameUI = document.getElementById('game');
    window.eventText = document.getElementById('eventText');

    $(window.loadingScreen).hide();
    $(window.gameUI).hide();
    $(window.eventText).hide();

    window.findSessionButton.addEventListener('click', () => {
        fade(document.getElementById('menu'));
        enterLoadingScreen();
    });
}

function update() {
    //events
    let rand = THREE.Math.randFloat(0.0, 1.0);
    window.eventSystem.getEvents().forEach((event: Event) => {
        if (rand > event.getRate()) {
            // console.log(event.getRate());
        }

        if (rand <= event.getRate()) {
            event.getFunction()();
        }
    });
    if (window.mouseDown) {
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(window.mouse, window.camera);
        let intersects: any[] = [];
        window.boardCollider.raycast(raycaster, intersects);
        if (intersects.length > 0) {
            let point = intersects[0].point;

            //emit point to Server
            window.socket.emit('player_marker_pos', new Vector2(point.x, point.z));
        }
    }
}

function onPlayerJoined() {
    window.effectSound.play();
    showMessage('It feels as though someone is watching you...', 5);
}

function onPlayerLeft() {
    showMessage('The tension somehow feels lighter...', 5);
}

function animate() {
    let delta = window.clock.getDelta();
    update();
    window.mixer.update(delta);

    window.camera.lookAt(new THREE.Vector3(0, 0, 0));

    window.lightningLight.intensity = THREE.Math.clamp(window.lightningLight.intensity - delta * 200, 0, 100);

    //if using orbit controls, update each frame
    // window.controls.update();

    window.renderer.render(window.scene, window.camera);
    requestAnimationFrame(animate);
}

main();
