import Graph from './Graph';
import THREE from 'three';

class VoiceGraph extends Graph {
  constructor() {
    super();
    this.config = {
      color: '#36babc',
      strokeSize: 2
    };

    this.geometry;
    this.material;
    this.mesh;

    this.geometry = new THREE.BoxGeometry(200, 200, 200);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  render() {
  	this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
  }

  getObject() {
  	return this.mesh;
  }
}

export default VoiceGraph;
