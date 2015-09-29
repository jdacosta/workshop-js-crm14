// import VoiceGraph from './class/VoiceGraph';
import SoundAnalyser from './class/SoundAnalyser';

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
    this.voiceAnalyser;

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
    // Create graphs
    this.backgroundAnalyser = new SoundAnalyser(sound);
    this.SceneManager.add(this.backgroundAnalyser.getObject());

    // Create second graphs
    this.voiceAnalyser = new SoundAnalyser(sound, 1.5, 0xffff00);
    this.SceneManager.add(this.voiceAnalyser.getObject());
  }

  render() {
    this.backgroundAnalyser.render();
    this.voiceAnalyser.render();
  }
}

export default DataVisuManager;
