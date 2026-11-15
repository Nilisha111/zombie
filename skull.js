import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// 1. Get the canvas from HTML
const canvas = document.querySelector("#skull-canvas");

// 2. Create a 3D scene
const scene = new THREE.Scene();

// 3. Create a camera
const camera = new THREE.PerspectiveCamera(
    45,
    1,
    0.1,
    100
);

camera.position.z = 4;

// 4. Create the renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(220, 220);

// 5. Add lights
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(2, 3, 4);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambient);
// 6. Load the skull
const loader = new GLTFLoader();
let skull;

loader.load(
    "models/skull.glb",

    function (gltf) {
        skull = gltf.scene;

        // Find the model's dimensions
        const box = new THREE.Box3().setFromObject(skull);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
// Centre the model
        skull.position.sub(center);

        // Adjust its size
        const maxDimension = Math.max(size.x, size.y, size.z);
        skull.scale.setScalar(1.8 / maxDimension);

        scene.add(skull);

        console.log("Skull loaded successfully!");
    },

    undefined,
function (error) {
        console.error("Skull failed to load:", error);
    }
);

// 7. Keep rendering the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
// Store the mouse position
let targetX = 0;
let targetY = 0;

// Detect mouse movement
window.addEventListener("pointermove", (event) => {

    targetY = (event.clientX / window.innerWidth - 0.5) * 1.2;

    targetX = (event.clientY / window.innerHeight - 0.5) * 0.8;

});

// Smoothly rotate the skull
function followMouse() {

    if (skull) {

        skull.rotation.y +=
            (targetY - skull.rotation.y) * 0.05;
skull.rotation.x +=
            (targetX - skull.rotation.x) * 0.05;

    }

    requestAnimationFrame(followMouse);
}

followMouse();