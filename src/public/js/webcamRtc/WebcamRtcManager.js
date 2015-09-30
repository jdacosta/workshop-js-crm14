import Peer from './class/Peer';
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
  }
}

export default WebcamPeerRtc;
