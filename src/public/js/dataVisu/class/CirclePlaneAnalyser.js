import THREE from 'three';
import SoundAnalyser from './SoundAnalyser';

export default class CirclePlaneAnalyser extends SoundAnalyser {
  constructor(sound, config) {
    super(sound);

    // ThreeJS variables
    this.geometry;
    this.material;
    this.object;
    this.group;
    this.planes = [];

    // Visual configs
    this.particuleSize = config.particuleSize || 1;
    this.color = config.color || 0xffff00;
    this.ease = config.ease || 0.35;
    this.rotation = config.rotation || 0.006; 
    this.division = config.division || 5;
    this.fusion = config.fusion || 4;
    this.opacity = config.opacity || 1;
    
    this.radius = window.innerHeight / 4 - 30;
    this.ecart = this.analyser.frequencyBinCount / this.fusion;

    // Initiate analyser
    this.init();
  }

  init() {
    // Create gemotry object
    this.geometry = new THREE.Geometry();
    this.geometry.verticesNeedUpdate = true;
    this.geometry.colorsNeedUpdate = true;

    this.group = new THREE.Group();

    let geometry = new THREE.PlaneGeometry( 2, 2, 32 );

    let material = new THREE.MeshBasicMaterial({
      color: this.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: this.opacity
    });

    for (let i = 0; i < this.ecart; i++) {
      let value = this.radius;
      let theta = (i / this.ecart) * Math.PI * 2;
      let x = (Math.cos(theta) * value);
      let y = (Math.sin(theta) * value);
      let plane = new THREE.Mesh( geometry, material );

      plane.position.x = x;
      plane.position.y = y;
      plane.rotation.z = theta;

      // stocke les planes
      this.planes.push(plane);

      this.group.add(plane);
    }
  }

  render() {
    this.analyser.getByteTimeDomainData(this.freqs);

    for (let i = 0; i < this.ecart; i++) {
      let value = this.radius;
      let moy = 0;
      for (var o = 0; o < this.fusion; o++) {
        moy += this.freqs[i * this.fusion + o];
      }

      moy /= this.division;
      value += moy;

      let theta = (i / this.ecart) * Math.PI * 2;
      let x = (Math.cos(theta) * value);
      let y = (Math.sin(theta) * value);

      let targetX = (Math.cos(theta) * value);
      let targetY = (Math.sin(theta) * value);

      let dx = targetX - this.planes[i].position.x;
      let dy = targetY - this.planes[i].position.y;

      let vx = dx * this.ease;
      let vy = dy * this.ease;

      this.planes[i].scale.x = this.particuleSize;
      this.planes[i].scale.y = this.particuleSize;
      this.planes[i].scale.z = this.particuleSize;

      this.planes[i].position.x += vx;
      this.planes[i].position.y += vy;
    }

    this.group.rotation.z -= this.rotation;
  }

  getObject() {
  	return this.group;
  }
}
