import Events from 'events';
import _ from 'lodash';

const EventEmitter = Events.EventEmitter;

class Tracking extends EventEmitter  {

  /**
   * Constructeur
   * @param  {object} webcam  objet webcam
   * @return {void}
   */
  constructor(webcam) {
    super();

    // init
    this.lastImageData = null;
    this.totalAverageTrack = [];

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
   * [initCanvas description]
   * @return {[type]} [description]
   */
  initCanvas() {
    this.contextBlended = this.canvasBlended.getContext('2d');
    this.contextSource = this.canvasSource.getContext('2d');
    this.contextSource.translate(this.canvasSource.width, 0);
    this.contextSource.scale(-1, 1);
  }

  /**
   * [tracking description]
   * @return {[type]} [description]
   */
  tracking() {
    this.drawVideo();
    this.blend();
    this.checkAreas();
    requestAnimFrame(this.tracking.bind(this));
  }

  /**
   * [drawVideo description]
   * @return {[type]} [description]
   */
  drawVideo() {
    this.contextSource.drawImage(this.webcamLocal, 0, 0, this.webcamLocal.width, this.webcamLocal.height);
  }

  /**
   * [blend description]
   * @return {[type]} [description]
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
   * [fastAbs description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  fastAbs(value) {
    return (value ^ (value >> 31)) - (value >> 31);
  }

  /**
   * [threshold description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  threshold(value) {
    return (value > 0x15) ? 0xFF : 0;
  }

  /**
   * [differenceAccuracy description]
   * @param  {[type]} target [description]
   * @param  {[type]} data1  [description]
   * @param  {[type]} data2  [description]
   * @return {[type]}        [description]
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
   * [checkAreas description]
   * @return {[type]} [description]
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
        averageTrack += averageArea;
      }
    }

    // detect motion tracking
    this.motionDetecting(averageTrack);
    averageTrack = 0;
  }

  /**
   * [motionDetecting description]
   * @param  {[type]} averageTrack [description]
   * @return {[type]}              [description]
   */
  motionDetecting(averageTrack) {
    this.totalAverageTrack.push(averageTrack);
    if (this.totalAverageTrack.length > 500) {
      let average = _.sum(this.totalAverageTrack) / 500;
      if (average > 10) {
        //console.log('motionDetecting', true);
        this.emit('motionDetecting', true);
      } else {
        //console.log('motionDetecting', false);
        this.emit('motionDetecting', false);
      }
      this.totalAverageTrack = [];
    }
  }
}

export default Tracking;
