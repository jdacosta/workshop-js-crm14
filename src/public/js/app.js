import Events from 'events';
import SceneManager from './scene/SceneManager';
import DataVisuManager from './dataVisu/DataVisuManager';
//import SpeechApiManager from './speechApi/SpeechApiManager.js';
import SoundManager from './sound/SoundManager';
import WebcamRtcManager from './webcamRtc/WebcamRtcManager.js';

const EventEmitter = Events.EventEmitter;

class App extends EventEmitter {

  constructor() {
    super();

    this.sceneManager = new SceneManager();
    this.dataVisuManager = new DataVisuManager(this.sceneManager);
    this.soundManager = new SoundManager();
    //this.speechApiManager = new SpeechApiManager();
    this.webcamRtcManager = new WebcamRtcManager();

    // initialize app
    this.init();
  }

  init() {
    this.sceneManager.on('sceneManagerLoaded', this.onSceneManagerLoaded.bind(this));
    this.sceneManager.init();
    //this.speechApiManager.init();
    //this.webcamRtcManager.init();
  }

  onSceneManagerLoaded() {
    // Listen event and Init SoundManager
    this.soundManager.on('soundManagerLoaded', this.onSoundManagerLoaded.bind(this));
    this.soundManager.init();
  }

  /**
   * SounsManager loaded
   * @return {void}
   */
  onSoundManagerLoaded() {
    // Play background sound
    let sound = this.soundManager.playSound('bugs', 0, 1);
    let sound2 = this.soundManager.playSound('burning-man', 0, 1);

    // Init data visu manager
    this.dataVisuManager.init(sound);
    this.dataVisuManager.initSmallAnalyser1(sound2);

    // Listen render
    this.sceneManager.on('render', this.render.bind(this));
  }

  render() {
    this.dataVisuManager.render();
  }
}

// Iniate main app
(() => {
  let app = new App();
})();
