import Events from 'events';
import SceneManager from './scene/SceneManager';
import DataVisuManager from './dataVisu/DataVisuManager';
import SpeechApiManager from './speechApi/SpeechApiManager.js';
import SoundManager from './sound/SoundManager';
import WebcamRtcManager from './webcamRtc/WebcamRtcManager.js';
import Interface from './interface/Interface.js';

const EventEmitter = Events.EventEmitter;

/**
 * App - main class to launch our awesome French Tech Interface
 */
class App extends EventEmitter {

  /**
   * Constructor - instancie les objets nécessaire à l'app
   * @return {void}
   */
  constructor() {
    super();

    console.log('________________________________________');
    console.log('_______________ Crée par _______________');
    console.log('____________ Julien Da Costa ___________');
    console.log('__________________ & ___________________');
    console.log('___________ Adrien Scholaert ___________');
    console.log('________________________________________');
    console.log('___________ Gobelins - CRM14 ___________');
    console.log('________________________________________');

    // Enable Html Interface
    this.interface = new Interface();

    this.sceneManager = new SceneManager();
    this.dataVisuManager = new DataVisuManager(this.sceneManager);
    this.soundManager = new SoundManager();
    this.speechApiManager = new SpeechApiManager();
    this.webcamRtcManager = new WebcamRtcManager();
    this.webcamRtcManager.on('motionDetecting', this.onMotionDetecting.bind(this));

    // initialize app
    this.init();
  }

  /**
   * Initialise la scène webgl
   * @return {void}
   */
  init() {
    this.sceneManager.on('sceneManagerLoaded', this.onSceneManagerLoaded.bind(this));
    this.sceneManager.init();
    this.speechApiManager.init();
  }

  /**
   * Méthode appellé quand un movuement est détecté
   * @param  {boolean} bool
   * @return {void}
   */
  onMotionDetecting(bool) {
    this.interface.setWarningMessage(bool);
    this.sceneManager.setGlitch(bool);
  }

  /**
   * Méthode appelé quand la scène webgl est chagé
   * Initialise ensuite le soundManager
   * @return {[type]} [description]
   */
  onSceneManagerLoaded() {
    console.log('onSceneManagerLoaded');
    // Listen event and Init SoundManager
    this.soundManager.on('soundManagerLoaded', this.onSoundManagerLoaded.bind(this));
    this.soundManager.init();
  }

  /**
   * Quand le SoundManager est chargé
   * @return {void}
   */
  onSoundManagerLoaded() {
    console.log('onSoundManagerLoaded');

    // Play background sound
    let sound = this.soundManager.playSound('music', 1, 1);
    let sound2 = this.soundManager.playSound('burning-man', 1, 1);

    // Init data visu manager
    this.dataVisuManager.init(sound);
    this.dataVisuManager.initSmallAnalyser1(sound2);

    // Exemple d'appel pour changer un mot clé
    setTimeout(() => {
      this.interface.setWord('Salut !');
    }, 5000);
    setTimeout(() => {
      this.interface.setWord('Lorem ipsum dolor sit amet');
    }, 10000);

    // Listen render
    this.sceneManager.on('render', this.render.bind(this));
  }

  render() {
    this.dataVisuManager.render();
  }
}

// Initiate main app
(() => {
  let app = new App();
})();
