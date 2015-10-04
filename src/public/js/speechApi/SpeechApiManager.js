import Speech from 'speechjs';
import $ from 'jquery';

class SpeechApiManager {

  /**
   * Constructor
   *
   * @return {void}
   */
  constructor(ui, wrm) {

    // initialize
    this.messages = [];
    this.interface = ui;
    this.socket = wrm.getPeer().getSocket();
    this.messageElement = $('#textSpeech');
    this.inProgress = false;
    this.words = [
      'bonjour', 'salut', 'hello',
      'danser', 'taper dans les mains',
      'sauter', 'tourner', 'bouger',
      'nul', 'plus vite', 'en solo',
      'mauvais', 'good', 'bien',
      'encore', 'toujours plus'
    ];

    this.timeout = setTimeout(() => {
      console.log('timeout');
      this.stopProgress();
    }, 2000);

    // create a Google speech object
    this.recognizer = new Speech({
      lang: 'fr-FR',
      debugging: false,
      continuous: true,
      interimResults: true,
      autoRestart: true
    });

    this.socket.on('messageAction', this.displayMessage.bind(this));
  }

  displayMessage(message) {
    console.log('MESSAGE RECU ' + message);
    this.interface.setWord(message);
  }

  /**
   * Initialise l'utilisation de l'API Google Speech.
   *
   * @return {void}
   */
  init() {
    let _this = this;
    this.recognizer
      .on('start', () => {
        // console.log('start');
      })
      .on('end', () => {
        // console.log('end');
      })
      .on('stop', () => {
        // console.log('stop');
      })
      .on('error', function(event) {
        console.log(event.error);
      })
      .on('interimResult', (msg) => {
        this.sendMessage(msg);
        this.inProgress = true;
      })
      .on('finalResult', (msg) => {
        this.stopProgress();
      })
      .start();
  }

  stopProgress() {
    this.inProgress = false;
  }

  /**
   * Envoi le message via socketIO à l'autre client connecté
   *
   * @param  {string} content  contenu du message à envoyer
   * @return {void}
   */
  sendMessage(msg) {
    for (let i in this.words) {
      if (msg.toLowerCase().indexOf(this.words[i]) !== -1) {
        console.log('MESSAGE ENVOYEE : ' + this.words[i]);
        this.socket.emit('message', this.words[i]);
      }
    }
  }

  /**
   * Ajouter un nouveau message dans le speech chat.
   *
   * @param  {string} content  contenu du message renvoyé par l'API Google
   * @return {void}
   */
  addNewMessage(content) {
    if (this.messages.push(content) > 10) {
      this.delFirstMessage();
    }

    let messagesHtml = document.getElementById('textSpeech'),
        newMessage = document.createElement('p');
    newMessage.innerHTML = content;
    messagesHtml.appendChild(newMessage);
  }

  /**
   * Permet de remplacer un texte dans le chat
   *
   * @param  {string} content  contenu du message à afficher
   * @return {void}
   */
  replaceMessage(content) {
    let messagesElements = $('p', this.messageElement);

    if(this.messages.length == 0 || !this.inProgress) {
      this.addNewMessage(content);
    } else {
      messagesElements.last().text(content);
    }
  }

  /**
   * Supprimer le dernier message du speech chat.
   *
   * @return {void}
   */
  delFirstMessage() {
    this.messages.shift();
    let messagesHtml = document.getElementById('textSpeech'),
        message = document.getElementsByTagName('p');
    messagesHtml.removeChild(message[0]);
  }
}

export default SpeechApiManager;
