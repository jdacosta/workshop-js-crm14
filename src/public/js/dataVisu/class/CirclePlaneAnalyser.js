import THREE from 'three';
import SoundAnalyser from './SoundAnalyser';

export default class CirclePlaneAnalyser extends SoundAnalyser {
  constructor(sound, size, color, amplitude) {
    super(sound);

    // ThreeJS variables
    this.geometry;
    this.material;
    this.object;
    this.group;

    // Objetcs configs
    this.size = size || 1;
    this.color = color ? null : true || true;
    this.amplitude = amplitude || 1;
    this.fusion = 4;
    this.radius = 40;
    this.ease = 0.05;

    this.ecart = this.analyser.frequencyBinCount / this.fusion;

    this.planes = [];

    // Initiate analyser
    this.init();
  }

  init() {
    // Create gemotry object
    this.geometry = new THREE.Geometry();
    this.geometry.verticesNeedUpdate = true;
    this.geometry.colorsNeedUpdate = true;

    this.group = new THREE.Group();
    // this.group.position.y = 50;

    let geometry = new THREE.PlaneGeometry( 2, 2, 32 );
    let material = new THREE.MeshBasicMaterial({
      color: 0xffff00, 
      side: THREE.DoubleSide
    });

  //   let materialConfig = {
  //     // color: 0xffffff,
  //     opacity: 0.7,
  //     linewidth: 1,
  //     vertexColors: THREE.VertexColors
  //   };

  //   this.material = new THREE.LineBasicMaterial(materialConfig);
  //   this.object = new THREE.Line(this.geometry, this.material);
  //   this.object.position.z = 5;

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

  //   this.geometry.vertices.push(new THREE.Vector3(this.geometry.vertices[0].x, this.geometry.vertices[0].y, 0));
  }

  render() {
    this.analyser.getByteTimeDomainData(this.freqs);

    for (let i = 0; i < this.ecart; i++) {
      let value = this.radius;
      let moy = 0;
      for (var o = 0; o < this.fusion; o++) {
        moy += this.freqs[i * this.fusion + o];
      }

      moy /= 5;
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

      this.planes[i].position.x += vx;
      this.planes[i].position.y += vy;
    }

    this.group.rotation.z -= 0.006;
  }

  getObject() {
  	return this.group;
  }
}
