import THREE from 'three';
import Events from 'events';
import Stats from 'stats.js';

const EventEmitter = Events.EventEmitter;

class SceneManager extends EventEmitter {
	
	constructor() {
		super();

		// ThreeJS
		this.scene;
  	this.camera;
  	this.renderer;

    // Stats
    this.stats;
	}

	init() {
    // Init Stats only in dev mode
    this.initStats();

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 1000;

      // Config renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Add to the dom
    document.body.appendChild(this.renderer.domElement);

    // Launch render
    requestAnimationFrame(this.render.bind(this));

    // Emit loaded event
    this.emit('sceneManagerLoaded');
	}

	/**
	* Three JS Render
	* @return {void}
	*/
	render() {
		this.stats.begin();

		this.emit('render');
		this.renderer.render(this.scene, this.camera);

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

	add(object) {
		return this.scene.add(object);;
	}
} 

export default SceneManager;
