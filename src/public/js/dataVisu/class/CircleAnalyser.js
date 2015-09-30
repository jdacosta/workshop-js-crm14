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
    this.fusion = 8;
    this.radius = 50;
    this.ease = 0.15;

    // Initiate analyser
    this.init();
  }

  init() {
    // Create gemotry object
    this.geometry = new THREE.Geometry();
    this.geometry.verticesNeedUpdate = true;
    this.geometry.colorsNeedUpdate = true;

    let ecart = this.analyser.frequencyBinCount / this.fusion;
    let colors = [];
    for (let i = 0; i < ecart; i ++ ) {
      colors[i] = new THREE.Color(0xff0000);
      colors[i].setHSL( i / ecart, 1.0, 0.5 );
    }

    colors[ecart] = new THREE.Color(0xff0000);
    colors[ecart].setHSL( 1, 1.0, 0.5 );

    this.geometry.colors = colors;

    let materialConfig = {
      // color: 0xffffff,
      opacity: 0.7,
      linewidth: 1,
      vertexColors: THREE.VertexColors
    };

    this.material = new THREE.LineBasicMaterial(materialConfig);
    this.object = new THREE.Line(this.geometry, this.material);
    this.object.position.z = 5;

    for (let i = 0; i < ecart; i++) {
      let value = this.radius;
      let theta = (i / ecart) * Math.PI * 2;
      let x = (Math.cos(theta) * value);
      let y = (Math.sin(theta) * value);
      this.geometry.vertices.push(new THREE.Vector3(x, y, 0));
    }

    this.geometry.vertices.push(new THREE.Vector3(this.geometry.vertices[0].x, this.geometry.vertices[0].y, 0));
  }

  render() {
    this.analyser.smoothingTimeConstant = 0.95;
    this.analyser.fftSize = 2048;
    this.analyser.getByteTimeDomainData(this.freqs);

    let ecart = this.analyser.frequencyBinCount / this.fusion;

    for (let i = 0; i < ecart; i++) {
      let value = this.radius;
      let moy = 0;
      for (var o = 0; o < this.fusion; o++) {
        moy += this.freqs[i * this.fusion + o];
      }

      moy /= 10;
      value += moy;

      let theta = (i / ecart) * Math.PI * 2;
      let targetX = (Math.cos(theta) * value);
      let targetY = (Math.sin(theta) * value);

      let dx = targetX - this.geometry.vertices[i].x;
      let dy = targetY - this.geometry.vertices[i].y;

      let vx = dx * this.ease;
      let vy = dy * this.ease;

      this.geometry.vertices[i].setX(this.geometry.vertices[i].x + vx);
      this.geometry.vertices[i].setY(this.geometry.vertices[i].y + vy);
    }

    this.geometry.vertices[ecart].set(this.geometry.vertices[0].x, this.geometry.vertices[0].y, 0);

    this.geometry.verticesNeedUpdate = true;
    this.geometry.colorsNeedUpdate = true;

    this.object.rotation.z -= 0.006;
  }

  getObject() {
  	return this.object;
  }
}
