import THREE from 'three';

export default class Cube {

	constructor(config) {
		if(config === undefined) {
			config = {};
		}

		let radius = config.radius || 70;

		// Create a group
		this.group = new THREE.Group();
		this.widthSegments = config.widthSegments || 16;
		this.heightSegments = config.heightSegments || 16

		// this.geometry = new THREE.SphereGeometry(radius, this.widthSegments, this.heightSegments);
		this.geometry = new THREE.TorusKnotGeometry(140, 100, 100, 16);
		this.material = new THREE.MeshLambertMaterial({
			color: 0xffaa00,
			transparent: true,
			wireframe: true,
			wireframeLinewidth: 1
		});

		// Create a cube
		this.cube = new THREE.Mesh(this.geometry, this.material);

		// Cube positions
		this.cube.position.x = config.positionX || 0;
		this.cube.position.y = config.positionY || 0;
		this.cube.position.z = 500;

		// Group position
		this.group.position.x = -window.innerWidth / 2;
		// this.group.position.y = -window.innerHeight / 2 + 200;

		this.group.add(this.cube);
	}

	render() {
		this.cube.rotation.x += 0.005;
		this.cube.rotation.y += 0.01;
	}

	getObject() {
		return this.group;
	}

}