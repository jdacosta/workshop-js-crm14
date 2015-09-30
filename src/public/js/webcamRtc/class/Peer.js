import Events from 'events';
import peerjs from 'peerjs';
import config from '../../../../servers/config/config';

const EventEmitter = Events.EventEmitter;

class Peer extends EventEmitter {

  /**
   * Constructeur
   *
   * @return {void}
   */
  constructor(webcam) {
    super();

    // get socket object
    this.socket = io();

    // get webcam object
    this.webcam = webcam;

    // initialize
    this.userId = null;
    this.contactId = null;
    this.peerCall = {};
    this.peerInstance = {};

    // connect to socket io
    this.socket.on('connect', this.socketReady.bind(this));
  }

  /**
   * Lorsque le socket est prêt à être utilisé,
   * on écoute différents évenements et on
   * demande son userid.
   *
   * @return {void}
   */
  socketReady() {

    // display info
    console.log('[INFO] Socket ready');

    // listen socket
    this.socket.on('getUserId', this.getUserId.bind(this));
    this.socket.on('getUsersList', this.getUsersList.bind(this));

    // call for userid
    this.socket.emit('getUserId');
  }

  /**
   * Réception de l'userId attribué.
   * Une fois l'userId reçu, on se connecte
   * au peer du serveur RTC.
   *
   * @param  {string} id  identifiant de la session
   * @return {void}
   */
  getUserId(id) {

    // display info
    console.log('[INFO] Get user id', id);

    // set user id
    this.userId = id;
    //$('#user').text(this.userId);

    // now that we got the user id, connect peer
    this.connectPeer();
  }

  /**
   * Récupére la liste des appareils connectés
   * qui peuvent recevoir un appel.
   *
   * @param  {array} users  identifiants des utilisateurs
   * @return {void}
   */
  getUsersList(users) {

    // display info
    console.log('[INFO] Get users list', users);

    for (let i = 0; i < users.length; i++) {
      if (users[i] !== this.userId) {
        this.askCall(users[i]);
      }
    }

    // display list
    /*$('#users').empty();
    for(let i = 0; i < users.length; i++) {
      if(users[i] != this.userId) {
        $('#users').append('<li><a data-user="' + users[i] + '">Call ' + users[i] + '</a></li>');
      }
    }*/
  }

  /**
   * Permet de gérer la connexion au serveur RTC.
   *
   * @return {void}
   */
  connectPeer() {

    // display info
    console.log('[INFO] Connect peer');

    // connect peer
    // TODO export config
    this.peerInstance = new peerjs(
      this.userId, {
        host: config.server.host, port: config.server.port, path: '/peer',
        config: {
          'iceServers': [
            { url: 'stun:stun1.l.google.com:19302' },
            { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
          ]
        }
      }
    );

    // listen for peer open
    this.peerInstance.on('open', this.peerReady.bind(this));

    // listen for a call
    this.peerInstance.on('call', this.receiveCall.bind(this));
  }

  /**
   * Demander la liste des utilisateurs connectés
   * si le peer est prêt à être utilisé.
   *
   * @return {void}
   */
  peerReady() {

    // display info
    console.log('[INFO] Peer ready');

    // send message for get users list
    this.socket.emit('getUsersList');
  }

  /**
   * Permet de demander un appel à l'aide
   * de l'identifiant d'un utilisateur.
   *
   * @param  {string} contactId  identifiant de l'utilisateur
   * @return {void}
   */
  //askCall(e) {
  askCall(contactId) {

    // display info
    console.log('[INFO] Call');

    // get user to call
    //this.contactId = $(e.currentTarget).data('user');
    this.contactId = contactId;

    // get our video
    this.webcam.on('webcamInit', this.sendCall.bind(this));
    //console.log('DEBUG2');
    //console.log(this.webcam.getWebcamStream());
    //this.sendCall(this.webcam.getWebcamStream());
    /*navigator.getUserMedia({ audio: false, video: true },
      this.sendCall.bind(this),
      this.gotError.bind(this)
    );*/
  }

  /**
   * Envoyer un appel pour lancer une conférence.
   *
   * @param  {object} stream  url du stream video.
   * @return {void}
   */
  //sendCall(stream) {
  sendCall() {

    // display info
    console.log('[INFO] Ready call');

    // call someone - send our audio stream
    this.peerCall = this.peerInstance.call(
      this.contactId,
      this.webcam.getWebcamStream()
    );

    // listen call for stream
    this.peerCall.on('stream', this.receiveStream.bind(this));
  }

  /**
   * Recevoir un appel pour lancer une conférence.
   *
   * @param  {object} call  objet peer.
   * @return {void}
   */
  receiveCall(call) {

    // display info
    console.log('[INFO] Get call');

    // call
    this.peerCall = call;

    // listen call for stream
    this.peerCall.on('stream', this.receiveStream.bind(this));

    // get our micro stream
    this.answerCall(this.webcam.getWebcamStream());
    /*navigator.getUserMedia({ audio: false, video: true },
      this.answerCall.bind(this),
      this.gotError.bind(this)
    );*/
  }

  /**
   * Répondre à un appel reçu.
   *
   * @param  {object} stream  url du stream video.
   * @return {void}
   */
  answerCall(stream) {

    // display info
    console.log('[INFO] Answer call');

    // answering to the call - sending our micro stream
    this.peerCall.answer(stream);
  }

  /**
   * Permet de recevoir le stream video.
   *
   * @param  {object} stream  url du stream video.
   * @return {void}
   */
  receiveStream(stream) {

    // display info
    console.log('[INFO] Reveive stream', stream);

    // push the stream to video
    let video = document.getElementById('webcam-video-remote');
    video.src = window.URL.createObjectURL(stream);
  }

  /**
   * Affiche les erreurs reçues en callback
   *
   * @param  {string} error  erreur passée en paramétre
   * @return {void}
   */
  gotError(error) {
    console.log(error);
  }
}

export default Peer;
