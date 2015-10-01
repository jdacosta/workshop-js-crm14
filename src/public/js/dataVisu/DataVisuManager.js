// import VoiceGraph from './class/VoiceGraph';
import CircleAnalyser from './class/CircleAnalyser';
import CirclePlaneAnalyser from './class/CirclePlaneAnalyser';
import InlineAnalyser from './class/InlineAnalyser';
import Video from './class/Video';
import Cube from './class/Cube';

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

    // Create a cube
    this.cube = new Cube({
      radius: 80,
      positionX: (window.innerWidth - 160),
      positionY: -100
    });
    this.SceneManager.addVideoScene(this.cube.getObject());
  }

  initVideo() {
    // Video
    this.video = new Video();
    this.SceneManager.addVideoScene(this.video.getObject());
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

    // Small analysers
    this.smallAnalayser1.render();

    this.inlineAnalyser.render();
  }
}

export default DataVisuManager;
