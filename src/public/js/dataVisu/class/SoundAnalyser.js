export default class SoundAnalyser {
  constructor(sound) {
    // The sound and analyser variables
    this.sound = sound;
    this.context = this.sound.sourceNode.context;
    this.source = this.sound.sourceNode;
    this.analyser;
    this.freqs = [];

    this.createAnalyser();
  }

  createAnalyser() {
    this.sound.on('loop', (event) => {
      this.source = event.currentTarget.sourceNode;

      // Connecte source to the analyser
      this.source.connect(this.analyser);
    });

    // Create Analyser
    this.analyser = this.context.createAnalyser();

    // Connecte source to the analyser
    this.source.connect(this.analyser);

    // Connect analyser
    this.analyser.connect(this.context.destination);

    // Get frequences
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
  }

  setSound(sound) {
    this.sound = sound;
    this.source = this.sound.sourceNode;
    // Connecte source to the analyser
    this.source.connect(this.analyser);
  }

}
