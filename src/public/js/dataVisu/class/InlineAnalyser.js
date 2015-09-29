import THREE from 'three';
import SoundAnalyser from './SoundAnalyser';

export default class InlineAnalyser extends SoundAnalyser {
  constructor(sound, size, color) {
    super(sound);

    // ThreeJS variables
    this.geometry;
    this.material;
    this.object;

    // Objetcs configs
    this.color = color || 0xffffff;

    this.fusion = 1;
    this.windowWidth = window.innerWidth;
    this.espacement = (this.windowWidth / (this.analyser.frequencyBinCount/ this.fusion));

    // Initiate analyser
    this.init();
  }

  init() {
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
      linewidth: 1
    });

    this.object = new THREE.Line(this.geometry, this.material);
    this.object.position.y = -window.innerHeight / 2;
    this.object.position.x = -window.innerWidth / 2;
  }

  render() {
    this.analyser.smoothingTimeConstant = 0.95;
    this.analyser.fftSize = 2048;
    this.analyser.getByteFrequencyData(this.freqs);

    // Clear vertices
    this.geometry.vertices = [];
    let ratio = Math.max(...this.freqs) / 100;
    let ecart = this.analyser.frequencyBinCount / this.fusion;

    for (let i = 0; i < ecart; i++) {
      let moy = 0;

      for (var o = 0; o < this.fusion; o++) {
        moy += this.freqs[i * this.fusion + o];
      }

      let value = moy;
      let x = i * this.espacement;
      let y = value;
      this.geometry.vertices.push(new THREE.Vector3(x, y, 0));
    }

    this.geometry.verticesNeedUpdate = true;
  }

  getObject() {
  	return this.object;
  }
}
