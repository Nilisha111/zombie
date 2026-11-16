
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// 1. Get canvas
const canvas = document.querySelector("#bat-canvas");

// 2. Create scene
const scene = new THREE.Scene();

// 3. Camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.z = 8;

// 4. Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

// 5. Lighting
scene.add(
    new THREE.AmbientLight(0xffffff, 2)
);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(2, 4, 5);
scene.add(light);

// 6. Variables
let bat;
let mixer;

const clock = new THREE.Clock();

// 7. Load bat model
const loader = new GLTFLoader();

loader.load(
    "models/bat.glb",

    function (gltf) {

        bat = gltf.scene;

        // Centre the model
        const box = new THREE.Box3().setFromObject(bat);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        bat.position.sub(center);

        // Scale model
        const maxDimension = Math.max(
            size.x,
            size.y,
            size.z
        );

        bat.scale.setScalar(1.4 / maxDimension);

        scene.add(bat);

        // Play original wing animation
        if (gltf.animations.length > 0) {

            mixer = new THREE.AnimationMixer(bat);

            const action = mixer.clipAction(
                gltf.animations[0]
            );

            action.play();

            console.log("Bat wing animation started!");

        } else {

            console.warn("No animation found in bat model.");

        }

        console.log("Bat loaded successfully!");
    },

    undefined,

    function (error) {
        console.error("Bat failed to load:", error);
    }
);

// 8. Responsive resizing
window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// 9. Flying animation
function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.elapsedTime;

    if (mixer) {
        mixer.update(delta);
    }

    if (bat) {

        // Horizontal flying movement
        //bat.position.x = Math.sin(time * 0.7) * 4;

        // Natural flying movement
        //bat.position.y = 0.8 + Math.sin(time * 2) * 0.4;

        // Slight tilt while flying
        //bat.rotation.z = Math.sin(time * 0.7) * 0.15;

// Horizontal flying movement
const speed = 0.7;

bat.position.x = Math.sin(time * speed) * 4;

// Natural flying movement
bat.position.y = 0.8 + Math.sin(time * 2) * 0.4;

// Detect flying direction
const direction = Math.cos(time * speed);

// Turn bat around
bat.rotation.y = direction < 0 ? Math.PI : 0;

// Slight banking movement
bat.rotation.z = Math.sin(time * speed) * 0.15;

    }

    renderer.render(scene, camera);
}

animate();
