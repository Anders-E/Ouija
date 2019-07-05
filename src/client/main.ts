import * as THREE from 'three';
import $ from 'jquery';
import io from 'socket.io-client';

import { EventSystem, Event } from './eventSystem';
import { OuijaScene } from './ouijaScene';
import { Network } from './network';

/*** GLOBALS ***/
let ouijaScene: OuijaScene;
let network: Network;
let mDown: boolean;
let lightningLight: THREE.PointLight;
let lightningAudioLoader: THREE.AudioLoader;
let lightningSound: THREE.Audio;
let eventSystem: EventSystem;
let eventText: HTMLElement;
let effectSound: THREE.Audio;
let mouse: THREE.Vector2;

function mouseDown(e: MouseEvent): void {
    mDown = true;
}

function mouseUp(e: MouseEvent): void {
    mDown = false;
}

function setMousePosition(e: MouseEvent): void {
    mouse = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
}

function update(): void {
    //events
    // const rand = THREE.Math.randFloat(0.0, 1.0);
    // eventSystem.getEvents().forEach(
    //     (event: Event): void => {
    //         if (rand > event.getRate()) {
    //             // console.log(event.getRate());
    //         }

    //         if (rand <= event.getRate()) {
    //             event.getFunction()();
    //         }
    //     }
    // );
    if (mDown) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, ouijaScene.getCamera());
        const intersects: THREE.Intersection[] = [];
        ouijaScene.getBoardCollider().raycast(raycaster, intersects);
        if (intersects.length > 0) {
            const point = intersects[0].point;

            //emit point to Server
            network.getSocket().emit('player_marker_pos', new THREE.Vector2(point.x, point.z));
        }
    }
    ouijaScene.setMarkerPosition(network.getMarkerPosition());
}

function animate(): void {
    let delta = ouijaScene.getClock().getDelta();
    update();
    ouijaScene.getMixer().update(delta);

    ouijaScene.getCamera().lookAt(new THREE.Vector3(0, 0, 0));

    // lightningLight.intensity = THREE.Math.clamp(lightningLight.intensity - delta * 200, 0, 100);

    ouijaScene.getRenderer().render(ouijaScene.getScene(), ouijaScene.getCamera());
    requestAnimationFrame(animate);
}

function fade(element: HTMLElement): void {
    $(element).fadeOut(1000);
}

function unfade(element: HTMLElement): void {
    $(element).fadeIn(1000);
}

function startSession(): void {
    document.body.appendChild(ouijaScene.getRenderer().domElement);
    $(ouijaScene.getRenderer().domElement).hide();
    // eventSystem = new EventSystem();
    // eventSystem.addEvent(
    //     new Event((): void => {
    //         lightningLight.intensity = 100;
    //         lightningAudioLoader.load(
    //             'res/lightning.mp3',
    //             (buffer: THREE.AudioBuffer): void => {
    //                 lightningSound.setBuffer(buffer);
    //                 lightningSound.setLoop(false);
    //                 lightningSound.setVolume(0.1);
    //                 lightningSound.play();
    //             },
    //             (): void => {},
    //             (): void => {}
    //         ); // TODO: Add onProgress and onError functions: https://threejs.org/docs/#api/en/loaders/AudioLoader
    //     }, 0.001)
    // );

    window.addEventListener('mousemove', setMousePosition, false);
    window.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, true);

    animate();

    //Slight delay before fading out the loading screen
    setTimeout((): void => {
        fade(document.getElementById('loading-screen'));
        unfade(ouijaScene.getRenderer().domElement);
    }, 1000);
}

//duration in ms
function showMessage(message: string, duration: number): void {
    eventText.innerHTML = message;
    unfade(eventText);
    setTimeout((): void => {
        fade(eventText);
    }, duration * 1000);
}

function onPlayerJoined(): void {
    effectSound.play();
    showMessage('It feels as though someone is watching you...', 5);
}

function onPlayerLeft(): void {
    showMessage('The tension somehow feels lighter...', 5);
}

function initSounds(): void {
    const audioListener = new THREE.AudioListener();

    const ambientSound = new THREE.Audio(audioListener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
        'res/393808__pfranzen__windy-creaky-old-house-ambience.ogg',
        (buffer: THREE.AudioBuffer): void => {
            ambientSound.setBuffer(buffer);
            ambientSound.setLoop(false);
            ambientSound.setVolume(0.05);
            ambientSound.play();
        },
        (): void => {},
        (): void => {}
    ); // TODO: Add onProgress and onError functions: https://threejs.org/docs/#api/en/loaders/AudioLoader

    effectSound = new THREE.Audio(audioListener);
    audioLoader.load(
        'res/excited horror sound.wav',
        (buffer: THREE.AudioBuffer): void => {
            effectSound.setBuffer(buffer);
            effectSound.setLoop(false);
        },
        (): void => {},
        (): void => {}
    ); // TODO: Add onProgress and onError functions: https://threejs.org/docs/#api/en/loaders/AudioLoader

    const lightningListener = new THREE.AudioListener();
    lightningSound = new THREE.Audio(lightningListener);
    lightningAudioLoader = new THREE.AudioLoader();
}

function enterLoadingScreen(): void {
    unfade(document.getElementById('loading-screen'));

    //TODO: Match-making; Currently only setting up renderer
    ouijaScene = new OuijaScene();

    initSounds();

    //TODO: Call start session when session has been found instead
    setTimeout((): void => {
        startSession();
    }, 5000);
}

function main(): void {
    //TODO: Add buttons here
    const findSessionButton = document.getElementById('findSession');
    const mainMenu = document.getElementById('menu');
    const loadingScreen = document.getElementById('loading-screen');
    const gameUI = document.getElementById('game');
    eventText = document.getElementById('eventText');

    $(loadingScreen).hide();
    $(gameUI).hide();
    $(eventText).hide();

    findSessionButton.addEventListener('click', (): void => {
        fade(document.getElementById('menu'));
        enterLoadingScreen();
    });

    network = new Network();
}

function endSession(): void {
    //TODO: Do something here, perhaps transition back to main menu
}

main();
