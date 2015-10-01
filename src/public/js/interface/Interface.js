import $ from 'jquery';

export default class Interface {
  constructor() {
    this.initFrameAnimation();
    this.initMessagerie();
  }

  initMessagerie() {
    let message = $('#textSpeech');
    let nbMessage = $('.nbMessages', message);
    let l = 0;

    $(message).on('DOMNodeInserted', () => {
      let newl = message.find('p').length;

      if(newl != l) {
        l = newl;

        if(l > 1) {
          nbMessage.text(l + ' Messages');
        } else {
          nbMessage.text(l + ' Message');
        }
      }

    });
  }

  initFrameAnimation() {
    let tl = new window.TimelineMax({
      repeat: -1,
      startTime: 0.5
    });

    let right = document.getElementsByClassName('right');
    let bottom = document.getElementsByClassName('bottom');
    let left = document.getElementsByClassName('left');
    let top = document.getElementsByClassName('top');

    let time = 1;
    let ratio = window.innerWidth / innerHeight;
    let timeX = time * ratio;

    tl.to(right, time, {
      height: '100%'
    }).to(right, time, {
      bottom: 0,
      height: 0
    }).to(bottom, timeX, {
      right: 0,
      width: '100%'
    }, '-=0.5').to(bottom, timeX, {
      left: 0,
      width: 0
    }).to(left, time, {
      bottom: 0,
      height: '100%'
    }, '-=0.5').to(left, time, {
      top: 0,
      height: 0
    }).to(top, timeX, {
      width: '100%'
    }, '-=0.5').to(top, timeX, {
      right: 0,
      width: 0
    });

    tl.add("stagger", "-=0.5")
  }
}
