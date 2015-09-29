import THREE from 'three';

class SoundAnalyser {
  constructor(sound, size, color) {
    // Configs
    this.config = {
      color: '#36babc',
      strokeSize: 2
    };

    // ThreeJS variables
    this.geometry;
    this.material;
    this.object;

    // The sound and analyser variables
    this.sound = sound;
    this.context = this.sound.sourceNode.context;
    this.source = this.sound.sourceNode;
    this.analyser;
    this.freqs = [];

    // Objetcs configs
    this.size = size || 1;  
    this.color = color || 0xffffff;  

    // Initiate analyser
    this.init();
  }

  init() {
    // this.source.connect(this.context.destination);

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

    // Create gemotry object
    this.geometry = new THREE.Geometry();

    let colors = [];
    for (let i = 0; i < this.analyser.frequencyBinCount; i ++ ) {
      colors[i] = new THREE.Color( this.color );
      colors[i].setHSL( i / this.analyser.frequencyBinCount, 1.0, 0.5 );
    }

    this.geometry.colors = colors;

    this.material = new THREE.LineBasicMaterial({
      color: this.color,
      opacity: 0.7,
      linewidth: 1,
      vertexColors: THREE.VertexColors
    });

    this.object = new THREE.Line(this.geometry, this.material);
  }

  render() {
    this.analyser.smoothingTimeConstant = 0.8;
    this.analyser.fftSize = 2048;
    this.analyser.getByteFrequencyData(this.freqs);

    // Clear vertices
    this.geometry.vertices = [];
    let ratio = ratio = Math.max(...this.freqs) / 100;
    let ecart = this.analyser.frequencyBinCount / 4;

    for (let i = 0; i < ecart; i++) {
      let moy = (this.freqs[i * 4] + this.freqs[i * 4 + 1] + this.freqs[i * 4 + 2] + this.freqs[i * 4 + 3]);
      let value = moy * this.size;

      let theta = (i / ecart) * Math.PI * 2;
      let x = (Math.cos(theta) * value);
      let y = (Math.sin(theta) * value);
      this.geometry.vertices.push(new THREE.Vector3(x, y, 0));
    }

    this.geometry.verticesNeedUpdate = true;
    this.object.rotation.z -= 0.006;
  }

  setSound(sound) {
  	this.sound = sound;
    this.source = this.sound.sourceNode;
    // Connecte source to the analyser
    this.source.connect(this.analyser);
  }

  getObject() {
  	return this.object;
  }
}

export default SoundAnalyser;
