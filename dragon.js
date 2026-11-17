
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ============================================
// 1. HTML ELEMENTS
// ============================================

const container = document.getElementById("dragon-container");
const canvas = document.getElementById("dragon-canvas");
const quiz = document.getElementById("quiz");

if (!container || !canvas || !quiz) {
    throw new Error("Phoenix HTML elements could not be found.");
}

// ============================================
// 2. SCENE
// ============================================

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

camera.position.set(0, 0, 18);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

// ============================================
// 3. LIGHTING
// ============================================

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const mainLight = new THREE.DirectionalLight(0xffe3bd, 2.2);
mainLight.position.set(5, 8, 10);
scene.add(mainLight);

const warmLight = new THREE.PointLight(0xff702c, 1.5, 35);
warmLight.position.set(-5, 3, 5);
scene.add(warmLight);

const rimLight = new THREE.DirectionalLight(0x9a6aff, 1.3);
rimLight.position.set(-7, 4, -6);
scene.add(rimLight);

// ============================================
// 4. PHOENIX GROUPS
// ============================================

// flightRig controls position and direction.
// modelGroup controls the model's local orientation.

const flightRig = new THREE.Group();
const modelGroup = new THREE.Group();

scene.add(flightRig);
flightRig.add(modelGroup);

let phoenix = null;
let mixer = null;
let flightAction = null;

let flightStarted = false;
let flightStartTime = 0;

const clock = new THREE.Clock();

const TOTAL_DURATION = 13;

// Change this only if the phoenix faces the wrong
// direction. Try Math.PI if it flies backwards.
const MODEL_FORWARD_Y_ROTATION = 0;

// ============================================
// 5. CAMERA BOUNDS
// ============================================

function getViewBounds() {
    const distance = camera.position.z;

    const height =
        2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
        * distance;

    return {
        width: height * camera.aspect,
        height
    };
}

// ============================================
// 6. CONTINUOUS FLIGHT PATH
// ============================================

let flightPath = null;

function createFlightPath() {
    const { width, height } = getViewBounds();

    const points = [
        // Enter from the upper-right
        new THREE.Vector3(width * 0.85, height * 0.72, -1),

        new THREE.Vector3(width * 0.65, height * 0.43, -0.5),

        new THREE.Vector3(width * 0.28, height * 0.16, 0),

        // Sweep across the screen
        new THREE.Vector3(-width * 0.15, height * 0.12, 0),

        new THREE.Vector3(-width * 0.48, -height * 0.12, -0.5),

        // Wide lower turn
        new THREE.Vector3(-width * 0.30, -height * 0.43, 0),

        new THREE.Vector3(width * 0.12, -height * 0.43, 0.5),

        // Climb into another sweeping turn
        new THREE.Vector3(width * 0.48, -height * 0.10, 0),

        new THREE.Vector3(width * 0.40, height * 0.32, -0.5),

        new THREE.Vector3(width * 0.05, height * 0.43, 0),

        // Final departure
        new THREE.Vector3(-width * 0.38, height * 0.35, -1),

        new THREE.Vector3(-width * 0.75, height * 0.70, -3)
    ];

    flightPath = new THREE.CatmullRomCurve3(
        points,
        false,
        "centripetal",
        0.5
    );

    // Improve the accuracy of equal-distance sampling
    flightPath.arcLengthDivisions = 500;
    flightPath.updateArcLengths();
}

createFlightPath();

// ============================================
// 7. LOAD PHOENIX
// ============================================

function loadPhoenix() {
    const loader = new GLTFLoader();

    loader.load(
        "models/dragon.glb",

        (gltf) => {
            phoenix = gltf.scene;

            // Center the model
            const bounds = new THREE.Box3().setFromObject(phoenix);
            const center = bounds.getCenter(new THREE.Vector3());
            const size = bounds.getSize(new THREE.Vector3());

            phoenix.position.sub(center);

            // Model size
            const largestDimension = Math.max(
                size.x,
                size.y,
                size.z
            );

            const modelScale = 5.5 / largestDimension;
            phoenix.scale.setScalar(modelScale);

            // Model orientation correction
            phoenix.rotation.y = MODEL_FORWARD_Y_ROTATION;

            modelGroup.add(phoenix);

            // =================================
            // ACTUAL MODEL ANIMATION
            // =================================

            mixer = new THREE.AnimationMixer(phoenix);

            console.log(
                "Phoenix animations:",
                gltf.animations.map((clip) => ({
                    name: clip.name,
                    duration: clip.duration,
                    tracks: clip.tracks.length
                }))
            );

            const flightClip = gltf.animations.find(
                (clip) => clip.name === "Take 001"
            );

            if (flightClip) {
                flightAction = mixer.clipAction(flightClip);

                flightAction.reset();
                flightAction.setLoop(THREE.LoopRepeat, Infinity);

                // Slightly slow the original animation
                flightAction.timeScale = 0.9;

                flightAction.play();

                console.log("Phoenix wing animation started.");
            } else {
                console.error("Take 001 animation not found.");
            }

            flightRig.visible = false;

            console.log("Phoenix loaded successfully!");

            if (!quiz.hidden) {
                startFlight();
            }
        },

        undefined,

        (error) => {
            console.error("Phoenix loading error:", error);
        }
    );
}

