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

  createMesh(originalGeometry, scale, x, y, z) {
      var i,
          vertices = originalGeometry.vertices,
          origin = _.random(0, vertices.length);

      this.geometry = new THREE.Geometry();
      for (i = 0; i < vertices.length; i ++) {
          var p = vertices[i];
          this.distance[i] = {index: i, distance: vertices[origin].distanceTo(vertices[i])};
          this.geometry.vertices[i] = p.clone();
      }
      this.length = this.geometry.vertices.length;
      this.distance = _.sortBy(this.distance, 'distance');


      var colors = [];
      for(i = 0; i < this.length; i++) {
          colors[this.distance[i].index] = new THREE.Color(0xA3A2BC);
      }
      this.geometry.colors = colors;

      this.mesh = new THREE.PointCloud(this.geometry, new THREE.PointCloudMaterial({ size: 22, blending: THREE.AdditiveBlending, vertexColors: THREE.VertexColors }));
      this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = scale;
      this.mesh.position.x = x;
      this.mesh.position.y = y;
      this.mesh.position.z = z;
      this.parent.add(this.mesh);
  }

  initObjects() {
    let manager = new THREE.LoadingManager();
    manager.onProgress = ( item, loaded, total ) => {
      console.log( item, loaded, total );
    };

    // this.texture = new THREE.Texture();
    // let imageLoader = new THREE.ImageLoader(manager);
    // imageLoader.load( 'assets/data/textures/UV_Grid_Sm.jpg', (image) => {
    //   this.texture.image = image;
    //   this.texture.needsUpdate = true;
    // });

    this.parent = new THREE.Object3D();

    let material = new THREE.MeshLambertMaterial({
      color: 0x2194CE,
      transparent: true,
      opacity: 0.5,
      map: THREE.ImageUtils.loadTexture( "assets/data/textures/UV_Grid_Sm.jpg" )
    });

    let materials = [material];
    let meshFaceMaterial = new THREE.MeshFaceMaterial( materials );

    let loader = new THREE.OBJLoader(manager);
    loader.load('assets/data/3dObjects/french-tech.obj', (object) => {
      this.frenchTech = object;
      this.frenchTech.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            console.log('Add material');
            child.material = material;
          }
      });
      this.frenchTech.material = material;
      console.log(this.frenchTech);
      this.frenchTech.scale.set(40, 40, 40);
      this.frenchTech.position.z = 100;
      this.SceneManager.add(this.frenchTech);
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
      radius: 80,
      positionX: (window.innerWidth - 160),
      positionY: -100
    });
    this.SceneManager.add(this.cube.getObject());
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
    // this.SceneManager.add(this.smallAnalayser1.getFrame());
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

    // French tech
    if(this.frenchTech) {
      this.frenchTech.rotation.y += 0.01;
    }

    // Small analysers
    this.smallAnalayser1.render();

    this.inlineAnalyser.render();
  }
}

export default DataVisuManager;
