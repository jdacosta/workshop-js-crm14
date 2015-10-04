import Events from 'events';
import SoundJs from 'soundjs';

const EventEmitter = Events.EventEmitter;

export default class SoundManager extends EventEmitter {

  /**
   * Constructor - intialise les attributs
   *
   * @return {void}
   */
  constructor() {
    super();

    // initialize
    this.count = 0;
    this.soundMute = false;
    this.sounds = [{
      path: '../assets/sounds/sound1.mp3',
      name: 'sound1'
    }, {
      path: '../assets/sounds/sound2.mp3',
      name: 'sound2'
    }, {
      path: '../assets/sounds/sound3.mp3',
      name: 'sound3'
    }, {
      path: '../assets/sounds/sound4.mp3',
      name: 'sound4'
    }, {
      path: '../assets/sounds/sound5.mp3',
      name: 'sound5'
    }, {
      path: '../assets/sounds/sound6.mp3',
      name: 'sound6'
    }, {
      path: '../assets/sounds/sound7.mp3',
      name: 'sound7'
    }/*, {
      path: '../assets/sounds/sound8.mp3',
      name: 'sound8'
    }, {
      path: '../assets/sounds/sound9.mp3',
      name: 'sound9'
    }*/];
  }

  /**
   * Initialisation - chargement des sons
   *
   * @return {void}
   */
  init() {

    // add event listener
    SoundJs.Sound.on('fileload', this.loadHandler, this);

    // loads all sounds
    this.loadSounds();
  }

  /**
   * Charges les sons
   *
   * @return {void}
   */
  loadSounds() {
    this.sounds.map((sound) => {
      SoundJs.Sound.registerSound(sound.path, sound.name);
    });
  }

  /**
   * A chaque son chargé, on emet un event
   *
   * @param  {event} event
   * @return {void}
   */
  loadHandler(event) {
    this.count++;
    console.log('[EVENT] soundLoaded')
    this.emit('soundLoaded');
    if(this.count == this.sounds.length) {
      console.log('[EVENT] soundManagerLoaded');
      this.emit('soundManagerLoaded')
    }
  }

  /**
   * Gestion des évenements quand tout est OK
   *
   * @param  {event} event  reception de l'évenement
   * @return {void}
   */
  handleComplete(event) {
    this.emit('handleComplete');
  }

  /**
   * Permet de jouer un son
   *
   * @param  {string} soundID L'id du son à jouer
   * @param  {float} volume  L'intensité du volume
   * @param  {boolean} loop    Si le son doit se jouer en boucle
   * @return {SoundJS}
   */
  playSound(soundID, volume, loop) {
    let sound;

    if (loop) {
        sound = SoundJs.Sound.play(soundID, null, null, null, -1);
    } else {
        sound = SoundJs.Sound.play(soundID);
    }

    if (!this.soundMute) {
        sound.volume = volume;
    } else {
        sound.volume = 0;
    }

    sound.on('complete', this.handleComplete, this);

    return sound;
  }
}
