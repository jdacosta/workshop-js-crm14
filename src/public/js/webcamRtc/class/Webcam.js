import Events from 'events';

const EventEmitter = Events.EventEmitter;

class Webcam extends EventEmitter {

  /**
   * Constructeur
   *
   * @return {void}
   */
  constructor() {
    super();

    // initialize elements
    this.cameraActive = false;
    this.userMedia = false;
    this.liveStream = null;

    // initialize, check for getUserMedia support
    navigator.getUserMedia = navigator.getUserMedia       ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia    ||
                             navigator.msGetUserMedia;

    // initialize window.URL
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    // initialize attributes
    this.userMedia = !!navigator.getUserMedia && !!window.URL;

    // initialiser la webcam
    this.initWebcam();
  }

  /**
   * Permet d'initialiser le flux de la caméra
   * et de le stocker dans this.liveStream
   *
   * @return {void}
   */
  initWebcam() {
    if (this.userMedia) {
      navigator.getUserMedia({video: true, audio: false}, (stream) => {
        this.liveStream = stream;
        this.cameraActive = true;
        this.displayLocalWebcam();
        this.emit('webcamInit');
      }, this.errorCallback);
    } else {
      console.log('[ERROR] navigator.getUserMedia and window.URL error');
    }
  }

  /**
   * Affichage de la webcam local
   *
   * @return {void}
   */
  displayLocalWebcam() {
    if (this.cameraActive && this.liveStream) {
      let video = document.getElementById('webcam-video-local');
      video.src = window.URL.createObjectURL(this.liveStream);
    }
  }

  /**
   * Obtenir le flux de la caméra
   *
   * @return {object}  flux de la caméra
   */
  getWebcamStream() {
    return this.liveStream;
  }

  /**
   * Tracker les erreurs retournées en callback
   *
   * @return {void}
   */
  errorCallback() {
    console.log('Webcam error : ', error.code);
  }
}

export default Webcam;
