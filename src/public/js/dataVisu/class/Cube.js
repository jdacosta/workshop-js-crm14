import THREE from 'three';

export default class Cube {

  constructor(config) {
    if(config === undefined) {
      config = {};
    }

    let radius = config.radius || 70;

    this.rotationX = config.rotationX || 0;
    this.rotationY = config.rotationY || 0;

    // Create a group
    this.group = new THREE.Group
    this.widthSegments = config.widthSegments || 16;
    this.heightSegments = config.heightSegments || 16

    // this.geometry = new THREE.SphereGeometry(radius, this.widthSegments, this.heightSegments);
    this.geometry = new THREE.BoxGeometry(radius, radius, radius);
    this.material = new THREE.MeshBasicMaterial({
      color: config.color || 0xffaa00,
      opacity: config.opacity || 0.3,
      transparent: true,
      wireframe: config.wireframe || false,
      wireframeLinewidth: config.wireframeLinewidth || 1
    });

    // Create a cube
    this.cube = new THREE.Mesh(this.geometry, this.material);

    // Cube positions
    this.cube.position.x = config.positionX || 0;
    this.cube.position.y = config.positionY || 0;
    this.cube.position.z = 100;

    // Group position
    this.group.position.x = -window.innerWidth / 2 - 60;
    // this.group.position.y = -window.innerHeight / 2 + 200;

    this.group.add(this.cube);
  }

  render() {
    this.cube.rotation.x += this.rotationX;
    this.cube.rotation.y += this.rotationY;
  }

  getObject() {
    return this.group;
  }

}
