import Events from 'events';
import _ from 'lodash';

const EventEmitter = Events.EventEmitter;

class Tracking extends EventEmitter  {

  /**
   * Constructeur
   *
   * @param  {object} webcam  objet webcam
   * @return {void}
   */
  constructor(webcam) {
    super();

    // init
    this.lastImageData = null;
    this.lastPosition = [];
    this.totalAverageTrack = [];
    this.totalAverageRight = [];
    this.totalAverageCenter = [];
    this.totalAverageLeft = [];

    // init requestAnimFrame
    window.requestAnimFrame = window.requestAnimationFrame       ||
                              window.webkitRequestAnimationFrame ||
                              window.mozRequestAnimationFrame    ||
                              window.oRequestAnimationFrame      ||
                              window.msRequestAnimationFrame;

    // get webcam object
    this.webcam = webcam;

    // initialize elements
    this.webcamLocal = document.getElementById('webcam-video-local');
    this.canvasBlended = document.getElementById('canvas-blended');
    this.canvasSource = document.getElementById('canvas-source');
    this.initCanvas();

    // webcam ready event
    this.webcam.on('webcamInit', this.tracking.bind(this));
  }

  /**
   * Initialisation du Canvas
   *
   * @return {void}
   */
  initCanvas() {
    this.contextBlended = this.canvasBlended.getContext('2d');
    this.contextSource = this.canvasSource.getContext('2d');
    this.contextSource.translate(this.canvasSource.width, 0);
    this.contextSource.scale(-1, 1);
  }

  /**
   * Mise à jour du tracking en fonction du
   * requestAnimFrame.
   *
   * @return {void}
   */
  tracking() {
    this.drawVideo();
    this.blend();
    this.checkAreas();
    requestAnimFrame(this.tracking.bind(this));
  }

  /**
   * Récupére le le flux de la webcam
   * et le dessine dans un canvas
   *
   * @return {void}
   */
  drawVideo() {
    this.contextSource.drawImage(this.webcamLocal, 0, 0, this.webcamLocal.width, this.webcamLocal.height);
  }

  /**
   * Préparation du traitement pour pouvoir comparer l'image
   * de 2 canvas afin de déterminer les différences.
   *
   * @return {void}
   */
  blend() {

    // get canvas size
    let width = this.canvasSource.width;
    let height = this.canvasSource.height;

    // get webcam image data
    let sourceData = this.contextSource.getImageData(0, 0, width, height);

    // create an image if the previous image doesn’t exist
    if (!this.lastImageData) {
      this.lastImageData = this.contextSource.getImageData(0, 0, width, height);
    }

    // create a ImageData instance to receive the blended result
    let blendedData = this.contextSource.createImageData(width, height);

    // blend the 2 images
    this.differenceAccuracy(blendedData.data, sourceData.data, this.lastImageData.data);

    // draw the result in a canvas
    this.contextBlended.putImageData(blendedData, 0, 0);

    // store the current webcam image
    this.lastImageData = sourceData;
  }

  /**
   * Equivalent de Math.abs pour les opérateurs binaire.
   *
   * @param  {int} value  valeur en entrée
   * @return {int}
   */
  fastAbs(value) {
    return (value ^ (value >> 31)) - (value >> 31);
  }

  /**
   * Changer les couleurs en noir ou blanc en
   * fonction de la valeur en entrée.
   *
   * @return {hex}
   */
  threshold(value) {
    return (value > 0x15) ? 0xFF : 0;
  }

  /**
   * Permet d'analyser les différences
   */
  differenceAccuracy(target, data1, data2) {
    if (data1.length != data2.length) return null;
    let i = 0;
    while (i < (data1.length * 0.25)) {
      let average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
      let average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
      let diff = this.threshold(this.fastAbs(average1 - average2));
      target[4*i] = diff;
      target[4*i+1] = diff;
      target[4*i+2] = diff;
      target[4*i+3] = 0xFF;
      ++i;
    }
  }

