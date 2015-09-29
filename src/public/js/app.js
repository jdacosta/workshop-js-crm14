import DataVisuManager from './dataVisu/DataVisuManager';
import SpeechApiManager from './speechApi/SpeechApiManager.js';
import WebcamRtcManager from './webcamRtc/WebcamRtcManager.js';

class App {
  constructor() {
    this.dataVisuManager = new DataVisuManager();
    this.speechApiManager = new SpeechApiManager();
    this.webcamRtcManager = new WebcamRtcManager();

    this.init();
  }

  init() {
    console.log('initiated');
    this.dataVisuManager.init();
    this.speechApiManager.init();
    this.webcamRtcManager.init();
  }
}

// Iniate main app
(() => {
  let app = new App();
})();
