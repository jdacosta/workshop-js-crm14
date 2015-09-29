// import VoiceGraph from './class/VoiceGraph';
import CircleAnalyser from './class/CircleAnalyser';
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
    this.backgroundAnalyser;
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
   init() {
     // Video
     this.video = new Video();
     this.SceneManager.add(this.video.getObject());
  }

  initBackgroundGraphSound(sound) {

    // Create graph
    this.backgroundAnalyser = new CircleAnalyser(sound, 0.45, true);
    this.SceneManager.add(this.backgroundAnalyser.getObject());

    // Create sub transparent graph
    this.backgroundAnalyserTransparent = new CircleAnalyser(sound, 0.45, false, 1.02);
    this.SceneManager.add(this.backgroundAnalyserTransparent.getObject());

    // Create second graphs
    this.inlineAnalyser = new InlineAnalyser(sound, 1);
    this.SceneManager.add(this.inlineAnalyser.getObject());
    this.SceneManager.add(this.inlineAnalyser.frame());
  }

  render() {
    this.backgroundAnalyser.render();
    this.inlineAnalyser.render();
    this.backgroundAnalyserTransparent.render();
    // this.video.render();
  }
}

export default DataVisuManager;
