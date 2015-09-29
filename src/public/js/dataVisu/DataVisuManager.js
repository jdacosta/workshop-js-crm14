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

    // Add objetcs to the scene
    // this.SceneManager.add(this.voiceGprah.getObject());
  }

  initBackgroundGraphSound(sound) {
    // Video
    this.video = new Video();
    this.SceneManager.add(this.video.getObject());
    
    // Create graph
    this.backgroundAnalyser = new CircleAnalyser(sound, 0.5, true);
    this.SceneManager.add(this.backgroundAnalyser.getObject());

    // Create sub transparent graph
    this.backgroundAnalyserTransparent = new CircleAnalyser(sound, 0.5, false, 1.1, 0.5);
    this.SceneManager.add(this.backgroundAnalyserTransparent.getObject());

    // Create second graphs
    this.inlineAnalyser = new InlineAnalyser(sound, 1);
    this.SceneManager.add(this.inlineAnalyser.getObject());
  }

  render() {
    this.backgroundAnalyser.render();
    this.inlineAnalyser.render();
    this.backgroundAnalyserTransparent.render();
    // this.video.render();
  }
}

export default DataVisuManager;
