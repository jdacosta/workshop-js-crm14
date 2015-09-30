import THREE from 'three';
import SoundAnalyser from './SoundAnalyser';

export default class InlineAnalyser extends SoundAnalyser {
  constructor(sound, config = {}) {
    super(sound);

    if(config.frame == undefined) {
      config.frame = {};
    }

    // ThreeJS variables
    this.geometry;
    this.material;
    this.object;

    // Objetcs configs
    this.color = config.color || 0xffffff;
    this.margin = config.margin || 20;
    this.fusion = config.fusion || 4;
    this.ease = config.ease || 0.5;
    this.opacity = config.opacity || 1;
    this.linewidth = config.linewidth || 1;
    this.width = config.width || window.innerWidth
    this.height = config.height || window.innerHeight
    this.positionX = config.positionX || 0;
    this.positionY = config.positionY || 0;
    this.grid = config.grid != undefined ? config.grid : true;
    this.rows = config.rows || 4;
    this.columns = config.columns || 10;

    this.espacement = (this.width / (this.analyser.frequencyBinCount/ this.fusion));

    this.group = new THREE.Group();

    // Frame
    this.frame = {
      geometry: null,
      material: null,
      line: null,
      columns: null,
      rows: null,
      config: {
        linewidth: config.frame.linewidth || 1,
        opacity: config.frame.opacity || 1,
        color: config.frame.color || 0xffffff
      }
    };

    // Initiate analyser
    this.init();
  }

  init() {
    this.initAnalyser();
    this.initFrame();

    if(this.grid) {
      this.drawGrid();
    }
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
      transparent: true,
      opacity: this.opacity,
      linewidth: this.linewidth
    });

    // Create object
    this.object = new THREE.Line(this.geometry, this.material);

    // Group position
    this.group.position.y = (-window.innerHeight / 2) + this.positionY + 10;
    this.group.position.x = (-window.innerWidth / 2) + this.positionX;

    this.group.add(this.object);

    // Initialize the curve
    let ecart = this.analyser.frequencyBinCount / this.fusion;
    for (let i = 0; i < ecart; i++) {
      let value = this.height / 2;
      let theta = (i / ecart) * Math.PI * 2;
      let x = i + this.espacement;
      let y = value;
      this.geometry.vertices.push(new THREE.Vector3(x, y, 0));
    }
  }

  drawGrid() {
    // Create frame material
    let material = new THREE.LineBasicMaterial({
      color: this.grid.color || 0xffffff,
      transparent: true,
      opacity: this.grid.opacity || 0.2,
      linewidth: this.grid.linewidth || 0.5
    });

    // Create geometry object

    let espacement = this.width / (this.columns + 1);

    // Create columns
    for (var i = 0; i < this.columns; i++) {
      let geometry = new THREE.Geometry();

      geometry.vertices.push(new THREE.Vector3(i * espacement + espacement, 0, 0));
      geometry.vertices.push(new THREE.Vector3(i * espacement + espacement, this.height, 0));
      let column = new THREE.Line(geometry, material);

      this.group.add(column);
    }

    espacement = this.height / (this.rows + 1);

    // Create rows
    for (var i = 0; i < this.rows; i++) {
      let geometry = new THREE.Geometry();

      geometry.vertices.push(new THREE.Vector3(0, i * espacement + espacement, 0));
      geometry.vertices.push(new THREE.Vector3(this.width, i * espacement + espacement, 0));

      let row = new THREE.Line(geometry, material);

      row.position.x = 0;
      row.position.y = 0;

      this.group.add(row);
    }
  }

  /**
   * Draw a frame around the curve
   * @return {void}
   */
  initFrame() {
    // Create frame material
    this.frame.material = new THREE.LineBasicMaterial({
        color: this.frame.config.color,
        transparent: true,
        opacity: this.frame.config.opacity,
        linewidth: this.frame.config.linewidth
    });

    // Create geometry object
    this.frame.geometry = new THREE.Geometry();

    // Add vertices
    this.drawFrame();

    // Create line
    this.frame.line = new THREE.Line(this.frame.geometry, this.frame.material);

    this.group.add(this.frame.line);

    // Frame position
    this.frame.line.position.y = 0;
    this.frame.line.position.x = 0;
  }

  drawFrame() {
    this.frame.geometry.vertices = [];

    // Bottom Left
    this.frame.geometry.vertices.push(new THREE.Vector3(0, 0, 0));

    // Top Left
    this.frame.geometry.vertices.push(new THREE.Vector3(0, this.height, 0));

    // Top Right
    this.frame.geometry.vertices.push(new THREE.Vector3(this.width, this.height, 0));

    // Bottom Right
    this.frame.geometry.vertices.push(new THREE.Vector3(this.width, 0, 0));

    // Close Bottom Left
    this.frame.geometry.vertices.push(new THREE.Vector3(0, 0, 0));
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
    // this.drawFrame();

    this.geometry.verticesNeedUpdate = true;
  }

  getObject() {
  	return this.group;
  }
}
