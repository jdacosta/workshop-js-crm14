import SoundJs from 'soundjs';
import Events from 'events';

const EventEmitter = Events.EventEmitter;

export default class SoundManager extends EventEmitter {
	
	/**
	 * Constructor - intialise les attributs
	 * @return {void}
	 */
	constructor() {
		super();

		this.sounds = [{
			path: '../assets/sounds/test.mp3',
			name: 'broken-robot'
		}, {
			path: '../assets/sounds/test.mp3',
			name: 'bugs'
		}, {
			path: '../assets/sounds/test.mp3',
			name: 'burning-man'
		}, {
			path: '../assets/sounds/test.mp3',
			name: 'music'
		}];

		this.count = 0;
		this.soundMute = false;
	}

	/**
	 * Initialisation - chargement des sons
	 * @return {void}
	 */
	init() {

		// Add Event listener
		SoundJs.Sound.on('fileload', this.loadHandler, this);
		
		// Loads all sounds
		this.loadSounds();
	}

	/**
	 * Charges les sons
	 * @return {void}
	 */
	loadSounds() {
		this.sounds.map((sound) => {
			SoundJs.Sound.registerSound(sound.path, sound.name);
		});
	}

	/**
	 * A chaque son chargé on emet un event
	 * @param  {event} event
	 * @return {void}
	 */
	loadHandler(event) {
		this.count++;

		console.log('sound loaded');
		this.emit('soundLoaded');

		if(this.count == this.sounds.length) {
			console.log('soundManagerLoaded');
			this.emit('soundManagerLoaded')
		}
	}

  handleComplete(event) {
    this.emit('handleComplete');
  }

  /**
   * Permet de  jouer un son
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

    sound.on("complete", this.handleComplete, this);

    return sound;
  }
}
