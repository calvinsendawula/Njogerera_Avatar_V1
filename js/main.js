//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(13, window.innerWidth / window.innerHeight, 0.2, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'human';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
// loader.load(
//   `models/${objToRender}/scene.glb`,
//   function (gltf) {
//     //If the file is loaded, add it to the scene
//     object = gltf.scene;
//     scene.add(object);
//   },
//   function (xhr) {
//     //While it is loading, log the progress
//     console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//   },
//   function (error) {
//     //If there is an error, log it
//     console.error(error);
//   }
// );

loader.load(
  `models/${objToRender}/scene.glb`,
  function (gltf) {
    // If the file is loaded, add it to the scene
    const loadedModel = gltf.scene;

    // Find the armature in the loaded model hierarchy
    const armature = findArmature(loadedModel);

    if (armature) {
      // You have found the armature, and you can proceed with animation setup.
      // Continue with the animation setup using the armature reference.

      // Add the loaded model to the scene
      scene.add(loadedModel);
    } else {
      console.error("Armature not found in the loaded model.");
    }
  },
  function (xhr) {
    // While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    // If there is an error, log it
    console.error(error);
  }
);

// Recursive function to find the armature
function findArmature(node) {
  if (node.isBone) {
    return node; // Return the bone if it's a bone node
  }

  for (const child of node.children) {
    const result = findArmature(child);
    if (result) {
      return result; // Return the armature if found in a child node
    }
  }

  return null; // Armature not found in this branch
}

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
// camera.position.z = objToRender === "human" ? 25 : 500;
camera.position.set(0, 5, 20); // Adjust the position as needed
// camera.lookAt(0, 5, 0); // Adjust the lookAt target to focus on upper body

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "human" ? 5 : 1);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "human") {
  controls = new OrbitControls(camera, renderer.domElement);
  // Assuming you've loaded your avatar and have a reference to the armature
  const armature = avatar.getObjectByName('Armature'); // Replace 'Armature' with the actual name

  // Find a specific bone by name
  const boneName = 'RightForeArm'; // Replace with the actual bone name
  const bone = armature.getObjectByName(boneName, true); // Use the recursive flag to search nested bones

  // Manipulate the bone's rotation or position
  bone.rotation.x = Math.PI / 4; // Rotate the bone
  bone.position.set(0, 0, 1); // Translate the bone

}

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object && objToRender === "eye") {
    //I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();