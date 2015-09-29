import THREE from 'three';
import SoundAnalyser from './SoundAnalyser';

export default class CircleAnalyser extends SoundAnalyser {
  constructor(sound, size, color, amplitude) {
    super(sound);

    // ThreeJS variables
    this.geometry;
    this.material;
    this.object;

    // Objetcs configs
    this.size = size || 1;
    this.color = color ? null : true || true;
    this.amplitude = amplitude || 1;
    this.fusion = 4;

    // Initiate analyser
    this.init();
  }

  init() {
    // Create gemotry object
    this.geometry = new THREE.Geometry();

    let materialConfig = {
      color: 0xffffff,
      opacity: 0.7,
      linewidth: 1,
    };

    if(this.color) {
      let colors = [];
      for (let i = 0; i < this.analyser.frequencyBinCount; i ++ ) {
        colors[i] = new THREE.Color(0xffffff);
        colors[i].setHSL( i / this.analyser.frequencyBinCount, 1.0, 0.5 );
      }

      this.geometry.colors = colors;
      materialConfig.vertexColors = THREE.VertexColors;
    }

    this.material = new THREE.LineBasicMaterial(materialConfig);
    this.object = new THREE.Line(this.geometry, this.material);
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

      let value = moy * this.size;

      if(value < 270) {
        value = 270;
      }

      let theta = (i / ecart) * Math.PI * 2;
      let x = (Math.cos(theta) * value) * this.amplitude;
      let y = (Math.sin(theta) * value) * this.amplitude;
      this.geometry.vertices.push(new THREE.Vector3(x, y, 0));
    }

    this.geometry.verticesNeedUpdate = true;
    this.geometry.colorsNeedUpdate = true;
    this.object.rotation.z -= 0.006;
  }

  getObject() {
  	return this.object;
  }
}
