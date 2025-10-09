// 3D Animation functionality
let scene, camera, renderer, cube;

function init3D() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(300, 300);
  renderer.setClearColor(0x000000, 0); // This makes the background transparent
  document
    .getElementById("animation-container")
    .appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(2, 2, 2); // Increased from default 1,1,1
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    transparent: true,
    opacity: 0.8,
  });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 7; // Moved the camera back to keep the larger cube in view

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function updateCubeScale() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);
  const progress = (now - start) / (end - start);
  const baseScale = 0.5; // This sets the minimum size of the cube
  cube.scale.set(
    baseScale + progress,
    baseScale + progress,
    baseScale + progress
  );
}

window.addEventListener("load", () => {
  init3D();
  const cubeScaleIntervalId = setInterval(updateCubeScale, 1000);
  
  // Cleanup interval on page unload to prevent memory leaks
  window.addEventListener("beforeunload", () => {
    clearInterval(cubeScaleIntervalId);
  });
});
