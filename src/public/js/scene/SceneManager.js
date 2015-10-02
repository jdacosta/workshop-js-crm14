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
import TexturePass from '../../data/postprocessing/TexturePass.js';

const EventEmitter = Events.EventEmitter;
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

export default class SceneManager extends EventEmitter {

	constructor() {
		super();

		// ThreeJS
		this.camera;
		this.renderer;
		this.interfaceComposer;
		this.finalcomposer;

		// Configs

	    // Stats
	    this.stats;
	}

	init() {
	    // Init Stats only in dev mode
	    this.initStats();

		// Create a camera
		this.camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.position.z = 1000;
		this.camera.updateProjectionMatrix();

		// Create the renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.autoClear = false;

		// Add to the dom
		document.body.appendChild(this.renderer.domElement);

















	    // Launch render
	    requestAnimationFrame(this.render.bind(this));

	    // Emit loaded event
	    this.emit('sceneManagerLoaded');
	}

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

		// this.renderer.render(this.interfaceScene, this.camera);
		// this.renderer.clear();
		// this.composerScene.render();
		
		this.renderVideo.render();
		this.finalcomposer.render();

		this.stats.end();

		// Re-render each frame
		requestAnimationFrame(this.render.bind(this));
	}

	/**
	 * Add an object to the video scene
	 * @param {void}
	 */
	 addVideoScene(object) {
	 	this.videoScene.add(object);
	 }

	/**
	 * Add an object to the interface scene
	 * @param {void}
	 */
	 add(object) {
	 	this.interfaceScene.add(object);;
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
}
