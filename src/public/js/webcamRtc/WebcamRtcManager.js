import Peer from './class/Peer';
import Tracking from './class/Tracking';
import Webcam from './class/Webcam';
import Events from 'events';

const EventEmitter = Events.EventEmitter;

class WebcamPeerRtc extends EventEmitter {

  /**
   * Constructeur
   * @return {void}
   */
  constructor() {
    super();
    
    // create object
    this.webcam = new Webcam();
    this.peer = new Peer(this.webcam);
    this.tracking = new Tracking(this.webcam);
    this.tracking.on('motionDetecting', (bool) => {
      this.emit('motionDetecting', bool);
    });
  }
}

export default WebcamPeerRtc;
