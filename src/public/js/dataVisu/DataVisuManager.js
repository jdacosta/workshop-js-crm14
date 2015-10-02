// import VoiceGraph from './class/VoiceGraph';
import CircleAnalyser from './class/CircleAnalyser';
import CirclePlaneAnalyser from './class/CirclePlaneAnalyser';
import InlineAnalyser from './class/InlineAnalyser';
import Video from './class/Video';
import Cube from './class/Cube';
import OBJLoader from '../../data/loader/OBJLoader';
import _ from 'lodash';

/**
 * DataVisuManager
 * Manage ThreeJS Graphics
 */
class DataVisuManager {

  /**
   * Constructor
   * @return {}
   */
  constructor(SceneManager) {
    // Graphics
    this.circleAnalyser;
    this.circle2Analyser;

    this.circleParticulte1Analyser;
    this.circleParticulte2Analyser;
    this.circleParticulte3Analyser;

    this.inlineAnalyser;
    this.backgroundAnalyserTransparent;
    this.video;

    // Objects
    this.cube;
    this.frenchTech;

    // Data (voice, music stream...)
    this.data = {
      voice: [],
      music: [],
    };

    // THREE variables
    this.SceneManager = SceneManager;
  }

  /**
   * Init DataVisuManager
   * @return {void}
   */
  init(sound) {
    this.initVideo();
    this.initAnalysers(sound);
    this.initObjects();
  }

  initObjects() {
    let manager = new THREE.LoadingManager();
    manager.onProgress = ( item, loaded, total ) => {
      console.log( item, loaded, total );
    };

    this.parent = new THREE.Object3D();

    let material = new THREE.MeshLambertMaterial({
      color: 0xbe0d41,
      // // transparent: true,
      // // opacity: 0.5,
    });
    let groupCocq = new THREE.Object3D();

    let loader = new THREE.JSONLoader();
    loader.load('assets/data/3dObjects/frenchtech.json', (object) => {
      
      console.log('________________________________________');
      console.log('________________________________________');
      console.log('______ cocq cocq coquedetteeeee ! ______');
      console.log('________________________________________');
      console.log('________________________________________');

      let mesh2 = new THREE.Mesh(object, material);
      this.frenchTech = mesh2;
      this.frenchTech.material = material;
      this.frenchTech.scale.set(20, 20, 20);
      this.frenchTech.position.z = 100;
      groupCocq.add(this.frenchTech);

      groupCocq.position.x = window.innerWidth / 2 - 230;
      groupCocq.position.y = 100;

      this.SceneManager.add(groupCocq);
    }, (xhr) => {
        if (xhr.lengthComputable) {
            let percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    }, (xhr) => {
        console.log('ERROR THREEJS : Loader error ' + xhr);
    });

    // Create a cube
    this.cube = new Cube({
      radius: 30,
      opacity: 0.3,
      color: 0xffffff,
      wireframe: true,
      positionX: (window.innerWidth - 80),
      positionY: -100,
      rotationX: -0.05,
      rotationY: 0.01,
    });
    this.SceneManager.add(this.cube.getObject());

    // Create a cube
    this.cube2 = new Cube({
      radius: 30,
      opacity: 0.3,
      color: 0xffffff,
      wireframe: true,
      positionX: (window.innerWidth - 160),
      positionY: -100,
      rotationX: -0.05,
      rotationY: 0.05,
    });
    this.SceneManager.add(this.cube2.getObject());

    // Create a cube
    this.cube3 = new Cube({
      radius: 30,
      opacity: 0.3,
      color: 0xffffff,
      wireframe: true,
      positionX: (window.innerWidth - 240),
      positionY: -100,
      rotationX: 0.05,
      rotationY: -0.1,
    });
    this.SceneManager.add(this.cube3.getObject());
  }

  initVideo() {
    // Video
    this.video = new Video();
    this.SceneManager.add(this.video.getObject());
  }

  initAnalysers(sound) {
    // Create particule analyser 1
    this.circleParticulte1Analyser = new CirclePlaneAnalyser(sound, {
      particuleSize: 1,
      color: 0xffff00
    });

    this.SceneManager.add(this.circleParticulte1Analyser.getObject());

    // Create particule analyser 2
    this.circleParticulte2Analyser = new CirclePlaneAnalyser(sound, {
      particuleSize: 3,
      color: 0xff6800,
      opacity: 0.1
    });

    this.SceneManager.add(this.circleParticulte2Analyser.getObject());

    // Create particule analyser 3
    this.circleParticulte3Analyser = new CirclePlaneAnalyser(sound, {
      particuleSize: 1,
      color: 0xffffff,
      opacity: 0.5,
      rotation: -0.01,
      fusion: 4,
      ease: 0.2,
      division: 4
    });

    this.SceneManager.add(this.circleParticulte3Analyser.getObject());

    // Create circle analyser
    this.circleAnalyser = new CircleAnalyser(sound, {
      size: 0.45,
      color: true,
      linewidth: 1.5,
      opacity: 1
    });

    this.SceneManager.add(this.circleAnalyser.getObject());

    // Create second circle analyser
    let radiusCircle2Analyser = (window.innerHeight / 4) + 20;
    this.circle2Analyser = new CircleAnalyser(sound, {
      color: true,
      linewidth: 0.5,
      opacity: 0.25,
      radius: radiusCircle2Analyser
    });

    this.SceneManager.add(this.circle2Analyser.getObject());

    // Create second graphs
    this.inlineAnalyser = new InlineAnalyser(sound, {
      width: 255,
      height: 100,
      opacity: 0.5,
      positionX: (window.innerWidth - 270),
      positionY: (window.innerHeight - 200),
      frame: {
        opacity: 0.5
      }
    });
    this.SceneManager.add(this.inlineAnalyser.getObject());
    // this.SceneManager.add(this.inlineAnalyser.getFrame());
  }

  initSmallAnalyser1(sound) {
    this.smallAnalayser1 = new InlineAnalyser(sound, {
      width: 255,
      height: 50,
      opacity: 0.5,
      color: 0xff0000,
      positionX: 550,
      linewidth: 2,
      division: 20,
      positionX: (window.innerWidth - 270),
      positionY: (window.innerHeight - 300),
      frame: {
        color: 0xff0000,
        opacity: 0.5
      },
      grid: {
        color: 0xff0000,
        opacity: 0.1
      }
    });

    this.SceneManager.add(this.smallAnalayser1.getObject());
  }

  render() {
    this.circleAnalyser.render();
    this.circle2Analyser.render();

    // Render particules analyser
    this.circleParticulte1Analyser.render();
    this.circleParticulte2Analyser.render();
    this.circleParticulte3Analyser.render();

    // Render objects
    this.cube.render();
    this.cube2.render();
    this.cube3.render();

    // French tech
    if (this.frenchTech) {
      this.frenchTech.rotation.y += 0.01;
    }

    // Small analysers
    this.smallAnalayser1.render();

    this.inlineAnalyser.render();
  }
}

export default DataVisuManager;
