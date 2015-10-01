import Peer from './class/Peer';
import Tracking from './class/Tracking';
import Webcam from './class/Webcam';

class WebcamPeerRtc {

  /**
   * Constructeur
   * @return {void}
   */
  constructor() {
    // create object
    this.webcam = new Webcam();
    this.peer = new Peer(this.webcam);
    this.tracking = new Tracking(this.webcam);
  }
}

export default WebcamPeerRtc;
