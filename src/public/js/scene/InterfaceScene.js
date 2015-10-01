import THREE from 'three';
import RenderPass from '../../data/postprocessing/RenderPass.js';

export default class VideoScene {
  constructor(camera, renderer) {
    // Scene
    this.scene = new THREE.Scene();
    this.renderer = renderer;
    // this.camera = camera;
    this.camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.position.z = 800;
		this.camera.updateProjectionMatrix();

    // Create lights
    let light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    this.scene.add(light);

    let ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);

    // Create the render
    this.render = new THREE.RenderPass(this.scene, this.camera);
  }

  getRender() {
    return this.render;
  }

  getScene() {
    return this.scene;
  }

  add(object) {
    this.scene.add(object);
  }
}
