import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 创建场景 Create scene
const scene = new THREE.Scene();

// 创建相机 Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建渲染器 Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建地球 Create Earth
const geometry = new THREE.SphereGeometry(2, 64, 64);
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
const material = new THREE.MeshPhongMaterial({
    map: texture,
    shininess: 5
});
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// 添加环境光 Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 添加平行光 Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// 亮度控制 Brightness control
const brightnessSlider = document.getElementById('brightness-slider');
brightnessSlider.addEventListener('input', (e) => {
    const value = e.target.value / 100;
    ambientLight.intensity = value * 0.5;
    directionalLight.intensity = value;
});

// 添加轨道控制器 Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;
controls.maxDistance = 10;

// 添加星空背景 Add starry background
const starsGeometry = new THREE.BufferGeometry();
const starsVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starsVertices.push(x, y, z);
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// 自动旋转 Auto rotation
earth.rotation.y = 0;
let autoRotate = true;

// 自动旋转开关控制 Auto rotation toggle control
const autoRotateToggle = document.getElementById('auto-rotate-toggle');
autoRotateToggle.addEventListener('change', (e) => {
    autoRotate = e.target.checked;
});

// 监听窗口大小变化 Listen for window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 动画循环 Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // 更新控制器 Update controls
    controls.update();
    
    // 地球自转 Earth rotation
    if (autoRotate) {
        // 计算30分钟转360度的每帧旋转角度 Calculate rotation angle per frame for 360 degrees in 30 minutes
        // 假设60fps，30分钟 = 1800秒，每秒60帧 Assuming 60fps, 30 minutes = 1800 seconds, 60 frames per second
        // 360度 / (1800秒 * 60帧) = 0.003333..度/帧 360 degrees / (1800 seconds * 60 frames) = 0.003333.. degrees/frame
        earth.rotation.y += (Math.PI * 2) / (1800 * 60);
    }
    
    renderer.render(scene, camera);
}

animate();