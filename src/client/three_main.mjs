import { PerspectiveCamera, Scene, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer } from './lib/three.js';

var camera, scene, renderer;
var geometry, material, mesh;

function init() {
    camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    scene = new Scene();

    geometry = new BoxGeometry(0.2, 0.2, 0.2);
    material = new MeshNormalMaterial();

    mesh = new Mesh(geometry, material);
    scene.add(mesh);

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
}

init();
animate();
