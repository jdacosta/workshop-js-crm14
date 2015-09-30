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
    this.margin = 20;
    this.radius = 50;
    this.fusion = 4;
    this.ease = 0.2;
    this.windowWidth = window.innerWidth;
    this.espacement = ((this.windowWidth - (this.margin * 2)) / (this.analyser.frequencyBinCount/ this.fusion));

    // Frame
    this.frame = {
      geometry: null,
      material: null,
      line: null
    };

    // Initiate analyser
    this.init();
  }

  init() {
    this.initAnalyser();
    this.initFrame();
  }

  initAnalyser() {
    // Create gemotry object
    this.geometry = new THREE.Geometry();

    // For colors
    let colors = [];
    for (let i = 0; i < this.analyser.frequencyBinCount; i ++ ) {
      colors[i] = new THREE.Color( this.color );
      colors[i].setHSL( i / this.analyser.frequencyBinCount, 1.0, 0.5 );
    }

    // Add colors
    this.geometry.colors = colors;

    // Add materials
    this.material = new THREE.LineBasicMaterial({
      color: this.color,
      opacity: 0.7,
      linewidth: 1
    });

    // Create object
    this.object = new THREE.Line(this.geometry, this.material);

    // Object position
    this.object.position.y = -window.innerHeight / 2 + this.margin;
    this.object.position.x = -window.innerWidth / 2 + this.margin;

    // Initialize the curve
    let ecart = this.analyser.frequencyBinCount / this.fusion;
    for (let i = 0; i < ecart; i++) {
      let value = this.radius;
      let theta = (i / ecart) * Math.PI * 2;
      let x = i + this.espacement;
      let y = value;
      this.geometry.vertices.push(new THREE.Vector3(x, y, 0));
    }
  }

  initFrame() {
    // Create frame material
    this.frame.material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 1
    });
    
    // Create geometry object
    this.frame.geometry = new THREE.Geometry();
      
    // Add vertices
    this.drawFrame();

    // Create line
    this.frame.line = new THREE.Line(this.frame.geometry, this.frame.material);

    // Frame position
    this.frame.line.position.y = -window.innerHeight / 2;
    this.frame.line.position.x = -window.innerWidth / 2;
  }

  drawFrame() {
    this.frame.geometry.vertices = [];

    // Bottom Left
    this.frame.geometry.vertices.push(new THREE.Vector3(this.margin, this.margin, 0));

    // Top Left
    this.frame.geometry.vertices.push(new THREE.Vector3(this.margin, 150, 0));

    // Top Right
    this.frame.geometry.vertices.push(new THREE.Vector3((window.innerWidth - this.margin), 150, 0));

    // Bottom Right
    this.frame.geometry.vertices.push(new THREE.Vector3((window.innerWidth - this.margin), this.margin, 0));

    // Close Bottom Left
    this.frame.geometry.vertices.push(new THREE.Vector3(this.margin, this.margin, 0));
  }

  render() {
    this.analyser.smoothingTimeConstant = 0.95;
    this.analyser.fftSize = 2048;
    this.analyser.getByteTimeDomainData(this.freqs);

    let ecart = this.analyser.frequencyBinCount / this.fusion;

    for (let i = 0; i < ecart; i++) {
      let value = 0;
      let moy = 0;
      for (var o = 0; o < this.fusion; o++) {
        moy += this.freqs[i * this.fusion + o];
      }

      moy /= 10;
      value = moy;

      let x = i * this.espacement;
      let targetY = value;
      let dy = targetY - this.geometry.vertices[i].y;
      let vy = dy * this.ease;

      this.geometry.vertices[i].setX(x);
      this.geometry.vertices[i].setY(this.geometry.vertices[i].y + vy);
    }

    // Re-render the frame
    this.drawFrame();

    this.geometry.verticesNeedUpdate = true;
  }

  getFrame() {
    return this.frame.line;
  }

  getObject() {
  	return this.object;
  }
}
