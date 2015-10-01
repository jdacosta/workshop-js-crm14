import THREE from 'three';
import RenderPass from '../../data/postprocessing/RenderPass.js';

export default class Scene {
  constructor(camera, renderer) {
    // Scene
    this.scene = new THREE.Scene();
    this.renderer = renderer;
    this.camera = camera;

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
