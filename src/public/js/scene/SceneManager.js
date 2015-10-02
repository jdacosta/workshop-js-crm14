import THREE from 'three';
import Events from 'events';
import Stats from 'stats.js';
import DigitalGlitch from '../../data/shaders/DigitalGlitch.js';
import CopyShader from '../../data/shaders/CopyShader.js';
import RenderPass from '../../data/postprocessing/RenderPass.js';
import ShaderPass from '../../data/postprocessing/ShaderPass.js';
import MaskPass from '../../data/postprocessing/MaskPass.js';
import GlitchPass from '../../data/postprocessing/GlitchPass.js';
import EffectComposer from '../../data/postprocessing/EffectComposer.js';

const EventEmitter = Events.EventEmitter;

/**
 * SeneManager - crée la scène webgl
 */
export default class SceneManager extends EventEmitter {

  /**
   * Constructor
   * @return {[type]} [description]
   */
	constructor() {
		super();

		// ThreeJS
		this.scene;
  	this.camera;
    this.renderer;
  	this.light;
  	this.composer;
  	this.glitchPass;

    // Stats
    this.stats;
	}

  /**
   * Initialisation de la classe
   * @return {void}
   */
	init() {

    // Init Stats only in dev mode
    this.initStats();

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.position.z = 1000;
    this.camera.updateProjectionMatrix();

    // Config renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // this.renderer.setClearColor(0xff0000, 1.0);

    this.light = new THREE.PointLight( 0xffffff );
    this.light.position.set( 0, 250, 0);
    this.scene.add(this.light);

    let ambientLight = new THREE.AmbientLight( 0xffffff );
    this.scene.add( ambientLight );

    // Add to the dom
    document.body.appendChild(this.renderer.domElement);

		this.composer = new THREE.EffectComposer(this.renderer);
		this.composer.addPass( new THREE.RenderPass(this.scene, this.camera));

		// Create Glitch
		this.glitchPass = new THREE.GlitchPass();
		this.glitchPass.renderToScreen = true;
		this.glitchPass.goWild = false;

		this.composer.addPass(this.glitchPass);

    // Launch render
    requestAnimationFrame(this.render.bind(this));

    // Listen browser resize
    // window.addEventListener( 'resize', this.onWindowResize.bind(this), false);

    // Emit loaded event
    this.emit('sceneManagerLoaded');
	}

  /**
   * Redimensionne la scène
   * @return {void}
   */
  onWindowResize() {
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.composer.setSize( window.innerWidth, window.innerHeight );
  }

  /**
   * Active ou désactive les glitch
   * @param {boolean} bool
   */
  setGlitch(bool) {
    this.glitchPass.goWild = !bool;
  }

	/**
	* Three JS Render
	* @return {void}
	*/
	render() {
		this.stats.begin();

		this.emit('render');

		// this.renderer.render(this.scene, this.camera);
		this.composer.render();

		this.stats.end();

		// Re-render each frame
		requestAnimationFrame(this.render.bind(this));
	}

  /**
   * Init Stats for debug
   * @return {void}
   */
  initStats() {
    // Stats
    this.stats = new Stats();
    this.stats.setMode(0); // 0: fps, 1: ms, 2: mb

    // Align top-left
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';

    document.body.appendChild(this.stats.domElement);
  }

  /**
   * Ajoute un objet à la scène principale
   * @param {ThreeObject} object
   */
	add(object) {
		return this.scene.add(object);;
	}
}
