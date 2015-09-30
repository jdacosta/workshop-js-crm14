import Events from 'events';
import SceneManager from './scene/SceneManager';
import DataVisuManager from './dataVisu/DataVisuManager';
//import SpeechApiManager from './speechApi/SpeechApiManager.js';
//import SoundManager from './sound/SoundManager';
import WebcamRtcManager from './webcamRtc/WebcamRtcManager.js';

const EventEmitter = Events.EventEmitter;

class App extends EventEmitter {

  constructor() {
    super();

    this.sceneManager = new SceneManager();
    this.dataVisuManager = new DataVisuManager(this.sceneManager);
    //this.soundManager = new SoundManager();
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
    // Init dataVisuManager
    this.dataVisuManager.init();

    // Listen render event
    this.sceneManager.on('render', this.render.bind(this));

    // Listen event and Init SoundManager
    //this.soundManager.on('soundManagerLoaded', this.onSoundManagerLoaded.bind(this));
    //this.soundManager.init();
  }

  onSoundManagerLoaded() {
    //this.soundManager.playSound('bugs', 0.5);
  }

  render() {
    this.dataVisuManager.render();
  }
}

// Iniate main app
(() => {
  let app = new App();
})();
