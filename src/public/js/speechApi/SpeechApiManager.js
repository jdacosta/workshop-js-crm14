import Speech from 'speechjs';

class SpeechApiManager {

  /**
   * Constructor
   * 
   * @return {void}
   */
  constructor() {

    // initialize
    this.messages = [];

    // create a Google speech object
    this.recognizer = new Speech({
      lang: 'fr-FR',
      debugging: false,
      continuous: true,
      interimResults: false,
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
      .on('start', function() {})
      .on('end', function() {})
      .on('error', function(event) {
        console.log(event.error);
      })
      .on('interimResult', function(msg) {})
      .on('finalResult', function(msg) {
        console.log(_this.messages);
        if (_this.messages.push(msg) > 10) {
          _this.messages.shift();
          _this.delFirstMessage();
        }
        _this.addNewMessage(msg);
      })
      .start();
  }

  /**
   * Ajouter un nouveau message dans le speech chat.
   *
   * @param  {string} content  contenu du message renvoyé par l'API Google
   * @return {void}
   */
  addNewMessage(content) {
    let messagesHtml = document.getElementById('textSpeech');
    let newMessage = document.createElement('p');
    newMessage.innerHTML = content;
    messagesHtml.appendChild(newMessage);
  }

  /**
   * Supprimer le dernier message du speech chat.
   *
   * @return {void}
   */
  delFirstMessage() {
    let messagesHtml = document.getElementById('textSpeech');
    let message = document.getElementsByTagName('p');
    messagesHtml.removeChild(message[0]);
  }
}

export default SpeechApiManager;
