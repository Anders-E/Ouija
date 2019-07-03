import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import io from 'socket.io-client';
import $ from 'jquery';

import { Vector2 } from './vector2';
import { EventSystem, Event } from './eventSystem';

/*** GLOBALS ***/
let renderer: THREE.Renderer;
let mDown: boolean;
let scene: THREE.Scene;
let lightningLight: THREE.PointLight;
let lightningAudioLoader: THREE.AudioLoader;
let lightningSound: THREE.Audio;
let eventSystem: EventSystem
let eventText: HTMLElement;
let camera: THREE.PerspectiveCamera
let clock: THREE.Clock;
let mixer: THREE.AnimationMixer;
let boardCollider: THREE.Object3D;
let marker: THREE.Object3D;
let socket: SocketIOClient.Socket;
let effectSound: THREE.Audio;
let mouse: Vector2;

function mouseDown(e: MouseEvent) {
    mDown = true;
}

function mouseUp(e: MouseEvent) {
    mDown = false;
}

function enterLoadingScreen() {
    unfade(document.getElementById('loading-screen'));

    //TODO: Match-making; Currently only setting up renderer
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });

    initScene(scene, renderer);
    initSounds();

    //TODO: Call start session when session has been found instead
    setTimeout(function() {
        startSession();
    }, 5000);
}

function startSession() {
    document.body.appendChild(renderer.domElement);
    $(renderer.domElement).hide();
    eventSystem = new EventSystem();
    eventSystem.addEvent(
        new Event(() => {
            lightningLight.intensity = 100;
            lightningAudioLoader.load('res/lightning.mp3', (buffer: any) => {
                lightningSound.setBuffer(buffer);
                lightningSound.setLoop(false);
                lightningSound.setVolume(0.1);
                lightningSound.play();
            }, () => {},() => {}); // TODO: Add onProgress and onError functions: https://threejs.org/docs/#api/en/loaders/AudioLoader
        }, 0.001)
    );

    window.addEventListener('mousemove', setMousePosition, false);
    window.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, true);

    animate();

    //Slight delay before fading out the loading screen
    setTimeout(function() {
        fade(document.getElementById('loading-screen'));
        unfade(renderer.domElement);
    }, 1000);
}

//duration in ms
function showMessage(message: string, duration: number) {
    eventText.innerHTML = message;
    unfade(eventText);
    setTimeout(function() {
        fade(eventText);
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
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 7);
    camera.rotation.set(-90, 0, 0);
    
    scene.add(camera);

    clock = new THREE.Clock();

    mixer = new THREE.AnimationMixer(camera);

    //light
    // let ambientLight = new THREE.AmbientLight( 0xffffff, 1000); // soft white light
    // scene.add( ambientLight );

    let light = new THREE.PointLight(0x66b2ff, 3);
    light.position.set(0, 2, 0);

    scene.add(light);

    lightningLight = new THREE.PointLight(0x66b2ff, 0);
    lightningLight.position.set(3, 5, 12);
    lightningLight.castShadow = true;
    lightningLight.shadow.mapSize.width = 1024 * 4;
    lightningLight.shadow.mapSize.height = 1024 * 4;

    scene.add(lightningLight);

    //geometry
    let loader = new GLTFLoader();

    // Load a glTF resource
    loader.load(
        // resource URL
        '/res/board.glb',
        // called when the resource is loaded
        (gltf) => {
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Scene

            //activate shadows for objects in scene
            gltf.scene.traverse(node => {
                node.castShadow = true;
                node.receiveShadow = true;

                if (node.name == 'BoardCollider') {
                    boardCollider = node;
                    boardCollider.visible = false;
                }

                if (node.name == 'Marker') {
                    marker = node;

                    //socket setup
                    socket = io();
                    socket.on('connect', () => {
                        console.log('connected to server');
                        console.log(socket);

                        socket.on('game_marker_pos', (pos: Vector2) => {
                            marker.position.set(pos.x, 0, pos.y);
                        });

                        socket.on('playerJoined', (id: string) => {
                            console.log('Player ' + id + ' connected');
                            onPlayerJoined();
                        });

                        socket.on('playerLeft', (id: string) => {
                            console.log('Player ' + id + ' left');
                            onPlayerLeft();
                        });
                    });
                }
            });
            const clips: THREE.AnimationClip[] = gltf.animations;
            mixer = new THREE.AnimationMixer(camera);
            const action = mixer.clipAction(THREE.AnimationClip.findByName(clips, 'Action.002'));
            action.timeScale = 2; // add this
            mixer.addEventListener('finished', function(e) {
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
    const audioListener = new THREE.AudioListener();

    const ambientSound = new THREE.Audio(audioListener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('res/393808__pfranzen__windy-creaky-old-house-ambience.ogg', (buffer: THREE.AudioBuffer) => {
        ambientSound.setBuffer(buffer);
        ambientSound.setLoop(false);
        ambientSound.setVolume(0.05);
        ambientSound.play();
    }, () => {}, () => {}); // TODO: Add onProgress and onError functions: https://threejs.org/docs/#api/en/loaders/AudioLoader

    effectSound = new THREE.Audio(audioListener);
    audioLoader.load('res/excited horror sound.wav', (buffer: THREE.AudioBuffer) => {
        effectSound.setBuffer(buffer);
        effectSound.setLoop(false);
    }, () => {}, () => {}); // TODO: Add onProgress and onError functions: https://threejs.org/docs/#api/en/loaders/AudioLoader

    const lightningListener = new THREE.AudioListener();
    lightningSound = new THREE.Audio(lightningListener);
    lightningAudioLoader = new THREE.AudioLoader();
}

function setMousePosition(e: MouseEvent) {
    mouse = new Vector2((e.clientX / window.innerWidth) * 2 - 1, - (e.clientY / window.innerHeight) * 2 + 1);
}

function main() {
    /* EXAMPLE THREE JS */

    //TODO: Add buttons here
    const findSessionButton = document.getElementById('findSession');
    const mainMenu = document.getElementById('menu');
    const loadingScreen = document.getElementById('loading-screen');
    const gameUI = document.getElementById('game');
    eventText = document.getElementById('eventText');

    $(loadingScreen).hide();
    $(gameUI).hide();
    $(eventText).hide();

    findSessionButton.addEventListener('click', () => {
        fade(document.getElementById('menu'));
        enterLoadingScreen();
    });
}

function update() {
    //events
    const rand = THREE.Math.randFloat(0.0, 1.0);
    eventSystem.getEvents().forEach((event: Event) => {
        if (rand > event.getRate()) {
            // console.log(event.getRate());
        }

        if (rand <= event.getRate()) {
            event.getFunction()();
        }
    });
    if (mDown) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects: any[] = [];
        boardCollider.raycast(raycaster, intersects);
        if (intersects.length > 0) {
            const point = intersects[0].point;

            //emit point to Server
            socket.emit('player_marker_pos', new Vector2(point.x, point.z));
        }
    }
}

function onPlayerJoined() {
    effectSound.play();
    showMessage('It feels as though someone is watching you...', 5);
}

function onPlayerLeft() {
    showMessage('The tension somehow feels lighter...', 5);
}

function animate() {
    let delta = clock.getDelta();
    update();
    mixer.update(delta);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    lightningLight.intensity = THREE.Math.clamp(lightningLight.intensity - delta * 200, 0, 100);

    //if using orbit controls, update each frame
    // window.controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

main();
