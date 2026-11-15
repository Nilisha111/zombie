
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// 1. Get the canvas
const canvas = document.querySelector("#skull-canvas");

// 2. Create the scene
const scene = new THREE.Scene();

// 3. Create the camera
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.z = 4;

// 4. Create renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(220, 220);

// 5. Lighting
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(2, 3, 4);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambient);

// 6. Variables for animation
let skull;
let leftGlow;
let rightGlow;

const clock = new THREE.Clock();

// 7. Create glowing eyes
function createGlowingEye(x, y, z) {

    const eyeGroup = new THREE.Group();

    // Main bright green eye
    const eyeGeometry = new THREE.SphereGeometry(0.055, 32, 32);

    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0x39ff14
    });

    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeGroup.add(eye);

    // Inner glow
    const innerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0x39ff14,
            transparent: true,
            opacity: 0.35,
            depthWrite: false
        })
    );

    eyeGroup.add(innerGlow);

    // Outer glow
    const outerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0x39ff14,
            transparent: true,
            opacity: 0.12,
            depthWrite: false
        })
    );

    eyeGroup.add(outerGlow);

    // Green light around the eye
    const pointLight = new THREE.PointLight(
        0x39ff14,
        1.5,
        0.7
    );

    eyeGroup.add(pointLight);

    // Position the eye
    eyeGroup.position.set(x, y, z);

    return {
        group: eyeGroup,
        inner: innerGlow,
        outer: outerGlow,
        light: pointLight
    };
}

// 8. Load skull model
const loader = new GLTFLoader();

loader.load(
    "models/skull.glb",

    function (gltf) {

        skull = gltf.scene;

        // Get model dimensions
        const box = new THREE.Box3().setFromObject(skull);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Centre the model
        skull.position.sub(center);

        // Scale the model
        const maxDimension = Math.max(size.x, size.y, size.z);
        skull.scale.setScalar(1.8 / maxDimension);

        scene.add(skull);

        // Create eye group
        // Compensate for skull scaling so eye positions
        // are easier to adjust.
        const eyeHolder = new THREE.Group();
        eyeHolder.scale.setScalar(1 / skull.scale.x);
        skull.add(eyeHolder);

        // LEFT EYE
        leftGlow = createGlowingEye(-0.2, 0.6, 0.7);
        eyeHolder.add(leftGlow.group);

        // RIGHT EYE
        rightGlow = createGlowingEye(0.2, 0.6, 0.7);
        eyeHolder.add(rightGlow.group);

        console.log("Skull and glowing eyes loaded!");
    },

    undefined,

    function (error) {
        console.error("Skull failed to load:", error);
    }
);

// 9. Mouse movement
let targetX = 0;
let targetY = 0;

window.addEventListener("pointermove", (event) => {

    targetY = (event.clientX / window.innerWidth - 0.5) * 1.2;

    targetX = (event.clientY / window.innerHeight - 0.5) * 0.8;

});

// 10. Animation
function animate() {

    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    if (skull) {

        // Smooth mouse movement
        skull.rotation.y +=
            (targetY - skull.rotation.y) * 0.05;

        skull.rotation.x +=
            (targetX - skull.rotation.x) * 0.05;
    }

    // Pulsating green eyes
    if (leftGlow && rightGlow) {

        const pulse = 0.5 + Math.sin(time * 2.5) * 0.5;

        [leftGlow, rightGlow].forEach((eye) => {

            eye.inner.material.opacity = 0.25 + pulse * 0.25;

            eye.outer.material.opacity = 0.08 + pulse * 0.12;

            eye.outer.scale.setScalar(1 + pulse * 0.15);

            eye.light.intensity = 1 + pulse * 1.5;

        });

    }

    renderer.render(scene, camera);
}

animate();
