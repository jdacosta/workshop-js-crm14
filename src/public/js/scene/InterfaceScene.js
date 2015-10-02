import THREE from 'three';
import ShaderExtras from '../../data/shaders/ShaderExtras.js';
import EffectComposer from '../../data/postprocessing/EffectComposer.js';
import RenderPass from '../../data/postprocessing/RenderPass.js';
import BloomPass from '../../data/postprocessing/BloomPass.js';
import ShaderPass from '../../data/postprocessing/ShaderPass.js';
import MaskPass from '../../data/postprocessing/MaskPass.js';
import SavePass from '../../data/postprocessing/SavePass.js';

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

export default class VideoScene {
  constructor(camera, renderer) {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(58, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
		this.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
		this.camera.position.z = 1000;

    // Create lights
    let light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    this.scene.add(light);

    let ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);

    // Create the render
    this.renderModelInterface = new THREE.RenderPass(this.scene, this.camera);

    let renderTargetParameters = { 
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBufer: false
    };

    let renderTargetGlow = new THREE.WebGLRenderTarget(SCREEN_WIDTH, SCREEN_HEIGHT, renderTargetParameters);

    this.interfaceRender = new THREE.EffectComposer(this.renderer, renderTargetGlow);
    this.interfaceRender.addPass(this.renderModelInterface);
  }

  getRender() {
    return this.interfaceRender;
  }

  getRenderPass() {
    return this.renderModelInterface;
  }

  getScene() {
    return this.scene;
  }

  add(object) {
    this.scene.add(object);
  }
}
