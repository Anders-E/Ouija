import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import { Vector } from 'three';
import { MarkerPositionMsg } from '../shared/messages';

export class OuijaScene {
    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private mesh: THREE.Mesh;
    private clock: THREE.Clock;
    private mixer: THREE.AnimationMixer;
    private marker: THREE.Object3D;
    private boardCollider: THREE.Object3D;

    private lightningLight: THREE.PointLight;
    private lightningAudioLoader: THREE.AudioLoader;
    private lightningSound: THREE.Audio;

    public constructor() {
        this.scene = new THREE.Scene();
        this.renderer = this.initRenderer();
        this.camera = this.initCamera();
        this.scene.add(this.camera);
        this.clock = new THREE.Clock();
        this.mixer = new THREE.AnimationMixer(this.camera);
    }

    public initialize(callback: Function) : void {
        this.initScene(callback);
        this.initSounds();
    }

    private initScene(callback: Function) : void {
        // GLTF Loader
        const loader = new GLTFLoader();
        loader.load(
            // resource URL
            '/res/board.glb',
            // called when the resource is loaded
            (gltf: any): void => {
                gltf.scene.traverse((node: THREE.Object3D): void => {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    if (node.name == 'Board_symbols') {
                        console.log('KEKEKEKKE');
                        node.castShadow = false;
                        node.layers.set(1);
                    }

                    if (node.name == 'BoardCollider') {
                        this.boardCollider = node;
                        this.boardCollider.visible = false;
                    }

                    if (node.name == 'Marker') {
                        this.marker = node;

                        //Marker lightsource
                        const markerLight = new THREE.SpotLight(0xffffff, 10);
                        markerLight.decay = 2;
                        markerLight.penumbra = 1;
                        markerLight.castShadow = false;
                        markerLight.position.set(0, 0.75, 0);
                        markerLight.target = this.marker;
                        // markerLight.lookAt(this.marker.position);
                        markerLight.parent = this.marker;
                        markerLight.layers.set(1);
                        this.marker.add(markerLight);
                    }
                });

                this.mixer = new THREE.AnimationMixer(this.camera);
                const clips: THREE.AnimationClip[] = gltf.animations;
                const action = this.mixer.clipAction(
                    THREE.AnimationClip.findByName(clips, 'Action.002')
                );
                action.timeScale = 2; // add this

                this.mixer.addEventListener('finished', (): void => {
                    // TODO: unfade(document.getElementById('game'));
                });

                action.setLoop(THREE.LoopOnce, 1);
                action.clampWhenFinished = true;
                action.play();

                gltf.scene.castShadow = true;
                gltf.scene.receiveShadow = true;

                this.scene.add(gltf.scene);
                callback();
            },
            // called while loading is progressing
            (xhr: ProgressEvent): void => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
            // called when loading has errors
            (error: ErrorEvent): void => console.log(error)
        );

        // Lights
        const ambientLight = new THREE.AmbientLight(0x66b2ff, 2);
        this.scene.add(ambientLight);

        const symbolsAmbientLight = new THREE.AmbientLight(0xffffff, 5);
        symbolsAmbientLight.layers.set(1);
        this.scene.add(symbolsAmbientLight);

        // Lightning Effect
        const lightningLight = new THREE.PointLight(0x66b2ff, 0);
        lightningLight.position.set(6.12, 8.76, 15.39);
        lightningLight.castShadow = false;
        // lightningLight.shadow.mapSize.width = 1024 * 4;
        // lightningLight.shadow.mapSize.height = 1024 * 4;
        this.scene.add(lightningLight);

        // markerLight.position.copy(this.marker.position);
        // markerLight.position.copy(markerLight.position.add(new THREE.Vector3(0, 1, 0)));
        // markerLight.parent = this.marker;
        // this.scene.add(markerLight);
    }

    private initSounds(): void {
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
    
        const lightningListener = new THREE.AudioListener();
        this.lightningSound = new THREE.Audio(lightningListener);
        this.lightningAudioLoader = new THREE.AudioLoader();
    }


    public setMarkerPosition(position: MarkerPositionMsg): void {
        this.marker.position.set(position.x, 0, position.y);
    }

    public getCamera(): THREE.Camera {
        return this.camera;
    }

    public getClock(): THREE.Clock {
        return this.clock;
    }

    public getBoardCollider(): THREE.Object3D {
        return this.boardCollider;
    }

    public getMixer(): THREE.AnimationMixer {
        return this.mixer;
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }

    private initRenderer(): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(new THREE.Color('#050a0f'));
        return renderer;
    }

    private initCamera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 5, 7);
        camera.rotation.set(-90, 0, 0);
        return camera;
    }

    public render() {
        this.renderer.autoClear = true;
        this.camera.layers.set(0);
        this.renderer.render(this.scene, this.camera);

        this.renderer.autoClear = false;
        this.camera.layers.set(1);
        this.renderer.render(this.scene, this.camera);
    }
}