  /**
   * Recupère la moyenne de différence pour
   * chaque zone découpé de la source vidéo.
   *
   * @return {void}
   */
  checkAreas() {

    // check canvas area
    let averageTrack = 0;
    for (let r = 0; r < 8; ++r) {

      // init
      let i = 0,
          averageArea = 0,
          blendedData = this.contextBlended.getImageData(
            1 / 8 * r * this.webcamLocal.width,
            0,
            this.webcamLocal.width / 8,
            100
          );

      // loop over the pixels and make an average between the color channel
      while (i < (blendedData.data.length * 0.25)) {
        averageArea += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
        ++i;
      }

      // calculate an average between of the color values of the define area
      averageArea = Math.round(averageArea / (blendedData.data.length * 0.25));
      if (averageArea > 10) {
        // total average
        averageTrack += averageArea;

        // area average
        if (r === 6 || r === 7) this.totalAverageRight += averageArea;
        else if (r === 3 || r === 4) this.totalAverageCenter += averageArea;
        else if (r === 0 || r === 1) this.totalAverageLeft += averageArea;
      }
    }

    // detect motion tracking
    this.motionDetecting(averageTrack);
    averageTrack = 0;
  }

  /**
   * Permet de détecter un mouvement, la position
   * ou se situe le mouvement et la vitesse.
   *
   * @param  {float} averageTrack  moyenne total
   * @return {void}
   */
  motionDetecting(averageTrack) {
    this.totalAverageTrack.push(averageTrack);
    if (this.totalAverageTrack.length > 50) {
      let average = _.sum(this.totalAverageTrack) / this.totalAverageTrack.length;
      if (average > 10) {

        // get position
        let position;
        let right = _.sum(this.totalAverageRight);
        let center = _.sum(this.totalAverageCenter);
        let left = _.sum(this.totalAverageLeft);
        if (Math.abs(right) < Math.abs(left) && Math.abs(center) < Math.abs(left)) {
          position = 'LEFT';
        } else if (Math.abs(right) < Math.abs(center) && Math.abs(left) < Math.abs(center)) {
          position = 'CENTER';
        } else {
          position = 'RIGHT';
        }
        this.updatePosition(position);

        // get speed
        let speed;
        if (average > 65) speed = 'VERY_FAST';
        else if (average > 50) speed = 'FAST';
        else if (average > 30) speed = 'NORMAL';
        else if (average > 20) speed = 'SLOW';
        else speed = 'VERY_SLOW';

        console.log('motionDetecting', true, average, {'speed': speed, 'position': position});
        this.emit('motionDetecting', true, average, {'speed': speed, 'position': position});
      } else {
        console.log('motionDetecting', false);
        this.emit('motionDetecting', false, {});
      }

      // init
      this.totalAverageTrack = [];
      this.totalAverageRight = [];
      this.totalAverageCenter = [];
      this.totalAverageLeft = [];
    }
  }

  /**
   * Détecter un déplacement en fonction
   * de la dernière position.
   *
   * @param  {string} position  position possédant un mouvement
   * @return {void}
   */
  updatePosition(position) {
    let time = new Date().getTime();
    let last = _.last(this.lastPosition);
    if (!this.lastPosition.length) {
      this.lastPosition.push({'position': position, 'time': time});
    } else if (this.lastPosition.length && last['position'] !== position) {
      this.lastPosition.push({'position': position, 'time': time});
      if (this.lastPosition.length > 3) {
        this.lastPosition.shift();
      }
    }

    // detect a position
    let first = _.first(this.lastPosition);
    if (this.lastPosition.length === 3 && (time - first['time'])) {
      if (first['position'] === 'LEFT' && last['position'] === 'CENTER' && position === 'RIGHT') {
        console.log('DEPLACEMENT LEFT --> RIGHT');
      }
      if (first['position'] === 'RIGHT' && last['position'] === 'CENTER' && position === 'LEFT') {
        console.log('DEPLACEMENT RIGHT --> LEFT');
      }
    }
  }
}

export default Tracking;
