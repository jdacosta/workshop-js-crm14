import THREE from 'three';

export default class Video {
  constructor() {
    this.video = document.getElementById('webcam-video-local');

    this.xsize = window.innerWidth + 100;
		this.ysize = window.innerHeight + 100;

		this.texture = new THREE.VideoTexture(this.video);
		this.texture.minFilter = THREE.LinearFilter;
		this.texture.magFilter = THREE.LinearFilter;
		this.texture.format = THREE.RGBFormat;
    this.texture.needsUpdate = true;

    let parameters = {
      color: 0xffffff,
      map: this.texture
    };

    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      overdraw: true,
      side:THREE.DoubleSide
    });

    this.geometry = new THREE.PlaneGeometry(this.xsize, this.ysize, 1);
    this.object = new THREE.Mesh(this.geometry, this.material);
    this.object.position.z = 0;
  }

  getObject() {
    return this.object;
  }

}
