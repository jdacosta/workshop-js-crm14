import Speech from 'speechjs';
import $ from 'jquery';

class SpeechApiManager {

  /**
   * Constructor
   * 
   * @return {void}
   */
  constructor() {

    // initialize
    this.messages = [];

    this.messageElement = $('#textSpeech');
    this.inProgress = false;

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
        // console.log('end');
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
        // console.log('interimResult', msg);
        // clearTimeout(this.timeout);
        this.replaceMessage(msg);
        this.inProgress = true;
      })
      .on('result', () => {
        // console.log('result');
      })
      .on('finalResult', (msg) => {
        // this.replaceMessage(msg);
        this.stopProgress();
        // console.log(_this.messages);
      })
      .start();
  }

  stopProgress() {
    // console.log('stopProgress');
    this.inProgress = false;
  }

  createTimeout() {
    // console.log('createTimeout');
    this.timeout = setTimeout(() => {
      // console.log('end Timeout');
      this.stopProgress();
    }, 2000);
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

    let messagesHtml = document.getElementById('textSpeech');
    let newMessage = document.createElement('p');
    newMessage.innerHTML = content;
    messagesHtml.appendChild(newMessage);
  }

  replaceMessage(content) {
    let messagesElements = $('p', this.messageElement);

    if(this.messages.length == 0 || !this.inProgress) {
      this.addNewMessage(content);
    } else {
      // Replace
      messagesElements.last().text(content);
    }

    // this.createTimeout();
  }

  /**
   * Supprimer le dernier message du speech chat.
   *
   * @return {void}
   */
  delFirstMessage() {
    this.messages.shift();

    let messagesHtml = document.getElementById('textSpeech');
    let message = document.getElementsByTagName('p');
    messagesHtml.removeChild(message[0]);
  }
}

export default SpeechApiManager;
