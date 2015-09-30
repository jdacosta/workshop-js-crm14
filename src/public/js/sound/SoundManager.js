import SoundJs from 'soundjs';
import Events from 'events';

const EventEmitter = Events.EventEmitter;

class SoundManager extends EventEmitter {
	constructor() {
		super();

		this.sounds = [{
			path: '../assets/sounds/broken-robot.wav',
			name: 'broken-robot'
		}, {
			path: '../assets/sounds/bugs.wav',
			name: 'bugs'
		}, {
			path: '../assets/sounds/nurning-man.wav',
			name: 'burning-man'
		}, {
			path: '../assets/sounds/un-momento.mp3',
			name: 'un-momento'
		}];

		this.count = 0;
		this.soundMute = false;
	}

	init() {
		// Events
		SoundJs.Sound.on('fileload', this.loadHandler, this);
		// Loads all sounds
		this.loadSounds();
	}

	loadSounds() {
		this.sounds.map((sound) => {
			SoundJs.Sound.registerSound(sound.path, sound.name);
		});
	}

	loadHandler(event) {
		this.count++;

		this.emit('soundLoaded');

		if(this.count == this.sounds.length) {
			this.emit('soundManagerLoaded')
		}
	}

  handleComplete(event) {
    this.emit('handleComplete');
  }

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

export default SoundManager;
