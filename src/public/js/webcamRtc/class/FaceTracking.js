import Events from 'events';
import tracking from 'tracking';
import face from 'face';

const EventEmitter = Events.EventEmitter;

class FaceTracking extends EventEmitter  {

  /**
   * Constructeur
   * @param  {object} webcam  objet webcam
   * @return {void}
   */
  constructor(webcam) {
      super();

      // init
      this.faceDetected = false;

      // get webcam object
      this.webcam = webcam;

      // webcam ready event
      this.webcam.on('webcamInit', this.faceDetecting.bind(this));

      // get node webcam local
      this.webcamLocal = document.getElementById('webcam-video-local');
  }

  /**
   * Fonction permettant de détecter le visage.
   *
   * @return {[type]} [description]
   */
  faceDetecting() {

    // define face tracking
    let tracker = new tracking.ObjectTracker(['face']);
    tracker.setInitialScale(1);
    tracker.setStepSize(1);
    tracker.setEdgesDensity(0.1);
    tracking.track(this.webcamLocal, tracker, { camera: true });

    // tracking event
    let cpt = 0;
    tracker.on('track', (event) => {
      if (event.data.length != this.faceDetected && cpt > 25) {
        cpt = 0;
        this.faceDetected = !this.faceDetected;
        this.emit('faceDetected', this.faceDetected);
        //console.log('CHANGEMENT ' + this.faceDetected);
      } else if (event.data.length != this.faceDetected) {
        cpt++;
      }
    });
  }
}

export default FaceTracking;
