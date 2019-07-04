import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';

export class OuijaScene {
    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private mesh: THREE.Mesh;
    private clock: THREE.Clock;
    private mixer: THREE.AnimationMixer;
    private marker: THREE.Object3D;

    public constructor() {
        this.scene = new THREE.Scene();
        this.renderer = this.initRenderer();
        this.camera = this.initCamera();
        this.scene.add(this.camera);
        this.clock = new THREE.Clock();
        this.mixer = new THREE.AnimationMixer(this.camera);

        // Light
        const light = new THREE.PointLight(0x66b2ff, 3);
        light.position.set(0, 2, 0);
        this.scene.add(light);

        // Lightning Effect
        const lightningLight = new THREE.PointLight(0x66b2ff, 0);
        lightningLight.position.set(3, 5, 12);
        lightningLight.castShadow = true;
        lightningLight.shadow.mapSize.width = 1024 * 4;
        lightningLight.shadow.mapSize.height = 1024 * 4;
        this.scene.add(lightningLight);

        // GLTF Loader
        const loader = new GLTFLoader();
        loader.load(
            // resource URL
            '/res/board.glb',
            // called when the resource is loaded
            this.onLoadBoard,
            // called while loading is progressing
            (xhr: ProgressEvent): void => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
            // called when loading has errors
            (error: ErrorEvent): void => console.log(error)
        );
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
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 7);
        camera.rotation.set(-90, 0, 0);
        return camera;
    }

    private onLoadBoard(gltf: any): void {
        //activate shadows for objects in scene
        gltf.scene.traverse(
            (node: THREE.Object3D): void => {
                node.castShadow = true;
                node.receiveShadow = true;

                if (node.name == 'BoardCollider') {
                    const boardCollider = node;
                    boardCollider.visible = false;
                }

                if (node.name == 'Marker') {
                    this.marker = node;
                }
            }
        );

        this.mixer = new THREE.AnimationMixer(this.camera);
        const clips: THREE.AnimationClip[] = gltf.animations;
        const action = this.mixer.clipAction(THREE.AnimationClip.findByName(clips, 'Action.002'));
        action.timeScale = 2; // add this

        this.mixer.addEventListener(
            'finished',
            (): void => {
                // TODO: unfade(document.getElementById('game'));
            }
        );

        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();

        gltf.scene.castShadow = true;
        gltf.scene.receiveShadow = true;

        this.scene.add(gltf.scene);
    }
}
