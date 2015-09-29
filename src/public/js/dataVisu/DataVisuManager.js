import VoiceGraph from './class/VoiceGraph';

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
    this.voiceGprah;

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
    // Create graphs
    this.voiceGprah = new VoiceGraph(this.data.voice);
    
    // Add objetcs to the scene
    this.SceneManager.add(this.voiceGprah.getObject());
  }

  render() {
    this.voiceGprah.render();
  }
}

export default DataVisuManager;
