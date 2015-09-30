// import VoiceGraph from './class/VoiceGraph';
import CircleAnalyser from './class/CircleAnalyser';
import CirclePlaneAnalyser from './class/CirclePlaneAnalyser';
import InlineAnalyser from './class/InlineAnalyser';
import Video from './class/Video';

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
    this.circlePlaneAnalyser;
    this.inlineAnalyser;
    this.backgroundAnalyserTransparent;
    this.video;

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
  }

  initVideo() {
    // Video
    this.video = new Video();
    this.SceneManager.add(this.video.getObject());
  }

  initAnalysers(sound) {
    // Create graph
    this.circleAnalyser = new CirclePlaneAnalyser(sound, 0.45, true);
    this.SceneManager.add(this.circleAnalyser.getObject());

    this.circlePlaneAnalyser = new CircleAnalyser(sound, 0.45, true);
    this.SceneManager.add(this.circlePlaneAnalyser.getObject());

    // Create sub transparent graph
    // this.backgroundAnalyserTransparent = new CircleAnalyser(sound, 0.45, false, 1.02);
    // this.SceneManager.add(this.backgroundAnalyserTransparent.getObject());

    // Create second graphs
    this.inlineAnalyser = new InlineAnalyser(sound, 1);
    this.SceneManager.add(this.inlineAnalyser.getObject());
    this.SceneManager.add(this.inlineAnalyser.getFrame());
  }

  render() {
    this.circleAnalyser.render();
    this.circlePlaneAnalyser.render();
    this.inlineAnalyser.render();
    // this.backgroundAnalyserTransparent.render();
  }
}

export default DataVisuManager;
