import THREE from 'ThreeJS';
import VoiceGraph from './class/VoiceGraph';
import Stats from 'stats.js';

/**
 * DataVisuManager
 * Manage ThreeJS Graphics
 */
class DataVisuManager {
  /**
   * Constructor
   * @return {}
   */
  constructor() {
    this.voiceGprah;

    // Data (voice, music stream...)
    this.data = {
      voice: [],
      music: []
    };

    // THREE variables
    this.scene;
    this.camera;
    this.renderer;
    this.geometry;
    this.material;
    this.mesh;

    // Stats
    this.stats;
  }

  /**
   * Init DataVisuManager
   * @return {void}
   */
   init() {
    // Init Stats only in dev mode
    this.initStats();

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 1000;

    this.geometry = new THREE.BoxGeometry( 200, 200, 200 );
    this.material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });

    // Create graphs
    // this.voiceGprah = new VoiceGraph(this.data.voice);
    this.mesh = new THREE.Mesh( this.geometry, this.material );

    // Add objetcs to the scene
    this.scene.add( this.mesh );

    // Config renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    // Add to the dom
    document.body.appendChild( this.renderer.domElement );
  }

  /**
   * Three JS Render
   * @return {void}
   */
  render() {
    stats.begin();

    // this.voiceGprah.render();
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;

    this.renderer.render( this.scene, this.camera );

    stats.end();

    // Re-render each frame
    requestAnimationFrame( this.render );
  }

  /**
   * Init Stats for debug
   * @return {void}
   */
  initStats() {
    // Stats
    this.stats = new Stats();
    this.stats.setMode( 1 ); // 0: fps, 1: ms, 2: mb

    // Align top-left
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';

    document.body.appendChild( stats.domElement );
  }
}

export default DataVisuManager;
