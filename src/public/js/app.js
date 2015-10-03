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

    // enable speechapi
    this.speechApiManager = new SpeechApiManager();

    // enable webcamRTC manager
    this.webcamRtcManager = new WebcamRtcManager();
    this.webcamRtcManager.on('motionDetecting', this.onMotionDetecting.bind(this));

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
    console.log('[EVENT] onMotionDetecting')
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

    // play background sound
    let sound = this.soundManager.playSound('sound1', 1, 1);
    let sound2 = this.soundManager.playSound('sound2', 1, 1);

    // init data visu manager
    this.dataVisuManager.init(sound);
    this.dataVisuManager.initSmallAnalyser1(sound2);

    // exemple d'appel pour changer un mot clé
    setTimeout(() => {
      this.interface.setWord('Salut !');
    }, 5000);
    setTimeout(() => {
      this.interface.setWord('Lorem ipsum dolor sit amet');
    }, 10000);

    // listen render
    this.sceneManager.on('render', this.render.bind(this));
  }

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