// ============================================
// 8. START FLIGHT
// ============================================

function startFlight() {
    if (!phoenix || flightStarted) return;

    createFlightPath();

    flightStarted = true;
    flightStartTime = clock.elapsedTime;

    flightRig.visible = true;

    flightRig.position.set(0, 0, 0);
    flightRig.quaternion.identity();
    flightRig.scale.setScalar(1);

    // Restart the animation cleanly
    if (flightAction) {
        flightAction.reset();
        flightAction.play();
    }

    console.log("Phoenix flight started.");
}

// ============================================
// 9. SMOOTH FLIGHT ORIENTATION
// ============================================

const forwardAxis = new THREE.Vector3(0, 0, 1);
const previousTangent = new THREE.Vector3();
const currentTangent = new THREE.Vector3();
const nextTangent = new THREE.Vector3();

const baseQuaternion = new THREE.Quaternion();
const bankQuaternion = new THREE.Quaternion();

const bankAxis = new THREE.Vector3(0, 0, 1);

function updateFlightOrientation(progress) {
    const lookDistance = 0.004;

    const before = Math.max(0, progress - lookDistance);
    const after = Math.min(1, progress + lookDistance);

    previousTangent.copy(flightPath.getTangentAt(before));
    nextTangent.copy(flightPath.getTangentAt(after));
    currentTangent.copy(flightPath.getTangentAt(progress));

    if (currentTangent.lengthSq() < 0.000001) return;

    currentTangent.normalize();
    previousTangent.normalize();
    nextTangent.normalize();

    // Point the phoenix along its flight direction.
    baseQuaternion.setFromUnitVectors(
        forwardAxis,
        currentTangent
    );

    // Calculate how sharply the flight path is turning.
    const turn = previousTangent.x * nextTangent.y
        - previousTangent.y * nextTangent.x;

    // Gentle banking instead of exaggerated rotation.
    const bank = THREE.MathUtils.clamp(
        -turn * 2.0,
        -0.38,
        0.38
    );

    bankQuaternion.setFromAxisAngle(bankAxis, bank);

    flightRig.quaternion
        .copy(baseQuaternion)
        .multiply(bankQuaternion);
}

// ============================================
// 10. NATURAL FLIGHT
// ============================================

function updateFlight() {
    if (!flightStarted) return;

    const elapsed = clock.elapsedTime - flightStartTime;

    if (elapsed >= TOTAL_DURATION) {
        flightRig.visible = false;
        flightStarted = false;

        console.log("Phoenix flight finished.");
        return;
    }

    const progress = elapsed / TOTAL_DURATION;

    // Constant-distance movement along one continuous curve.
    const position = flightPath.getPointAt(progress);

    flightRig.position.copy(position);

    // Smoothly orient the phoenix along the curve.
    updateFlightOrientation(progress);

    // Very subtle changes in apparent scale.
    // Most depth perception comes from the camera.
    const distanceEffect = Math.sin(progress * Math.PI * 2);

    const scale = 1 + distanceEffect * 0.025;

    flightRig.scale.setScalar(scale);
}

// ============================================
// 11. RESIZE
// ============================================

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    createFlightPath();
}

window.addEventListener("resize", handleResize);

// ============================================
// 12. RENDER LOOP
// ============================================

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer) {
        mixer.update(delta);
    }

    updateFlight();

    renderer.render(scene, camera);
}

animate();

// ============================================
// 13. START WHEN QUIZ OPENS
// ============================================

const observer = new MutationObserver(() => {
    if (!quiz.hidden) {
        startFlight();
    }
});

observer.observe(quiz, {
    attributes: true,
    attributeFilter: ["hidden"]
});

// Load the model
loadPhoenix();
