import Events from 'events';
import DataVisuManager from './dataVisu/DataVisuManager';
import Interface from './interface/Interface';
import SceneManager from './scene/SceneManager';
import SpeechApiManager from './speechApi/SpeechApiManager';
import SoundManager from './sound/SoundManager';
import WebcamRtcManager from './webcamRtc/WebcamRtcManager';

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

    // authors
    console.log('________________________________________');
    console.log('_______________ Crée par _______________');
    console.log('_______ Julien Martins Da Costa ________');
    console.log('__________________ & ___________________');
    console.log('___________ Adrien Scholaert ___________');
    console.log('________________________________________');
    console.log('___________ Gobelins - CRM14 ___________');
    console.log('________________________________________');

    // enable html Interface
    this.interface = new Interface();

    // enable threejs
    this.sceneManager = new SceneManager();
    this.dataVisuManager = new DataVisuManager(this.sceneManager);

    // enable sound manager
    this.soundManager = new SoundManager();

    // enable webcamRTC manager
    this.webcamRtcManager = new WebcamRtcManager();
    this.webcamRtcManager.on('motionDetecting', this.onMotionDetecting.bind(this));
    //this.webcamRtcManager.on('movePosition', this.onChangeSound.bind(this));

    // enable speechapi
    this.speechApiManager = new SpeechApiManager(this.interface, this.webcamRtcManager);

    // initialize app
    this.init();
  }

  /**
   * Initialise la scène webGL
   *
   * @return {void}
   */
  init() {
    this.sceneManager.on('sceneManagerLoaded', this.onSceneManagerLoaded.bind(this));
    this.sceneManager.init();
    this.speechApiManager.init();
  }

  /**
   * Méthode appellée quand un mouvement est détecté
   *
   * @param  {boolean} bool  true lorsqu'un mouvement est detecté
   * @return {void}
   */
  onMotionDetecting(bool) {
    console.log('[EVENT] onMotionDetecting');
    this.interface.setWarningMessage(bool);
    this.sceneManager.setGlitch(bool);
  }

  /**
   * Méthode appelée quand la scène webGL est chargée pour
   * initialiser ensuite le soundManager
   * @return {[type]} [description]
   */
  onSceneManagerLoaded() {
    console.log('[EVENT] onSceneManagerLoaded');
    this.soundManager.on('soundManagerLoaded', this.onSoundManagerLoaded.bind(this));
    this.soundManager.init();
  }

  /**
   * Méthode appellée quand le SoundManager est chargé
   *
   * @return {void}
   */
  onSoundManagerLoaded() {
    console.log('[EVENT] onSoundManagerLoaded');
    let number = Math.floor((Math.random() * 1) + 1);

    // play background sound
    let sound = this.soundManager.playSound('sound' + number, 1, 1);
    let sound2 = this.soundManager.playSound('sound' + number, 1, 1);

    // init data visu manager
    this.dataVisuManager.init(sound);
    this.dataVisuManager.initSmallAnalyser1(sound2);

    // listen render
    this.sceneManager.on('render', this.render.bind(this));
  }

  /*onChangeSound() {
    console.log('[EVENT] onChangeSound');
    let number = Math.floor((Math.random() * 9) + 1);

    // play background sound
    let sound = this.soundManager.playSound('sound' + number, 1, 1);
    let sound2 = this.soundManager.playSound('sound' + number, 1, 1);

    // init data visu manager
    this.dataVisuManager.updateSound(sound);
    //this.dataVisuManager.initSmallAnalyser1(sound2);
  }*/

  /**
   * Rendre la scène
   *
   * @return {void}
   */
  render() {
    this.dataVisuManager.render();
  }
}

// Initiate main app
(() => {
  let app = new App();
})();
