import $ from 'jquery';

export default class Interface {
  constructor() {
    this.initFrameAnimation();
    this.initMessagerie();
    this.initTitleAnimation();
    this.initGridAnimation();
    this.initWarningMessage();

    // Variables pour l'ajout de mots clés
    this.timeout;
    this.wordContainer = $('#wordContainer');
    this.wordBlock = $('.word', wordContainer);
    this.wordSpeed = 0.2;
  }

  /**
   * Quand on ajoute un mot clé
   * Celui-ci remplace le précédent et s'autodétruit
   * après 10s
   * @param {void}
   */
  setWord(newWord) {

    console.log('DISPLAY MESSAGE ' + newWord);

    // On clear le timer si il existe
    if(this.timeout) {
      clearTimeout(this.timeout);
    }

    // Si le mot existe on clear et on l'ajoute
    if(newWord) {
      this.clearWord(() => {
        this.addWord(newWord);
      });
    }

    // On initialise un timer qui clear après 10s
    this.timeout = setTimeout(() => {
      this.clearWord();
    }, 10000);
  }

  addWord(newWord) {
    this.wordBlock.text(newWord);
    TweenMax.to(this.wordBlock, this.wordSpeed, {
      opacity: 1,
      ease: Back.easeOut,
      left: 0,
      scale: 1
    });
  }

  clearWord(callback) {
    TweenMax.to(this.wordBlock, this.wordSpeed, {
      opacity: 0,
      ease: Back.easeOut,
      left: -100,
      scale: 0.5,
      onComplete: () => {
        this.wordBlock.empty();

        if(callback) {
          callback();
        }
      }
    });
  }

  initWarningMessage() {
    let messageContainer = $('#warningMessage');
    let img = $('#icon', messageContainer);
    let tl = new TimelineMax({
      repeat: -1,
      yoyo: true
    })

    tl.add(TweenLite.to(img, 1, {
      scale: 1.2
    }));

  }

  setWarningMessage(bool) {
    let messageContainer = $('#warningMessage');
    let speed = 0.65;

    if(!bool) {
      messageContainer.show();
      TweenLite.to(messageContainer, speed, {
        opacity: 1,
        scale: 1,
        ease: Back.easeOut
      });
    } else {
      TweenLite.to(messageContainer, speed, {
        opacity: 0,
        scale: 0.8,
        ease: Back.easeOut
      });
    }
  }

  initGridAnimation() {
    let gridContainer = $('#grid');
    let vLines = $('.vLine', gridContainer);
    let hLines = $('.hLine', gridContainer);
    let i = 0;

    // Pour chaque lignes verticales
    $(vLines).each(function() {
      $(this).show();
      tweeningVLine($(this), random(5, 10));
      i++;
    });

    // Pour chaque lignes horizontales
    $(hLines).each(function() {
      $(this).show();
      tweeningHLine($(this), random(3, 8));
      i++;
    });

    function tweeningVLine(el, time) {
      resetTween(el);

      TweenMax.to(el, time, {
        left: '100%',
        onComplete: function() {
          var t = random(5, 10);
          tweeningVLine(el, t);
        }
      });
    }

    function tweeningHLine(el, time) {
      resetTween(el);

      TweenMax.to(el, time, {
        top: '100%',
        onComplete: function() {
          var t = random(3, 8);
          tweeningHLine(el, t);
        }
      });
    }

    function resetTween(el) {
      TweenMax.set(el, {
        left: 0,
        top: 0,
        opacity: random(0.5, 1)
      });
    }

    function random(min, max) {
      return Math.floor(Math.random() * max) + min;
    }
  }

  initTitleAnimation() {
     var tl = new TimelineMax({
      repeat: -1,
      // repeatDelay: 1,
      yoyo: true,
      onComplete: () => {
        console.log('onComplete');
        tl.pause();
      }
    });

    // tl.play();

    var mySplitText1 = new SplitText("#bigTitle", {
      type: 'words,chars'
    });
    var mySplitText2 = new SplitText("#subBigTitle", {
      type: 'words,chars'
    });

    // An array of all the divs that wrap each character
    var chars = mySplitText1.chars;
    var chars2 = mySplitText2.chars;

    TweenLite.set("#bigTitle", {
      perspective:400
    });

    TweenLite.set("#subBigTitle", {
      perspective:400
    });

    tl.add(TweenMax.staggerFrom(chars, 0.8, {
      opacity:0,
      scale:0,
      y:80,
      rotationX: 180,
      transformOrigin: '0% 50% -50',
      ease:Back.easeOut
    }, 0.024, '+=0'));

    tl.add(TweenMax.staggerFrom(chars2, 0.8, {
      opacity:0,
      scale:0,
      y:80,
      rotationX: 180,
      transformOrigin: '0% 50% -50',
      ease:Back.easeOut
    }, 0.024, '+=0'), '-=0.5').addPause(5, function() {
      tl.reverse().addPause(2, function() {
        tl.play();
      });
    });
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
