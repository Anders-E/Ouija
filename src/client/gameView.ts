import {HTMLView} from './view';
import {OuijaScene} from './ouijaScene';
import { EventSystem } from './eventSystem';

import * as THREE from 'three';
import { stringify } from 'querystring';
import {Constants} from './constants';
import { ViewManager } from './viewManager';
import * as Input from './modules/input';

export class GameView extends HTMLView {
    
    private ouijaScene: OuijaScene;

    private eventSystem: EventSystem;
    private eventText:HTMLElement;
    private eventEffectSound: THREE.Audio;

    public isMouseDown: boolean;
    private mousePosition: THREE.Vector2;

    public constructor() {
        super(document.getElementById('game'));

        this.eventText = document.getElementById('eventText');

        this.isMouseDown = false;
        this.ouijaScene = new OuijaScene();
        this.eventSystem = new EventSystem();
    }

    private init() : void {
        const audioLoader = new THREE.AudioLoader();
        const audioListener = new THREE.AudioListener();
        this.eventEffectSound = new THREE.Audio(audioListener);
        audioLoader.load(
            'res/excited horror sound.wav',
            (buffer: THREE.AudioBuffer): void => {
                this.eventEffectSound.setBuffer(buffer);
                this.eventEffectSound.setLoop(false);
            },
            (): void => {},
            (): void => {}
        ); // TODO: Add onProgress and onError functions: https://threejs.org/docs/#api/en/loaders/AudioLoader
    }

    public didReceiveMessage(message: string) : void {
        super.didReceiveMessage(message);

        if(message == Constants.LOAD_SCENE_MESSAGE) {
            this.init();
            let didOuijaLoad = this.ouijaSceneLoaded.bind(this);
            this.ouijaScene.initialize(didOuijaLoad);
        }
    }

    private ouijaSceneLoaded() : void {
        console.log("OuijaScene loaded!");
        ViewManager.getInstance().sendMessage(1, Constants.SCENE_LOADED_MESSAGE);
    }

    public startSession(): void {
        this.rootElement.appendChild(this.ouijaScene.getRenderer().domElement);
        // $(this.ouijaScene.getRenderer().domElement).hide();
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
    
        // let anim = this.animate.bind(this);
        // anim();
        this.animate();
    }
    
    public endSession(): void {
        //TODO: Do something here, perhaps transition back to main menu
    }

    private update(): void {
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
        // console.log(Input.getMouseDown());
        if (Input.getMouseDown()) {
            const mousePosition = new THREE.Vector2(
                (Input.getMousePositionX() / window.innerWidth) * 2 - 1,
            -(Input.getMousePositionY() / window.innerHeight) * 2 + 1);

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mousePosition, this.ouijaScene.getCamera());
            const intersects: THREE.Intersection[] = [];
            this.ouijaScene.getBoardCollider().raycast(raycaster, intersects);
            if (intersects.length > 0) {
                const point = intersects[0].point;
    
                //emit point to Server
                this.network.getSocket().emit('player_marker_pos', new THREE.Vector2(point.x, point.z));
            }
        }
        this.ouijaScene.setMarkerPosition(this.network.getMarkerPosition());
    }

    public animate(): void {
        let delta = this.ouijaScene.getClock().getDelta();
        this.update();
        this.ouijaScene.getMixer().update(delta);

        this.ouijaScene.getCamera().lookAt(new THREE.Vector3(0, 0, 0));

        // lightningLight.intensity = THREE.Math.clamp(lightningLight.intensity - delta * 200, 0, 100);

        this.ouijaScene.render();

        window.requestAnimationFrame(this.animate.bind(this));
    }
    
    private onPlayerJoined(): void {
        //TODO: Handle event sound effects 
        // this.eventEffectSound.play();
        this.displayEventMessage('It feels as though someone is watching you...', 5);
    }

    private onPlayerLeft(): void {
        this.displayEventMessage('The tension somehow feels lighter...', 5);
    }

    //duration in ms
    public displayEventMessage(message: string, duration: number): void {
        this.eventText.innerHTML = message;

        this.eventText.classList.add("visible");

        setTimeout((): void => {
            this.eventText.classList.add("hidden");
        }, duration * 1000);
    }

    public getOuijaScene() : OuijaScene {
        return this.ouijaScene;
    }

    public didEnter() : void {
        super.didEnter();
        this.startSession();
    }
}