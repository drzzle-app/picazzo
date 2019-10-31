'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
*  ===================================
*   Drzzle Jquery droplet library
*  ===================================
*   Author: Roger Avalos
*  ==================================
*/
/* eslint no-underscore-dangle: 0 */

window.drzzle = {
  viewports: {
    mobile: 'screen and (min-width:50px) and (max-width:600px)',
    tablet: 'screen and (min-width:601px) and (max-width:992px)',
    desktop: 'screen and (min-width : 993px)'
  },
  googleMaps: [],
  window: $(window),
  document: $(document),
  picazzo: window.picazzo
};

/* Equal Heights
* ======================= */
(function ($) {
  $.fn.equalHeights = function equalHeights() {
    var $row = $(this);
    function setHeights() {
      $row.each(function findEquals() {
        var $elements = $(this).children();
        if ($elements.length > 1) {
          var largestHeight = 0;
          if (!window.matchMedia(drzzle.viewports.mobile).matches) {
            $elements.css('min-height', '1px');
            $elements.each(function find() {
              var $col = $(this);
              if ($col.hasClass('column')) {
                var colHeight = $col.outerHeight();
                if (colHeight > largestHeight) {
                  largestHeight = colHeight;
                }
              }
            });
            $elements.each(function set() {
              var $col = $(this);
              if ($col.hasClass('column')) {
                $col.css('min-height', largestHeight);
              }
            });
          } else {
            $elements.each(function set() {
              var $col = $(this);
              if ($col.hasClass('column')) {
                $col.css('min-height', '1px');
              }
            });
          }
        }
      });
    }

    var resizeTimer = void 0;
    drzzle.window.resize(function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setHeights, 250);
    });
    if (window.__editor) {
      // initiate the plugin asap in editor
      setHeights();
    } else {
      // set after window loads in a page env
      drzzle.window.load(function () {
        return setHeights();
      });
    }
    $.fn.equalHeights.destroy = function ($el) {
      $el.children().each(function unSet() {
        $(this).css('min-height', '');
      });
    };
    return this;
  };
})(jQuery);

/* Site Search (Client Side)
* ======================= */
(function ($) {
  $.fn.drzSiteSearch = function siteSearch() {
    var $search = $(this);
    $search.each(function init() {
      var _this = this;

      var $this = $(this);
      var defaults = {
        file: 'js/site-search.json'
      };
      var $attrs = $this.attr('data-search');
      $attrs = $attrs.file ? $attrs : JSON.parse($attrs);
      var opts = $.extend(true, {}, defaults, $attrs);
      var $searchFile = opts.file;
      var $srContainer = void 0;
      var prevent = window.__editor ? ' onclick="event.preventDefault();"' : '';
      var methods = {
        data: [],
        filterResults: function filterResults(e) {
          var searchResults = '';
          var $searchedData = $(e.currentTarget).val();
          if ($searchedData !== '') {
            $searchedData = new RegExp($searchedData, 'gi');
            $(methods.data).each(function (key, val) {
              if (val.pagetitle.match($searchedData) || val.metadata.match($searchedData)) {
                searchResults += '<a href="' + (window.__editor ? '#' : val.href) + '" class="searchResult-link"' + prevent + '>\n                <div class="searchResult"><strong>' + val.pagetitle;
                searchResults += '</strong><br/>' + val.metadata + '</div></a>';
                $srContainer.removeClass('hide');
              }
            });
            $srContainer.html(searchResults);
          } else {
            $srContainer.addClass('hide');
            $srContainer.html('');
          }
        }
      };
      $.getJSON($searchFile).done(function (data) {
        methods.data = data;
        // only insert search container if not there
        if (!$this.next('.searchResults-container').length) {
          $('<div class="searchResults-container"></div>').insertAfter($this);
        }
        $srContainer = $this.next('.searchResults-container');
        $srContainer.addClass('hide');
        $this.keyup(methods.filterResults);
      }).fail(function () {
        console.log('Error loading site search'); // eslint-disable-line
      });
      // destroy plugin
      $.fn.drzSiteSearch.destroy = function ($el) {
        $el.off('keyup', _this.filterResults);
      };
    });
    return this;
  };
})(jQuery);

/* Url checker for hashed links
* ======================= */
(function ($) {
  $.fn.drzCheckUrl = function drzCheckUrl() {
    var hash = window.location.hash;
    if (hash.match(/^#/gi)) {
      var scrollId = hash.split('#')[1];
      var $el = $('[data-anchor-scroll="' + scrollId + '"]');
      if ($el.length && typeof $el.offset() !== 'undefined' && $el.offset() !== false) {
        $('html, body').animate({ scrollTop: $el.offset().top }, 500);
      }
    }
  };
})(jQuery);

/*
============================
 Drzzle Accordian Plugin
============================
*/
(function ($) {
  $.fn.drzAccordion = function drzAccordion() {
    var $accordion = $(this);
    var titleClass = '.drzAccordion-section-title';
    var activeClass = 'active-accordion';
    var contentClass = '.drzAccordion-section-content';
    function collapseSection() {
      var $active = $accordion.find('.' + activeClass);
      $active.removeClass(activeClass);
      $active.next(contentClass).slideUp(150);
    }
    $accordion.find(titleClass).click(function setActive(e) {
      e.preventDefault();
      var $this = $(this);
      var $acc = $this.parent().parent();
      if ($this.is('.' + activeClass)) {
        collapseSection($acc);
      } else {
        collapseSection($acc);
        $this.addClass(activeClass);
        $this.next(contentClass).slideDown(150);
      }
    });

    $.fn.drzAccordion.killEvents = function ($el) {
      // grab attached selectors and remove attached listeners
      $el.find(titleClass).off('click');
    };
    return this;
  };
})(jQuery);

/*
=================================
 Drzzle Audio Player Plugin
=================================
*/
(function ($) {
  $.fn.drzAudioPlayer = function drzAudioPlayer() {
    var $audioContainer = $(this);
    $audioContainer.each(function initPlayer() {
      var $this = $(this);
      var $audio = $this.find('.drzAudio-src').get(0);
      var $playBtn = $this.find('.drzAudio-playBtn');
      var $pauseBtn = $this.find('.drzAudio-pauseBtn');
      var $volToggle = $this.find('.drzAudio-volumeBtn');
      var $volContainer = $this.find('.drzAudio-volumeContainer');
      var $floatingVol = $this.find('.drzAudio-volumeSliderContainer');
      var $volume = $this.find('.drzAudio-volSlider');
      var $mute = $this.find('.drzAudio-muteBtn');
      var $progress = $this.find('.drzAudio-progress');
      var $progressBar = $this.find('.drzAudio-progressBar');
      var $timeElapsed = $this.find('.drzAudio-currentTime');
      var $totalTime = $this.find('.drzAudio-totalTime');

      // set time elapsed to 0 at first
      $timeElapsed.html('0:00');

      // prepare for any dynamically changed src
      $this.find('.drzAudio-src').load();

      // wait for the audio meta data to come in, then show total time
      var durChange = function durChange() {
        var totalMinutes = parseInt($audio.duration / 60, 10);
        var totalHours = parseInt(totalMinutes / 60, 10);
        var totalSeconds = parseInt($audio.duration % 60, 10);
        if (totalSeconds < 10) {
          totalSeconds = ':0' + totalSeconds;
        } else {
          totalSeconds = ':' + totalSeconds;
        }
        if (totalHours > 0) {
          totalHours = totalHours + ':';
        } else {
          totalHours = '';
        }
        $totalTime.html(totalHours + totalMinutes + totalSeconds);
      };

      // updates time of audio progress
      var timeUpdate = function timeUpdate() {
        var minutes = parseInt($audio.currentTime / 60, 10);
        var seconds = parseInt($audio.currentTime % 60, 10);
        var hours = parseInt(minutes / 60, 10);
        var value = 0;
        if ($audio.currentTime > 0) {
          value = Math.floor(100 / $audio.duration * $audio.currentTime);
        }
        if (seconds < 10) {
          seconds = ':0' + seconds;
        } else {
          seconds = ':' + seconds;
        }
        if (hours > 0) {
          hours = hours + ':';
        } else {
          hours = '';
        }
        $progress.css('width', value + '%');
        $timeElapsed.html(hours + minutes + seconds);
      };

      // update progress for dragging on time bar
      function updateProgress(p) {
        var dur = $audio.duration;
        var pos = p - $progressBar.offset().left;
        var perc = 100 * (pos / $progressBar.width());
        if (perc > 100) {
          perc = 100;
        }
        if (perc < 0) {
          perc = 0;
        }
        $audio.currentTime = dur * (perc / 100);
        $progress.css('width', perc + '%');
      }

      // enable the dragging events to update/change the audio time
      var progressDrag = false;
      var doc = $(document);
      $progressBar.on('vmousedown', function (e) {
        progressDrag = true;
        updateProgress(e.pageX);
      });

      doc.on('vmouseup', function (e) {
        if (progressDrag) {
          progressDrag = false;
          updateProgress(e.pageX);
        }
      });

      doc.on('vmousemove', function (e) {
        if (progressDrag) {
          updateProgress(e.pageX);
        }
      });

      function playAudio() {
        if ($audio.paused || $audio.ended) {
          $audio.play();
        }
      }

      function pauseAudio() {
        $audio.pause();
      }

      function setVolume() {
        $audio.volume = $volume.val();
      }

      function toggleMute() {
        $audio.muted = !$audio.muted;
        $mute.toggleClass('drzAudio-muteOff');
      }

      function togglePlay() {
        if (!$playBtn.hasClass('drzAudio-pauseBtn')) {
          playAudio();
        } else {
          pauseAudio();
        }
      }

      function onPlay() {
        $playBtn.addClass('drzAudio-pauseBtn');
        $playBtn.removeClass('drzAudio-replayBtn');
      }

      function onEnd() {
        $playBtn.removeClass('drzAudio-pauseBtn');
        $playBtn.addClass('drzAudio-replayBtn');
      }

      function onPause() {
        $playBtn.removeClass('drzAudio-pauseBtn');
        $playBtn.removeClass('drzAudio-replayBtn');
      }

      function hideVolume() {
        $floatingVol.fadeOut('fast');
      }

      function toggleVolume() {
        $floatingVol.fadeToggle('fast');
      }

      // attach listeners
      $audio.addEventListener('durationchange', durChange, false);
      $audio.addEventListener('timeupdate', timeUpdate, false);
      $audio.addEventListener('play', onPlay, false);
      $audio.addEventListener('ended', onEnd, false);
      $audio.addEventListener('pause', onPause, false);
      $this.click(hideVolume);
      $playBtn.click(togglePlay);
      $volToggle.click(toggleVolume);
      $pauseBtn.click(pauseAudio);
      $volContainer.click(function (e) {
        e.stopPropagation();
      });
      $volume.change(setVolume);
      $mute.click(toggleMute);

      $.fn.drzAudioPlayer.destroy = function ($el) {
        // grab attached selectors and remove attached listeners
        $el.find('.drzAudio-playBtn').off('click');
        $el.find('.drzAudio-pauseBtn').off('click');
        $el.find('.drzAudio-volSlider').off('change');
        $el.find('.drzAudio-muteBtn').off('click');
        $el.find('.drzAudio-progressBar').off('vmousedown');
        $el.find('.drzAudio-volumeBtn').off('click');
        $this.off('click');
        var audioNode = $el.find('.drzAudio-src').get(0);
        audioNode.removeEventListener('durationchange', durChange, false);
        audioNode.removeEventListener('timeupdate', timeUpdate, false);
        audioNode.addEventListener('play', onPlay, false);
        audioNode.addEventListener('ended', onEnd, false);
        audioNode.addEventListener('pause', onPause, false);
      };
    });
    return this;
  };
})(jQuery);

/*
============================
 Drzzle Carousel Plugin
============================
*/
(function ($) {
  $.fn.drzCarousel = function drzCarousel() {
    var $carousel = $(this);
    $carousel.each(function initCarousel() {
      var $this = $(this);
      var $fullSlider = $this.find('.drzCarousel-content');
      var totalImages = $fullSlider.find('.drzCarousel-content-item').length;
      var $visibleOption = $this.attr('data-carousel-visible');
      var $delayOption = $this.attr('data-carousel-delay');
      var $controlsOption = $this.attr('data-carousel-controls');
      var newContainerWidth = 0;
      var thisImg = 0;
      var newMargin = 0;
      var visibleNum = void 0;
      var interval = void 0;
      var viewContainerWidth = void 0;
      var fullSliderWidth = void 0;
      var currentMargin = void 0;

      if ((typeof $delayOption === 'undefined' ? 'undefined' : _typeof($delayOption)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $delayOption !== false) {
        if ($delayOption === '') {
          $delayOption = 2 * 1000;
        } else {
          $delayOption = ~~$delayOption * 1000;
        }
      } else {
        // set default delay
        $delayOption = 2 * 1000;
      }

      if ((typeof $controlsOption === 'undefined' ? 'undefined' : _typeof($controlsOption)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $controlsOption !== false) {
        if ($controlsOption === '') {
          $controlsOption = 'show';
        }
      } else {
        // set default controls option
        $controlsOption = 'show';
      }

      if ($controlsOption.match(/hide/gi)) {
        $this.find('.drzCarousel-left-button').hide();
        $this.find('.drzCarousel-right-button').hide();
        $this.find('.drzCarousel-image-container').css('width', '100%');
      }

      function setWidths() {
        if (window.matchMedia(drzzle.viewports.mobile).matches) {
          visibleNum = 1;
        } else if ((typeof $visibleOption === 'undefined' ? 'undefined' : _typeof($visibleOption)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $visibleOption !== false) {
          if ($visibleOption === '') {
            visibleNum = 4;
          } else {
            visibleNum = ~~$visibleOption;
          }
        } else {
          visibleNum = 4;
        }
        viewContainerWidth = $this.find('.drzCarousel-image-container').outerWidth();
        newContainerWidth = 0;
        $this.find('.drzCarousel-content .drzCarousel-content-item').each(function setWidth() {
          var w = (viewContainerWidth / visibleNum).toFixed(0);
          $(this).find('img').css('width', w);
          newContainerWidth += ~~$(this).outerWidth();
        });
        $fullSlider.css('width', newContainerWidth);
        thisImg = 0;
        newMargin = 0;
        fullSliderWidth = $fullSlider.outerWidth();
        currentMargin = $this.find('.drzCarousel-content .drzCarousel-content-item').eq(thisImg).outerWidth();
        $fullSlider.css({ marginLeft: newMargin });
      }

      var backMargin = void 0;
      var forwardMargin = void 0;
      // next and back animation speeds slightly faster
      var nbSpeed = 150;

      function moveNext() {
        clearInterval(interval);
        forwardMargin = newMargin += viewContainerWidth;
        // if you reach the end of slider
        if (forwardMargin >= fullSliderWidth - viewContainerWidth) {
          forwardMargin = fullSliderWidth - viewContainerWidth;
          thisImg = totalImages - visibleNum;
          $fullSlider.animate({ marginLeft: -forwardMargin }, nbSpeed);
        } else {
          // if not at end of slider
          // add to the img index number
          thisImg = thisImg += visibleNum;
          $fullSlider.animate({ marginLeft: -forwardMargin }, nbSpeed);
        }
        newMargin = forwardMargin;
      }

      function moveBack() {
        clearInterval(interval);
        backMargin = newMargin -= viewContainerWidth;
        if (backMargin <= 0 || backMargin < ~~currentMargin) {
          backMargin = 0;
          thisImg = 0;
          $fullSlider.animate({ marginLeft: -backMargin }, nbSpeed);
        } else {
          // reset img index number
          thisImg -= visibleNum;
          $fullSlider.animate({ marginLeft: -backMargin }, nbSpeed);
        }
        newMargin = backMargin;
      }

      function pushLeft() {
        clearInterval(interval);
        interval = setInterval(function () {
          newMargin += currentMargin;
          if (newMargin > newContainerWidth) {
            newMargin = 0;
          }
          if (thisImg === totalImages - visibleNum) {
            newMargin = 0;
          }
          $fullSlider.animate({ marginLeft: -newMargin });
          thisImg += 1;
          if (thisImg > totalImages - visibleNum) {
            thisImg = 0;
          }
        }, $delayOption);
      }

      // init functions
      $this.find('.drzCarousel-left-button').click(moveBack);
      $this.find('.drzCarousel-right-button').click(moveNext);

      // for touch swiping (leaving available for all Viewports)
      $this.on('swipeleft', moveNext);
      $this.on('swiperight', moveBack);

      var resizeTimer = void 0;
      var resizeCarousel = function resizeCarousel() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setWidths, 250);
      };
      drzzle.window.resize(resizeCarousel);
      setWidths();
      pushLeft();
      $this.mouseover(function () {
        clearInterval(interval);
      }).mouseout(pushLeft);

      // destroy plugin
      $.fn.drzCarousel.destroy = function ($el) {
        clearInterval(interval);
        $el.off('swipeleft, swiperight, mouseover, mouseout');
        // off resize
        drzzle.window.off('resize', resizeCarousel);
        $el.find('.drzCarousel-left-button').removeAttr('style').off('click');
        $el.find('.drzCarousel-right-button').removeAttr('style').off('click');
        $el.find('.drzCarousel-image-container').removeAttr('style');
        // remove added inline styling
        $el.find('.drzCarousel-content').stop().removeAttr('style');
        $el.find('.drzCarousel-content-item').each(function rmvInlines() {
          $(this).find('img').removeAttr('style');
        });
      };
    });
    return this;
  };
})(jQuery);

/*
================================
 Drzzle Content Slider Plugin
================================
*/
(function ($) {
  $.fn.drzContentSlider = function contentSlider() {
    var $contentSlider = $(this);
    $contentSlider.each(function initSlider() {
      // slider options
      var $slideDelay = $(this).attr('data-slider-delay');
      if ((typeof $slideDelay === 'undefined' ? 'undefined' : _typeof($slideDelay)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $slideDelay !== false) {
        if ($slideDelay === '') {
          $slideDelay = 4000;
        }
        if ($slideDelay.match(/none/gi)) {
          $slideDelay = false;
        } else {
          $slideDelay = ~~$slideDelay * 1000;
        }
      } else {
        $slideDelay = 4000;
      }

      var $this = $(this);
      var totalImages = $this.find('.drzContentSlider-item').length;
      var interval = void 0;

      $this.append('<div class="drzContentSlider-bullets"></div>');

      $this.find('.drzContentSlider-item').each(function makeLegend() {
        var $img = $(this);
        $img.addClass('item-' + $img.index());
        $img.parent().find('.drzContentSlider-bullets').append('<a href="#" class="drzContentSlider-bullet b-' + $img.index() + '"></a>');
      });

      // set next / back buttons if no bullets
      $this.append('<a class="drzContentSlider-next-btn"></a>');
      $this.append('<a class="drzContentSlider-back-btn"></a>');

      // show / hide controls according to options;
      var $controlOption = $this.attr('data-slider-controls');
      if ((typeof $controlOption === 'undefined' ? 'undefined' : _typeof($controlOption)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $controlOption !== false) {
        if ($controlOption.match(/hide/gi)) {
          $this.find('.drzContentSlider-next-btn, .drzContentSlider-back-btn').hide();
        }
      }

      // set both 1st bullet and 1st image active
      $this.find('.drzContentSlider-item:first-child').show().css('opacity', '1');
      $this.find('.drzContentSlider-bullet:first-child').addClass('active');

      // style bullets according to options
      var $bullets = $this.find('.drzContentSlider-bullets');
      var $bulletOption = $this.attr('data-slider-bullets');
      if ((typeof $bulletOption === 'undefined' ? 'undefined' : _typeof($bulletOption)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $bulletOption !== false) {
        if ($bulletOption.match(/right/gi) || $bulletOption.match(/left/gi)) {
          if ($bulletOption.match(/right/gi)) {
            $bullets.addClass('drzContentSlider-bullets-right');
          }
          if ($bulletOption.match(/left/gi)) {
            $bullets.addClass('drzContentSlider-bullets-left');
          }
          // if bullets are left or right, vertically center them
          $bullets.css('marginTop', -($bullets.outerHeight() / 2));
        }
        if ($bulletOption.match(/bottom/gi)) {
          $bullets.addClass('drzContentSlider-bullets-bottom');
        }
      } else {
        // default bullets position
        $bullets.addClass('drzContentSlider-bullets-bottom');
      }

      var effect = void 0;
      var $effectOption = $this.attr('data-slider-effect');
      if ((typeof $effectOption === 'undefined' ? 'undefined' : _typeof($effectOption)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $effectOption !== false) {
        if ($effectOption === '') {
          $effectOption = 'slide';
        }
      } else {
        $effectOption = 'slide';
      }

      var $sliderWidth = ~~$this.outerWidth();
      if ($effectOption.match(/slide/gi)) {
        effect = { marginLeft: -$sliderWidth };
        $this.find('.drzContentSlider-item').each(function setOpacity() {
          $(this).css('opacity', 1);
        });
      } else if ($effectOption.match(/fade/gi)) {
        effect = { opacity: 0 };
      }

      var animateSpeed = 400;
      var fadeBack = { opacity: 1 };
      var imgNum = 0;

      var hideTO = void 0;
      function hideDelay(e) {
        hideTO = setTimeout(function () {
          e.hide();
        }, animateSpeed);
      }

      var showTO = void 0;
      function showDelay(e) {
        showTO = setTimeout(function () {
          e.show();
          if ($effectOption.match(/fade/gi)) {
            e.animate(fadeBack, animateSpeed);
          }
        }, animateSpeed);
      }

      // call back for resizing slider
      var resizeTimer = void 0;
      var resizeContentSlider = function resizeContentSlider() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          $sliderWidth = ~~$this.outerWidth();
          effect = { marginLeft: -$sliderWidth };
        }, 250);
      };

      function next($element) {
        // if slide option, recalculate container width on resize
        if ($effectOption.match(/slide/gi)) {
          drzzle.window.resize(resizeContentSlider);
        }
        var $currentSlide = $element.find('.drzContentSlider-item.item-' + imgNum);
        $currentSlide.animate(effect, animateSpeed);
        hideDelay($currentSlide);
        imgNum += 1;
        if (imgNum > totalImages - 1) {
          imgNum = 0;
          var $lastSlide = $element.find('.drzContentSlider-item.item-' + (totalImages - 1));
          if ($effectOption.match(/slide/gi)) {
            $element.find('.drzContentSlider-item.item-' + imgNum).show().css('margin-left', $sliderWidth);
            $element.find('.drzContentSlider-item.item-' + imgNum).animate({ marginLeft: 0 }, animateSpeed);
          }
          $lastSlide.animate(effect, animateSpeed);
          hideDelay($lastSlide);
        }
        var $nextSlide = $element.find('.drzContentSlider-item.item-' + imgNum);
        if ($effectOption.match(/slide/gi)) {
          $nextSlide.show().css('margin-left', $sliderWidth).animate({ marginLeft: 0 }, animateSpeed);
        } else if ($effectOption.match(/fade/gi)) {
          showDelay($nextSlide);
        }
        $element.find('.drzContentSlider-bullet.b-' + imgNum).addClass('active').siblings().removeClass('active');
      }

      function back($element) {
        var $currentSlide = $element.find('.drzContentSlider-item.item-' + imgNum);
        if ($effectOption.match(/slide/gi)) {
          $currentSlide.animate({ marginLeft: $sliderWidth }, animateSpeed);
        } else if ($effectOption.match(/fade/gi)) {
          $currentSlide.animate(effect, animateSpeed);
        }
        hideDelay($currentSlide);
        imgNum -= 1;
        // if at the beginning reset to last slide
        if (imgNum < 0) {
          imgNum = totalImages - 1;
        }
        // If at the end reset to 1st slide
        if (imgNum > totalImages - 1) {
          imgNum = 0;
          var $lastSlide = $element.find('.drzContentSlider-item.item-' + (totalImages - 1));
          if ($effectOption.match(/slide/gi)) {
            $lastSlide.css('margin-left', -$sliderWidth);
            $lastSlide.animate({ marginLeft: 0 }, animateSpeed);
          } else if ($effectOption.match(/fade/gi)) {
            $lastSlide.animate(effect, animateSpeed);
          }
          hideDelay($lastSlide);
        }
        var $previousSlide = $element.find('.drzContentSlider-item.item-' + imgNum);
        if ($effectOption.match(/slide/gi)) {
          $previousSlide.show().css('margin-left', -$sliderWidth).animate({ marginLeft: 0 }, animateSpeed);
        } else if ($effectOption.match(/fade/gi)) {
          showDelay($previousSlide);
        }
        $element.find('.drzContentSlider-bullet.b-' + imgNum).addClass('active').siblings().removeClass('active');
      }

      function moveNext(el) {
        clearInterval(interval);
        if ($.isNumeric($slideDelay)) {
          interval = setInterval(function () {
            next(el);
          }, $slideDelay);
        }
      }

      // change slide via next button
      $this.find('.drzContentSlider-next-btn').click(function () {
        next($this);
      });

      // change slide via back button
      $this.find('.drzContentSlider-back-btn').click(function () {
        back($this);
      });

      // for touch swiping
      $this.on('swipeleft', function () {
        next($this);
      });

      $this.on('swiperight', function () {
        back($this);
      });

      // change slide via bullets then reset interval
      $this.find('.drzContentSlider-bullet').click(function clickBullet(e) {
        e.preventDefault();
        var $el = $(this);
        var $bulletNum = $el.index();
        $el.addClass('active').siblings().removeClass('active');
        if ($effectOption.match(/slide/gi)) {
          $this.find('.drzContentSlider-item.item-' + $bulletNum).show().css('margin-left', 0).siblings('.drzContentSlider-item').hide();
        } else if ($effectOption.match(/fade/gi)) {
          $this.find('.drzContentSlider-item.item-' + $bulletNum).show().css('opacity', 1).siblings('.drzContentSlider-item').hide().css('opacity', 0);
        }
        imgNum = $bulletNum;
        moveNext($this);
      });

      // pause slider if hovered over slider
      $this.mouseover(function () {
        clearInterval(interval);
      });
      // continue slider if hovered off
      $this.mouseleave(function () {
        moveNext($this);
      });

      // init the auto sliding
      moveNext($this);

      // Destroy plugin method
      $.fn.drzContentSlider.destroy = function ($el) {
        $el.find('.drzContentSlider-bullets').remove();
        $el.find('.drzContentSlider-next-btn').remove();
        $el.find('.drzContentSlider-back-btn').remove();
        $el.off('swipeleft');
        $el.off('swiperight');
        $el.off('mouseover');
        $el.off('mouseleave');
        $el.find('.drzContentSlider-item').each(function destroyAnimations() {
          $(this).stop().removeAttr('style').removeClass(function (index, className) {
            var cls = className.match(/(^|\s)item-\S+/g);
            if (cls) {
              cls = cls.join(' ');
            } else {
              cls = '';
            }
            return cls;
          });
        });
        drzzle.window.off('resize', resizeContentSlider);
        clearInterval(interval);
        clearTimeout(hideTO);
        clearTimeout(showTO);
      };
    });
    return this;
  };
})(jQuery);

/*
============================
 Drzzle Countdown Plugin
============================
*/
(function ($) {
  $.fn.drzCountDown = function countDown() {
    var $countDown = $(this);
    var tests = void 0;
    $countDown.each(function initPlugin() {
      var $this = $(this);
      var $endMsg = $this.find('.drzCountdown-endedMsg');
      var $timer = $this.find('.drzCountdown-timerContainer');
      var countDownInterval = void 0;
      var checkStartInterval = void 0;

      var actions = {
        tempDate: function tempDate() {
          // create a temp date if no sets exist. (today + 24hrs added)
          var tempDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
          return tempDate;
        },
        orderSets: function orderSets(a, b) {
          // chronologically order sets
          return new Date(a.end).getTime() - new Date(b.end).getTime();
        },
        getBuffer: function getBuffer(opts) {
          // calculate the time to excecute the next set if a buffer exists
          var buffer = false;
          if (opts.buffer) {
            var duration = opts.buffer.split(' ')[1];
            var amount = opts.buffer.split(' ')[0];
            amount = parseInt(amount, 10);
            if (duration.match(/second/gi)) {
              buffer = amount * 1000;
            } else if (duration.match(/minute/gi)) {
              buffer = amount * 60 * 1000;
            } else if (duration.match(/hour/gi)) {
              buffer = amount * 3600 * 1000;
            }
            buffer = new Date(opts.end).getTime() + buffer;
            buffer = new Date(buffer);
          }
          return buffer;
        },
        getRemainingTime: function getRemainingTime(end) {
          // intervals use this to compare remaining time
          var start = new Date();
          var t = Date.parse(end) - Date.parse(start);
          var s = Math.floor(t / 1000 % 60);
          if (s < 0) {
            s = 0;
          }
          var m = Math.floor(t / 1000 / 60 % 60);
          if (m < 0) {
            m = 0;
          }
          var h = Math.floor(t / (1000 * 60 * 60) % 24);
          if (h < 0) {
            h = 0;
          }
          var d = Math.floor(t / (1000 * 60 * 60 * 24));
          if (d < 0) {
            d = 0;
          }
          var payload = {
            total: t,
            days: d,
            hours: h,
            minutes: m,
            seconds: s
          };
          return payload;
        },
        checkStart: function checkStart(set, sets, i) {
          // check if any initial sets are finished
          var st = actions.getRemainingTime(set.end);
          var hasPassed = false;
          // if start time is here,
          if (st.total <= 0) {
            hasPassed = true;
            actions.countDownEnded($this, sets, i);
          } else {
            // helper for editor
            $endMsg.hide();
            $timer.show();
          }
          return hasPassed;
        },
        updateTime: function updateTime($clock, set, sets, i) {
          // get spans where clock numbers are held
          var $daysSpan = $clock.find('.drzCountdown-days');
          var $hoursSpan = $clock.find('.drzCountdown-hours');
          var $minutesSpan = $clock.find('.drzCountdown-minutes');
          var $secondsSpan = $clock.find('.drzCountdown-seconds');
          var t = actions.getRemainingTime(set.end);
          // update the numbers in each part of the clock
          $daysSpan.html(t.days);
          $hoursSpan.html(('0' + t.hours).slice(-2));
          $minutesSpan.html(('0' + t.minutes).slice(-2));
          $secondsSpan.html(('0' + t.seconds).slice(-2));

          // if time ends
          if (t.total <= 0) {
            clearInterval(countDownInterval);
            actions.countDownEnded($this, sets, i);
          }
        },
        sameTime: function sameTime(date, currently) {
          return date.getFullYear() === currently.getFullYear() && date.getMonth() === currently.getMonth() && date.getDate() === currently.getDate() && date.getHours() === currently.getHours() && date.getMinutes() === currently.getMinutes() && date.getSeconds() === currently.getSeconds();
        },
        getNextOccurance: function getNextOccurance(set) {
          var time = new Date(set.end);
          var seconds = time.getSeconds();
          var minutes = time.getMinutes();
          var hours = time.getHours();
          var next = new Date();
          var newDate = new Date();
          var dow = void 0;
          // currently the only allowed occurrance is weekly
          if (set.recurring.match(/week/gi)) {
            var day = set.end.toString();
            day = day.split(' ')[0];
            if (day.match(/Sun/gi)) {
              dow = 0;
            } else if (day.match(/Mon/gi)) {
              dow = 1;
            } else if (day.match(/Tue/gi)) {
              dow = 2;
            } else if (day.match(/Wed/gi)) {
              dow = 3;
            } else if (day.match(/Thu/gi)) {
              dow = 4;
            } else if (day.match(/Fri/gi)) {
              dow = 5;
            } else if (day.match(/Sat/gi)) {
              dow = 6;
            }
            var n = dow + (7 - next.getDay());
            newDate.setDate(next.getDate() + n % 7);
            newDate.setSeconds(seconds);
            newDate.setMinutes(minutes);
            newDate.setHours(hours);

            // when the last end time in recurring list is built, it will
            // inifinately loop, so we need to properly add a week to it.
            if (newDate < new Date() || actions.sameTime(newDate, new Date())) {
              newDate.setUTCDate(newDate.getUTCDate() + 7);
            }
          }
          return newDate;
        },
        recurring: function recurring(sets) {
          var recurringSets = [];
          for (var i = 0; i <= sets.length - 1; i++) {
            var set = sets[i];
            if (set.recurring) {
              set.end = actions.getNextOccurance(set);
              recurringSets.push(set);
            }
          }
          // if there are any recurring sets, init them
          if (recurringSets.length > 0) {
            $endMsg.hide();
            $timer.show();
            recurringSets = recurringSets.sort(actions.orderSets);
            actions.initCountDown($this, recurringSets[0], recurringSets, 0);
          }
        },
        countDownEnded: function countDownEnded($el, sets, i) {
          clearInterval(checkStartInterval);
          clearInterval(countDownInterval);
          var liveSet = sets[i];
          $timer.hide();
          $endMsg.show();
          $endMsg.html('<h4 class="drz-h4 drzCountdown-endMessage">\n              ' + (liveSet.endMessage || '') + '\n            </h4>');

          // check if there is another countdown then buffer
          var newIndex = i + 1;
          var nextSet = sets[newIndex];
          var buffer = actions.getBuffer(liveSet);
          if ((typeof nextSet === 'undefined' ? 'undefined' : _typeof(nextSet)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && nextSet !== false) {
            if (buffer) {
              checkStartInterval = setInterval(function () {
                var t = actions.getRemainingTime(buffer);
                if (t.total <= 0) {
                  // if buffer time is now passed, proceed with next
                  $endMsg.hide();
                  $timer.show();
                  actions.initCountDown($this, nextSet, sets, newIndex);
                  clearInterval(checkStartInterval);
                }
              }, 500);
            } else {
              // run initCountDown on next if no buffer
              $endMsg.hide();
              $timer.show();
              actions.initCountDown($this, nextSet, sets, newIndex);
            }
          } else if (liveSet.buffer) {
            // if all countdowns sets are done, find the next "recurring one(s) and start that one"
            checkStartInterval = setInterval(function () {
              var t = actions.getRemainingTime(buffer);
              if (t.total <= 0) {
                // if buffer time is now passed, proceed with next
                $endMsg.hide();
                $timer.show();
                actions.recurring(sets);
                clearInterval(checkStartInterval);
              }
            }, 100);
          } else {
            actions.recurring(sets);
          }
        },
        initCountDown: function initCountDown(el, set, sets, i) {
          actions.updateTime(el, set, sets, i);
          countDownInterval = setInterval(function () {
            actions.updateTime(el, set, sets, i);
          }, 1000);
        }
      };

      if (!tests) {
        tests = actions;
      }

      // init plugin
      function initSetChecks() {
        // set the current endtime
        var $opts = $this.attr('data-countdown');
        // default options
        var defaultSet = [{
          end: actions.tempDate(),
          buffer: false,
          endMessage: 'Countdown Ended!',
          recurring: false
        }];
        // configure custom options
        if ((typeof $opts === 'undefined' ? 'undefined' : _typeof($opts)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $opts !== false) {
          $opts = JSON.parse($opts);
          var sets = $opts.sets.length;
          $opts.sets = $opts.sets.sort(actions.orderSets);
          if (sets > 0) {
            for (var i = 0; i <= sets - 1; i++) {
              var set = $.extend(true, {}, defaultSet[0], $opts.sets[i]);
              $opts.sets[i] = set;
              // check if any of the end times have passed
              if (!actions.checkStart(set, $opts.sets, i)) {
                actions.initCountDown($this, set, $opts.sets, i);
                return;
              }
            }
          } else {
            // if no sets exist, start default
            actions.initCountDown($this, defaultSet[0], defaultSet, 0);
          }
        } else {
          // if no options passed at all, start default
          actions.initCountDown($this, defaultSet[0], defaultSet, 0);
        }
      }
      initSetChecks();
      $.fn.drzCountDown.reset = function () {
        clearInterval(countDownInterval);
        clearInterval(checkStartInterval);
        initSetChecks();
      };
    });
    $.fn.drzCountDown.test = tests || {};
    return this;
  };
})(jQuery);

/*
============================
 Drzzle Footer Nav Plugin
============================
*/
(function ($) {
  $.fn.drzFooterNav = function drzFooterNav() {
    var $topLink = $(this).find('.drzFooterNav-list-topLink');

    $topLink.click(function (e) {
      var $this = $(e.currentTarget);
      if (window.matchMedia(drzzle.viewports.mobile).matches) {
        e.preventDefault();
        // if there us even a dropdown menu
        if ($this.next('ul').length) {
          $this.next('ul').slideToggle(200);
          $this.parent().siblings().find('.drzFooterNav-list-subList').slideUp(200);
        }
      }
    });

    // show links callback
    function linkDisplays() {
      if (window.matchMedia(drzzle.viewports.desktop).matches || window.matchMedia(drzzle.viewports.tablet).matches) {
        $topLink.next('ul').show();
      } else if (window.matchMedia(drzzle.viewports.mobile).matches) {
        $topLink.next('ul').hide();
      }
    }

    var resizeTimer = void 0;
    drzzle.window.resize(function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(linkDisplays, 250);
    });

    $.fn.drzFooterNav.destroy = function ($el) {
      // grab attached selectors and remove attached listeners
      $el.find('.drzFooterNav-list-topLink').off('click');
    };

    return this;
  };
})(jQuery);

/*
=================================
 Drzzle Form Validation Plugin
=================================
*/
(function ($) {
  $.fn.drzFormValidate = function formValidate(fn) {
    var $form = $(this);
    $form.each(function initValidation() {
      var $this = $(this);
      $this.attr('novalidate', true);
      var types = '\n        input[type=text],\n        input[type=email],\n        input[type=number],\n        input[type=date],\n        input[type=tel],\n        input[type=url],\n        input[type=password],\n        textarea,\n        select\n      ';

      $.expr.pseudos.required = function check(field) {
        return $(field).attr('data-validator') === 'required';
      };

      var errors = false;

      var validate = {
        type: function type(e, field) {
          var typeMsg = field.typeMsg;
          if (!field.input.val().match(field.format)) {
            e.preventDefault();
            errors = true;
            field.input.next('.drzValidator-msg').find('.drzValidator-msg-type').html(typeMsg).fadeIn();
          }
          field.input.keyup(function () {
            if (field.input.val().match(field.format)) {
              errors = false;
              field.input.removeClass('drzValidator-req-border');
              field.input.next('.drzValidator-msg').find('.drzValidator-msg-type').fadeOut();
            } else {
              errors = true;
              field.input.addClass('drzValidator-req-border');
              field.input.next('.drzValidator-msg').find('.drzValidator-msg-type').html(typeMsg).fadeIn();
            }
          });
        }
      };

      $this.submit(function (e) {
        e.preventDefault();
        $this.find(types).not('.checkbox-group input').not('.radio-group input').each(function onSubmit() {
          var $el = $(this);
          var inputType = $el.attr('type');
          var msg = void 0;
          var $newMsgElement = $('\n              <div class="drzValidator-msg">\n                <div class="drzValidator-msg-required"></div>\n                <div class="drzValidator-msg-type"></div>\n                <div class="drzValidator-msg-min"></div>\n                <div class="drzValidator-msg-max"></div>\n                <div class="drzValidator-msg-value"></div>\n                <div class="drzValidator-msg-regex"></div>\n              </div>\'\n            ');

          if (!$el.next('.drzValidator-msg').length) {
            $newMsgElement.insertAfter($el);
          }

          if ($el.is(':required')) {
            $el.keyup(function () {
              if ($el.val() !== '') {
                errors = false;
                $el.removeClass('drzValidator-req-border');
                $el.next('.drzValidator-msg').find('.drzValidator-msg-required').fadeOut();
              } else {
                errors = true;
                $el.addClass('drzValidator-req-border');
                var _$msgAttr = $el.attr('data-validator-msg');
                if ((typeof _$msgAttr === 'undefined' ? 'undefined' : _typeof(_$msgAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && _$msgAttr !== false) {
                  msg = $el.attr('data-validator-msg');
                } else {
                  msg = 'This value is required.';
                }
                $el.next('.drzValidator-msg').find('.drzValidator-msg-required').html(msg).fadeIn();
              }
            });

            // key up functions for blank value validation
            $el.keyup(function () {
              if ($el.val() !== '') {
                errors = false;
                $el.removeClass('drzValidator-req-border');
                $el.next('.drzValidator-msg').find('.drzValidator-msg-required').fadeOut();
              } else {
                errors = true;
                $el.addClass('drzValidator-req-border');
                $el.next('.drzValidator-msg').find('.drzValidator-msg-required').html(msg).fadeIn();
              }
            });
          }

          if ($el.is(':required') && $el.val() === '') {
            e.preventDefault();
            errors = true;
            $el.addClass('drzValidator-req-border');

            // set the error message
            var _$msgAttr2 = $el.attr('data-validator-msg');

            // check for custom msg, if none, assign the default
            if ((typeof _$msgAttr2 === 'undefined' ? 'undefined' : _typeof(_$msgAttr2)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && _$msgAttr2 !== false) {
              msg = $el.attr('data-validator-msg');
            } else {
              msg = 'This value is required.';
            }

            $el.next('.drzValidator-msg').find('.drzValidator-msg-required').html(msg).fadeIn();
          }

          // min, max validation
          var $minAttr = $el.attr('data-validator-min');
          var $maxAttr = $el.attr('data-validator-max');
          var $inputValue = void 0;
          var minMsg = void 0;
          var maxMsg = void 0;

          if ((typeof $minAttr === 'undefined' ? 'undefined' : _typeof($minAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $minAttr !== false || (typeof $maxAttr === 'undefined' ? 'undefined' : _typeof($maxAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $maxAttr !== false) {
            // if min attribute exists
            if ((typeof $minAttr === 'undefined' ? 'undefined' : _typeof($minAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $minAttr !== false) {
              $minAttr = $el.attr('data-validator-min');
              if (inputType === 'number') {
                minMsg = 'Value must be at least ' + $minAttr + '.';
                $inputValue = ~~$el.val();
              } else {
                minMsg = 'There is a minimun limit of ' + $minAttr + ' charachters for this value.';
                $inputValue = $el.val().length;
              }
            }

            // if max attribute exists
            if ((typeof $maxAttr === 'undefined' ? 'undefined' : _typeof($maxAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $maxAttr !== false) {
              $maxAttr = $el.attr('data-validator-max');
              if (inputType === 'number') {
                $inputValue = ~~$el.val();
                maxMsg = 'Value must not be greater than ' + $maxAttr + '.';
              } else {
                maxMsg = 'There is a maximum limit of ' + $maxAttr + ' charachters for this value.';
                $inputValue = $el.val().length;
              }
            }

            // if user input is less than the min value
            if ($el.val() !== '' || $el.is(':required')) {
              if ($inputValue < $minAttr) {
                e.preventDefault();
                errors = true;
                $el.addClass('drzValidator-req-border');
                $el.next('.drzValidator-msg').find('.drzValidator-msg-min').html(minMsg).fadeIn();
              }
              // keyup for min/max number inputs
              $el.keyup(function () {
                if (inputType === 'number') {
                  $inputValue = ~~$el.val();
                } else {
                  $inputValue = $el.val().length;
                }
                if ($el.val() !== '') {
                  if ($inputValue < $minAttr) {
                    errors = true;
                    $el.addClass('drzValidator-req-border');
                    $el.next('.drzValidator-msg').find('.drzValidator-msg-min').html(minMsg).fadeIn();
                  } else {
                    if ((typeof $maxAttr === 'undefined' ? 'undefined' : _typeof($maxAttr)) === (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $maxAttr === false) {
                      errors = false;
                      $el.removeClass('drzValidator-req-border');
                    }
                    if ((typeof $maxAttr === 'undefined' ? 'undefined' : _typeof($maxAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $maxAttr !== false && $inputValue <= $maxAttr) {
                      errors = false;
                      $el.removeClass('drzValidator-req-border');
                    }
                    $el.next('.drzValidator-msg').find('.drzValidator-msg-min').fadeOut();
                  }
                }
              });

              // if user input is more than the max value
              if ($inputValue > $maxAttr) {
                e.preventDefault();
                errors = true;
                $el.addClass('drzValidator-req-border');
                $el.next('.drzValidator-msg').find('.drzValidator-msg-max').html(maxMsg).fadeIn();
              }
              $el.keyup(function () {
                if (inputType === 'number') {
                  $inputValue = ~~$el.val();
                } else {
                  $inputValue = $el.val().length;
                }
                if ($el.val() !== '') {
                  if ($inputValue > $maxAttr) {
                    errors = true;
                    $el.addClass('drzValidator-req-border');
                    $el.next('.drzValidator-msg').find('.drzValidator-msg-max').html(maxMsg).fadeIn();
                  } else {
                    if ((typeof $minAttr === 'undefined' ? 'undefined' : _typeof($minAttr)) === (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $minAttr === false) {
                      errors = false;
                      $el.removeClass('drzValidator-req-border');
                    }
                    if ((typeof $minAttr === 'undefined' ? 'undefined' : _typeof($minAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $minAttr !== false && $inputValue >= $minAttr) {
                      errors = false;
                      $el.removeClass('drzValidator-req-border');
                    }
                    $el.next('.drzValidator-msg').find('.drzValidator-msg-max').fadeOut();
                  }
                }
              });
            }
          } // end min, max validation

          // number value only check
          var $valAttr = $el.attr('data-validator-value');
          var valMsg = void 0;

          if ((typeof $valAttr === 'undefined' ? 'undefined' : _typeof($valAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $valAttr !== false && $valAttr.match(/number/i)) {
            $valAttr = $el.attr('data-validator-value');
            valMsg = 'Value must be an integer.';

            if ($el.val() !== '' || $el.is(':required')) {
              if (!$.isNumeric($el.val())) {
                e.preventDefault();
                errors = true;
                $el.addClass('drzValidator-req-border');
                $el.next('.drzValidator-msg').find('.drzValidator-msg-value').html(valMsg).fadeIn();
              }
              $el.keyup(function () {
                if ($el.val() !== '') {
                  if (!$.isNumeric($el.val())) {
                    errors = true;
                    $el.addClass('drzValidator-req-border');
                    $el.next('.drzValidator-msg').find('.drzValidator-msg-value').html(valMsg).fadeIn();
                  } else {
                    errors = false;
                    $el.removeClass('drzValidator-req-border');
                    $el.next('.drzValidator-msg').find('.drzValidator-msg-value').fadeOut();
                  }
                }
              });
            }
          }

          // regex value only check
          var $regexAttr = $el.attr('data-validator-regex');
          var regexMsg = void 0;

          if ((typeof $regexAttr === 'undefined' ? 'undefined' : _typeof($regexAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $regexAttr !== false) {
            $regexAttr = $el.attr('data-validator-regex');
            $regexAttr = new RegExp($regexAttr, 'gi');
            regexMsg = 'Value not entered in a correct format.';

            if ($el.val() !== '' || $el.is(':required')) {
              if (!$el.val().match($regexAttr)) {
                e.preventDefault();
                errors = true;
                $el.addClass('drzValidator-req-border');
                $el.next('.drzValidator-msg').find('.drzValidator-msg-regex').html(regexMsg).fadeIn();
              }
              $el.keyup(function () {
                if ($el.val() !== '') {
                  if (!$el.val().match($regexAttr)) {
                    errors = true;
                    $el.addClass('drzValidator-req-border');
                    $el.next('.drzValidator-msg').find('.drzValidator-msg-regex').html(regexMsg).fadeIn();
                  } else {
                    errors = false;
                    $el.removeClass('drzValidator-req-border');
                    $el.next('.drzValidator-msg').find('.drzValidator-msg-regex').fadeOut();
                  }
                }
              });
            }
          }

          // email validation
          if (inputType === 'email' && $el.is(':required')) {
            if ((typeof $msgAttr === 'undefined' ? 'undefined' : _typeof($msgAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $msgAttr !== false) {
              // eslint-disable-line
              msg = $el.attr('data-validator-msg');
            } else {
              msg = 'This value is required.';
            }
            validate.type(e, {
              input: $el,
              check: 'email',
              typeMsg: 'Valid email required.',
              format: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
            });
          }

          // phone validation
          if (inputType === 'tel' && $el.is(':required')) {
            if ((typeof $msgAttr === 'undefined' ? 'undefined' : _typeof($msgAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $msgAttr !== false) {
              // eslint-disable-line
              msg = $el.attr('data-validator-msg');
            } else {
              msg = 'This value is required.';
            }
            validate.type(e, {
              input: $el,
              check: 'tel',
              typeMsg: 'Valid phone number required',
              format: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
            });
          }

          // website validation
          if (inputType === 'url' && $el.is(':required')) {
            if ((typeof $msgAttr === 'undefined' ? 'undefined' : _typeof($msgAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $msgAttr !== false) {
              // eslint-disable-line
              msg = $el.attr('data-validator-msg');
            } else {
              msg = 'This value is required.';
            }
            validate.type(e, {
              input: $el,
              check: 'url',
              typeMsg: 'Valid URL required',
              format: /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
            });
          }

          // select (dropdown) validation
          if ($el.is('select')) {
            $el.change(function () {
              if ($el.val() !== '') {
                errors = false;
                $el.removeClass('drzValidator-req-border');
                $el.next('.drzValidator-msg').find('.drzValidator-msg-required').fadeOut();
              } else {
                errors = true;
                $el.addClass('drzValidator-req-border');
                $el.next('.drzValidator-msg').find('.drzValidator-msg-required').html(msg).fadeIn();
              }
            });
          } // end select validation
        });

        // checkbox and radio validation
        $this.find('.checkbox-group, .radio-group').each(function initOptions() {
          var $el = $(this);
          var $newMsgElement = $('<div class="drzValidator-msg"><div class="drzValidator-msg-required"></div></div>');
          var type = void 0;
          var findType = void 0;

          if ($el.hasClass('radio-group')) {
            findType = $el.find('input[type=radio]');
            type = 'input[type=radio]';
          }

          if ($el.hasClass('checkbox-group')) {
            findType = $el.find('input[type=checkbox]');
            type = 'input[type=checkbox]';
          }

          if ($el.is(':required') && $el.find(type + ':checked').length <= 0) {
            e.preventDefault();
            errors = true;
            findType.addClass('drzValidator-req-border');

            if (!$el.find('.drzValidator-msg').length) {
              $el.append($newMsgElement);
            }

            // set the error message
            var _$msgAttr3 = $el.attr('data-validator-msg');
            var msg = void 0;

            // check for custom msg, if none assign the default
            if ((typeof _$msgAttr3 === 'undefined' ? 'undefined' : _typeof(_$msgAttr3)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && _$msgAttr3 !== false) {
              msg = $el.attr('data-validator-msg');
            } else {
              msg = 'You must check at least one.';
            }
            $el.find('.drzValidator-msg').find('.drzValidator-msg-required').html(msg).fadeIn();

            // on checked
            findType.change(function () {
              if ($el.find(type + ':checked').length > 0) {
                errors = false;
                findType.removeClass('drzValidator-req-border');
                $el.find('.drzValidator-msg').find('.drzValidator-msg-required').fadeOut();
              } else {
                errors = true;
                findType.addClass('drzValidator-req-border');
                $el.find('.drzValidator-msg').find('.drzValidator-msg-required').html(msg).fadeIn();
              }
            });
          }
        });
        // run form logic after validation passes
        if (fn && !errors) {
          fn();
        }
      });

      // Destroy method
      $.fn.drzFormValidate.destroy = function ($el) {
        $el.find(types).each(function removeEvents() {
          var $field = $(this);
          var $type = $field.attr('type');
          if ($field.is('select') || $type === 'radio' || $type === 'checkbox') {
            $field.off('change');
          } else {
            $field.off('keyup');
          }
        });
        $el.find('.drzValidator-msg').remove();
        $el.find('.drzValidator-req-border').removeClass('drzValidator-req-border');
      };
    });
    return this;
  };
})(jQuery);

/*
============================
 Drzzle Maps Plugin
============================
*/
(function ($) {
  $.fn.drzMap = function styleMap() {
    var $googleMap = $(this);
    $googleMap.each(function initPlugin() {
      var $this = $(this);
      var $mapNode = $this.find('.drzMap-container');
      var $zoomInBtn = $this.find('.drzMap-zoomIn').get(0);
      var $zoomOutBtn = $this.find('.drzMap-zoomOut').get(0);
      var $googleContainer = $this.find('.drzMap-container').get(0);
      var $addressSection = $this.find('.drzMap-address');
      var $win = $(window);
      // google map custom marker icon - .png fallback for IE11
      var isIE11 = navigator.userAgent.toLowerCase().indexOf('trident') > -1;

      var actions = {
        getHex: function getHex(c) {
          var color = c;
          if (/^#[0-9A-F]{6}$/i.test(color)) {
            return color;
          }
          color = c.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/) || c.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
          function hex(x) {
            return ('0' + parseInt(x, 10).toString(16)).slice(-2);
          }
          return '#' + hex(color[1]) + hex(color[2]) + hex(color[3]);
        },
        CustomZoomControl: function CustomZoomControl(controlDiv, map, baseColor) {
          // grab the zoom elements from the DOM and insert them in the map
          if ($zoomInBtn !== undefined && $zoomOutBtn !== undefined) {
            $zoomInBtn.style.backgroundColor = baseColor;
            $zoomOutBtn.style.backgroundColor = baseColor;
            var controlUIzoomIn = $zoomInBtn;
            var controlUIzoomOut = $zoomOutBtn;
            controlDiv.appendChild(controlUIzoomIn);
            controlDiv.appendChild(controlUIzoomOut);
            controlDiv.classList.add('drzMap-zoomContainer');

            // Setup the click event listeners and zoom in or out according
            // to the clicked element
            google.maps.event.addDomListener(controlUIzoomIn, 'click', function () {
              map.setZoom(map.getZoom() + 1);
            });
            google.maps.event.addDomListener(controlUIzoomOut, 'click', function () {
              map.setZoom(map.getZoom() - 1);
            });
          }
        },
        getImgPin: function getImgPin(img) {
          var pin = img;
          if (window.__editor && !img.match(/^http/gi)) {
            var prefix = process.env.NODE_ENV === 'development' ? '' : 'file://';
            prefix = '' + prefix + process.env._staticWrite; // eslint-disable-line
            pin = prefix + '/' + window._currentSite.name + img; // eslint-disable-line
          }
          return pin;
        },
        renderMap: function renderMap(opts) {
          var $opts = opts;
          var defaults = {
            baseColor: $addressSection.css('background-color'),
            markers: []
          };

          // configure custom options
          if ((typeof $opts === 'undefined' ? 'undefined' : _typeof($opts)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $opts !== false) {
            if (typeof $opts === 'string') {
              $opts = JSON.parse($opts);
            }
            $opts = $.extend(true, {}, defaults, $opts);
          } else {
            $opts = defaults;
          }

          if ($opts.useBg) {
            $opts.baseColor = actions.getHex($addressSection.css('background-color'));
          }

          // style/look settings
          var saturationValue = -20;
          var brightnessValue = 5;
          var baseColor = actions.getHex($opts.baseColor);

          var styles = [{
            // set saturation for the labels on the map
            elementType: 'labels',
            stylers: [{ saturation: saturationValue }]
          }, {
            // point of interest - don't show these lables on the map
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }, {
            // don't show highways lables on the map
            featureType: 'road.highway',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }, {
            // don't show local road lables on the map
            featureType: 'road.local',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
          }, {
            // don't show arterial road lables on the map
            featureType: 'road.arterial',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
          }, {
            // don't show road lables on the map
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ visibility: 'off' }]
          },
          // style different elements on the map
          {
            featureType: 'transit',
            elementType: 'geometry.fill',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }, {
            featureType: 'poi',
            elementType: 'geometry.fill',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }, {
            featureType: 'poi.government',
            elementType: 'geometry.fill',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }, {
            featureType: 'poi.sports_complex',
            elementType: 'geometry.fill',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }, {
            featureType: 'poi.attraction',
            elementType: 'geometry.fill',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }, {
            featureType: 'poi.business',
            elementType: 'geometry.fill',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }, {
            featureType: 'transit',
            elementType: 'geometry.fill',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }, {
            featureType: 'transit.station',
            elementType: 'geometry.fill',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }, {
            featureType: 'landscape',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }, {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }, {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }, {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ hue: baseColor }, { visibility: 'on' }, { lightness: brightnessValue }, { saturation: saturationValue }]
          }];
          var markers = [];
          // set google map options
          var mapOptions = {
            zoom: 15,
            panControl: false,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            styles: styles
          };
          if ($opts.markers.length <= 1) {
            mapOptions.center = new google.maps.LatLng($opts.markers[0].lat, $opts.markers[0].lng);
          }

          var map = new google.maps.Map($googleContainer, mapOptions);
          drzzle.googleMaps.push(map);
          // prep for auto centering
          var bounds = new google.maps.LatLngBounds();
          // build markers

          var _loop = function _loop(i) {
            var m = $opts.markers[i];
            var toolTip = '<div class="drzMap-markerTip">\n              <span class="drzMap-markerTitle">' + (m.title || '') + '</span>\n              <span class="drzMap-markerAddr">' + (m.address || '') + '</span>\n              </div>';
            var infowindow = new google.maps.InfoWindow({
              content: toolTip,
              maxWidth: 200
            });
            var position = new google.maps.LatLng(m.lat, m.lng);
            var markerUrl = isIE11 ? 'https://s3-us-west-1.amazonaws.com/drz-assets/mock-images/icons/maps-default-pin.png' : actions.getImgPin(m.markerImg);
            bounds.extend(position);
            var marker = new google.maps.Marker({
              position: position,
              map: map,
              visible: true,
              icon: markerUrl
            });
            marker.addListener('click', function () {
              infowindow.open(map, marker);
            });
            markers.push(marker);
          };

          for (var i = 0; i < $opts.markers.length; i++) {
            _loop(i);
          }
          // auto center and zoom if multiple markers
          if (markers.length > 1) {
            map.fitBounds(bounds); // auto zoom
            map.panToBounds(bounds); // auto center
          }
          // after map loads, then append zoom controls
          google.maps.event.addListenerOnce(map, 'idle', function () {
            // init custom zoom controls
            var zoomControlDiv = document.createElement('div');
            var zoomControl = new actions.CustomZoomControl(zoomControlDiv, map, $opts.baseColor); // eslint-disable-line
            // insert the zoom div on the top left of the map
            map.controls[google.maps.ControlPosition.LEFT_TOP].push(zoomControlDiv);
          });
        }
      };

      // if map exists on page, init it
      var reDraw = void 0;
      if ($mapNode.length) {
        var $opts = $this.attr('data-google-map');
        var resizeTimer = void 0;
        var start = true;
        var startBg = void 0;
        reDraw = function reDraw() {
          if (start && JSON.parse($opts).useBg) {
            start = false;
            startBg = $addressSection.css('background-color');
          }
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            // only redraw map if new color is present
            if (startBg !== $addressSection.css('background-color')) {
              actions.renderMap($opts);
            }
            start = true;
          }, 250);
        };
        $win.resize(reDraw);
        // initialize map on page load
        actions.renderMap($opts);
      }
      // destroy listeners
      $.fn.drzMap.destroy = function () {
        $win.off('resize', reDraw);
      };
    });
    return this;
  };
})(jQuery);

/*
================================
 Drzzle Image Gallery Plugin
================================
*/
(function ($) {
  $.fn.drzImageGallery = function imageGallery() {
    var index = void 0;
    var totalImages = void 0;
    var displayNum = void 0;
    var isGalleryModal = void 0;
    var escClose = void 0;
    var $thisImg = void 0;
    var $legend = void 0;
    var $backBtn = void 0;
    var $nextBtn = void 0;
    var $closeBtn = void 0;
    var $body = $('body');
    var $doc = $(document);
    var $imageGallery = $(this);

    // callbacks
    function moveBack(e) {
      e.preventDefault();
      if (index > 0) {
        $thisImg.eq(index).removeClass('block');
        index -= 1;
        displayNum = index + 1;
        $thisImg.eq(index).addClass('block');
        $legend.html(displayNum + ' / ' + totalImages);
        if (index === 0) {
          $backBtn.css('visibility', 'hidden');
        }
        if (index < totalImages - 1) {
          $nextBtn.css('visibility', 'visible');
        }
      }
    }

    function moveNext(e) {
      e.preventDefault();
      if (index <= totalImages - 2) {
        $thisImg.eq(index).removeClass('block');
        index += 1;
        displayNum = index + 1;
        $thisImg.eq(index).addClass('block');
        $legend.html(displayNum + ' / ' + totalImages);
        if (index === totalImages - 1) {
          $nextBtn.css('visibility', 'hidden');
        }
        if (index > 0) {
          $backBtn.css('visibility', 'visible');
        }
      }
    }
    // for keyboard controls
    var galleryKeys = function galleryKeys(e) {
      if (isGalleryModal) {
        if (e.keyCode === 39) {
          moveNext(e);
        }
        if (e.keyCode === 37) {
          moveBack(e);
        }
      }
    };
    $doc.keydown(galleryKeys);

    $imageGallery.each(function initGallery() {
      var _this2 = this;

      var $this = $(this);
      isGalleryModal = false;

      $this.find('.drzImageGallery-img').click(function (e) {
        e.preventDefault();
        var $newBuild = $this.html();
        var $el = $(e.currentTarget);
        totalImages = ~~$this.find('.drzImageGallery-img').length;
        isGalleryModal = true;
        if ($el.parent().attr('class').match(/pg-page-/gi)) {
          index = ~~$el.closest('.drzImageGallery').find('.drzImageGallery-img').index(_this2);
        } else {
          index = ~~$el.index();
        }
        displayNum = index + 1;

        var modal = '<div class="drzModal-overlay drzImageGallery-modal">\n          <div class="drzModal-closeRow">\n            <a class="drzModal-closeLink" href="#"></a>\n          </div>\n          <div class="drzModal-content drzImageGallery-content">\n            <div class="drzImageGallery-controls">\n              <span class="drzImageGallery-legend">' + displayNum + ' / ' + totalImages + '</span>\n              <button class="drzBtn drzImageGallery-btn drzImageGallery-btnBack"></button>\n              <button class="drzBtn drzImageGallery-btn drzImageGallery-btnNext"></button>\n            </div>\n            ' + $newBuild + '\n          </div>\n        </div>';

        $(modal).insertAfter($body);
        var $overlay = $body.next('.drzModal-overlay');
        var $content = $overlay.find('.drzModal-content');
        $overlay.fadeIn();

        $thisImg = $body.next('.drzImageGallery-modal').find('.drzImageGallery-img');
        $backBtn = $body.next('.drzImageGallery-modal').find('.drzImageGallery-btnBack');
        $nextBtn = $body.next('.drzImageGallery-modal').find('.drzImageGallery-btnNext');
        $legend = $body.next('.drzImageGallery-modal').find('.drzImageGallery-legend');
        $closeBtn = $body.next('.drzImageGallery-modal').find('.drzModal-closeLink');

        if (index === 0) {
          $backBtn.css('visibility', 'hidden');
        }
        if (index === totalImages - 1) {
          $nextBtn.css('visibility', 'hidden');
        }
        // if paginated, remove page wrappers in modal
        if ($thisImg.parent().attr('class').match(/pg-page-/gi)) {
          $thisImg.unwrap();
          // reset variable
          $thisImg = $body.next('.drzImageGallery-modal').find('.drzImageGallery-img');
        }
        // show clicked image
        $thisImg.siblings().removeClass('block');
        $thisImg.eq(index).addClass('block');

        $nextBtn.click(moveNext);
        $backBtn.click(moveBack);
        $thisImg.on('swipeleft', moveNext);
        $thisImg.on('swiperight', moveBack);

        function closeGallery(evt) {
          evt.preventDefault();
          isGalleryModal = false;
          $overlay.fadeOut(300);
          setTimeout(function () {
            $overlay.remove();
          }, 300);
        }

        escClose = function escClose(evt) {
          if (isGalleryModal && evt.key === 'Escape') {
            closeGallery(evt);
          }
        };

        $closeBtn.click(function (evt) {
          return closeGallery(evt);
        });
        $overlay.click(function (evt) {
          return closeGallery(evt);
        });
        $content.click(function (evt) {
          return evt.stopPropagation();
        });
        $doc.keyup(function (evt) {
          return escClose(evt);
        });
      });
      // destroy function
      $.fn.drzImageGallery.destroy = function ($el) {
        $el.find('.drzImageGallery-img').off('click');
        $doc.off('keydown', galleryKeys);
        $doc.off('keydown', escClose);
      };
    });
    return this;
  };
})(jQuery);

/*
============================
 Drzzle Nav Plugin
============================
*/
(function ($) {
  $.fn.drzNav = function drzNav() {
    var $this = $(this);
    var $navList = $this.find('.drzNav-list');
    var $dropDownLink = $this.find('.drzNav-link-dropDown');
    var $subDropDownLink = $this.find('.drzNav-link-subDropDown');
    var $navHamburger = $this.find('.drzNav-hamburger');
    var $navLogo = $this.find('.drzNav-logo');
    var $navSearch = $this.find('.drzNav-search');
    var $linksWidth = ~~$navList.outerWidth();
    var slShowCls = 'drzNav-subList-show';
    var slCls = '.drzNav-subList';
    // options
    var $opts = $this.attr('data-nav-slide');
    var defaults = {
      slideDirection: 'left'
    };
    // configure custom options
    if ((typeof $opts === 'undefined' ? 'undefined' : _typeof($opts)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $opts !== false && $opts !== '') {
      $opts = {
        slideDirection: $opts
      };
      $opts = $.extend(true, {}, defaults, $opts);
    } else {
      $opts = defaults;
    }
    var slideDirection = $opts.slideDirection;

    // Assign defaults for variables
    var navIsContained = false;
    var sliderIsOpen = false;
    var $navWidth = ~~$this.outerWidth();
    var $hamburgerWidth = 0;
    var $logoWidth = 0;
    var $logoMarginLeft = 0;
    var $logoMarginRight = 0;
    var $searchWidth = 0;
    var $searchMarginLeft = 0;
    var $searchMarginRight = 0;

    if ($navHamburger.is(':visible')) {
      $hamburgerWidth = ~~$navHamburger.outerWidth();
    }
    if ($navLogo.is(':visible')) {
      $logoWidth = ~~$navLogo.outerWidth();
    }

    // Insert slide out container
    var $sliderContainer = $('<div class="drzNav-overlay">\n        <div class="drzNav-slideContainer drzNav-slideContainer-' + slideDirection + '">\n          <div class="drzNav-sliderClose-row">\n            <button class="drzNav-sliderClose-btn"></button>\n          </div>\n        </div>\n      </div>');

    $sliderContainer.insertAfter($this);
    var $sliderOverlay = $this.next('.drzNav-overlay');
    $sliderContainer = $sliderOverlay.find('.drzNav-slideContainer');
    var $closeSliderBtn = $sliderContainer.find('.drzNav-sliderClose-btn');

    $.expr.filters.offscreen = function (el) {
      var $el = $(el);
      var $window = $(window);
      return $el.offset().left + ($el.outerWidth() - $window.scrollLeft()) > $window.width() || $el.offset().left < $window.scrollLeft();
    };

    var navActions = {
      desktopDropDown: function desktopDropDown($ddLink) {
        var $nextMenu = $ddLink.next(slCls);
        var delay = 400;
        var offTimer = void 0;
        $ddLink.mouseover(function () {
          if (!navIsContained) {
            clearTimeout(offTimer);
            $nextMenu.addClass(slShowCls);
            if ($nextMenu.is(':offscreen')) {
              var css = {
                top: '2px'
              };
              if ($this.hasClass('drzNav-links-right')) {
                css.left = '100%';
              } else if ($this.hasClass('drzNav-links-left') || $this.hasClass('drzNav-links-center')) {
                css.left = '-100%';
              }
              $nextMenu.css(css);
            }
          }
        }).mouseleave(function () {
          if (!navIsContained) {
            offTimer = setTimeout(function () {
              $nextMenu.removeClass(slShowCls);
            }, delay);
          }
        });
        $nextMenu.mouseover(function () {
          if (!navIsContained) {
            clearTimeout(offTimer);
            $nextMenu.addClass(slShowCls);
          }
        }).mouseleave(function () {
          if (!navIsContained) {
            offTimer = setTimeout(function () {
              $nextMenu.removeClass(slShowCls);
              navActions.removeSubInlines();
            }, delay);
          }
        });
      },
      removeSubInlines: function removeSubInlines() {
        var $subLists = $this.find(slCls);
        $subLists.each(function removeAllInlines() {
          $(this).css({
            left: '',
            right: '',
            top: ''
          });
        });
      },
      sliderDropDown: function sliderDropDown(e) {
        e.preventDefault();
        if (navIsContained || window.matchMedia(drzzle.viewports.mobile).matches) {
          var $el = $(e.currentTarget);
          $el.toggleClass('drzNav-rotateArrow');
          $el.next(slCls).toggleClass(slShowCls);
        }
      },
      openSlider: function openSlider(e) {
        if ((typeof e === 'undefined' ? 'undefined' : _typeof(e)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && e !== false) {
          e.preventDefault();
        }
        if (!sliderIsOpen) {
          $sliderOverlay.fadeIn(200);
          $sliderContainer.addClass('drzNav-slideContainer-' + slideDirection + 'Show');
        }
        sliderIsOpen = true;
      },
      closeSlider: function closeSlider(e) {
        if ((typeof e === 'undefined' ? 'undefined' : _typeof(e)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && e !== false) {
          e.preventDefault();
        }
        if (sliderIsOpen) {
          $sliderContainer.removeClass('drzNav-slideContainer-' + slideDirection + 'Show');
          $sliderOverlay.fadeOut(200);
        }
        sliderIsOpen = false;
      },
      checkAnchor: function checkAnchor(e) {
        var $el = $(e.currentTarget);
        var $href = $el.attr('href');
        if (sliderIsOpen && $href.match(/^#|^\/#/gi)) {
          navActions.closeSlider();
          if ($href.match(/^#/gi)) {
            e.preventDefault();
          }
        }
      },
      resetNav: function resetNav() {
        // reset any arrows on dropdowns in the slider that may have been closed in desktop
        var $subLinks = $sliderContainer.find(slCls);
        $subLinks.each(function resetArrows() {
          var $link = $(this);
          if ($link.hasClass(slShowCls)) {
            $link.prev('a').addClass('drzNav-rotateArrow');
          } else {
            $link.prev('a').removeClass('drzNav-rotateArrow');
          }
        });
      },
      fitCheck: function fitCheck() {
        $navWidth = ~~$this.outerWidth();
        // recheck for hamburgerWidth and navWidth
        if ($navHamburger.is(':visible')) {
          $hamburgerWidth = ~~$navHamburger.outerWidth();
        } else {
          $hamburgerWidth = 0;
        }
        if ($navLogo.is(':visible') && $navLogo.length) {
          $logoWidth = ~~$navLogo.outerWidth();
          $logoMarginLeft = parseInt($navLogo.css('margin-left'), 10);
          $logoMarginRight = parseInt($navLogo.css('margin-right'), 10);
        } else {
          $logoWidth = 0;
          $logoMarginLeft = 0;
          $logoMarginRight = 0;
        }
        if ($navSearch.is(':visible') && $navSearch.length) {
          $searchWidth = ~~$navSearch.outerWidth();
          $searchMarginLeft = parseInt($navSearch.css('margin-left'), 10);
          $searchMarginRight = parseInt($navSearch.css('margin-right'), 10);
        } else {
          $searchWidth = 0;
          $searchMarginLeft = 0;
          $searchMarginRight = 0;
        }
        // add in left/right padding & margins of nav items that don't normally get calculated
        var $navPadLeft = parseInt($this.css('padding-left'), 10);
        var $navPadRight = parseInt($this.css('padding-right'), 10);
        // nav is not there in editor, that's why
        var $navBuffer = parseInt($navWidth - ($logoWidth + $hamburgerWidth + $navPadLeft + $searchWidth + $searchMarginLeft + $searchMarginRight + $logoMarginLeft + $logoMarginRight + $navPadRight), 10);
        if ($linksWidth >= $navBuffer - 1 || window.matchMedia(drzzle.viewports.mobile).matches) {
          if (!navIsContained) {
            // hide slider just before it would break grid or if mobile
            $navList.hide();
            $navHamburger.addClass('drzNav-hamburger-show');
            navIsContained = true;
          }
        } else if (navIsContained) {
          // show again if it won't break or not in mobile
          $navList.show();
          $navHamburger.removeClass('drzNav-hamburger-show');
          navIsContained = false;
        }
        // close slider if slider is open and desktop links are also visible
        if (sliderIsOpen && $navList.is(':visible')) {
          navActions.closeSlider();
        }
      },
      editorCheck: function editorCheck($nav, val) {
        if (window.__editor) {
          $nav.parent().attr('data-nav-fixed', val);
        }
      }
    }; // End of nav actions
    navActions.editorCheck($this, false);
    // if plugin is in the editor, we need to grab the opacity
    // from a passed in parameter on color changes, otherwise
    // the nav's css transition delay will not give the correct
    // value.
    var findStop = void 0;
    // the magic behind sticky and fixed navs
    $.fn.drzNav.setScrolling = function setScrolling() {
      var $navs = $('.drzNav-sticky, .drzNav-fixed');
      var stickyCls = 'drzNav-sticky-set';
      $navs.removeClass(stickyCls);
      // storage for all the navs
      var store = {
        navs: []
      };
      // scroll utils / getters
      var get = {
        top: function top() {
          var $sections = $('\n            .section,\n            .drzTopControlBar,\n            .drz-app-bar,\n            .drzTopLegend');
          var totalHeight = 0;
          $sections.each(function getSections() {
            var $el = $(this);
            var $pos = $el.css('position');
            if ($pos === 'fixed' || $pos === 'sticky') {
              totalHeight += $el.outerHeight();
            }
          });
          return totalHeight;
        },
        location: function location(p) {
          // reset location of nav only if it isn't stuck
          if (!p.nav.stuck) {
            p.nav.startingLocation = p.top; // eslint-disable-line
          }
        },

        // for cases of fixed, transparent navs. auto add bg on scroll
        opacity: function opacity($nav) {
          var opacity = $nav.css('background-color');
          opacity = opacity.split(',')[3];
          if (opacity) {
            opacity = opacity.replace(/[^0-9.]/g, '');
          } else {
            opacity = 1;
          }
          if (window.__editor) {
            opacity = $nav.attr('data-opacity');
          }
          return Number(opacity).valueOf();
        }
      };
      drzzle.window.off('scroll', findStop);
      $navs.each(function setSticky(i) {
        var $this = $(this); // eslint-disable-line
        var view = void 0;
        var bump = 0;
        store.navs.push({
          $: $this,
          startingLocation: ~~$this.offset().top,
          height: ~~$this.outerHeight()
        });

        var nav = store.navs[i];
        // Create sticky menu if option is selected
        if ($this.hasClass('drzNav-sticky')) {
          // checks on load
          if (window.pageYOffset + get.top() >= nav.startingLocation) {
            // nav is fixed / stuck
            nav.stuck = true;
            $this.addClass(stickyCls);
            $this.css('top', get.top());
            navActions.editorCheck(nav.$, true);
          } else {
            // nav is not yet fixed / stuck
            nav.stuck = false;
            $this.removeClass(stickyCls);
            $this.css('top', '');
            navActions.editorCheck(nav.$, false);
          }
          // callback to run on scroll
          findStop = function findStop() {
            // if the previous nav is fixed then add the height of it to the
            // view threshold, this way the next nav becomes sticky just
            // underneath the previous.
            var previous = store.navs[i - 1];
            var previousIsStuck = previous ? previous.stuck : false;
            if (previousIsStuck) {
              // add the previous nav height to the view threshold
              bump = previous.height;
            }
            view = Math.round(drzzle.window.scrollTop() + get.top() + bump);
            // always reset the offset top of each nav on scroll. we do this
            // because there are a lot of things that happen in the editor and
            // and when navs stick that throw off the top offset of each sticky
            // nav. This will cause navs to be stuck at the incorrect view if
            // not addressed.
            get.location({
              nav: nav,
              top: ~~$this.offset().top
            });
            // init the stick / unstick
            if (view > nav.startingLocation) {
              if (previous) {
                previous.$.css('top', '-' + previous.height + 'px');
              }
              nav.stuck = true;
              $this.addClass(stickyCls);
              $this.css('top', get.top());
              navActions.editorCheck(nav.$, true);
            } else {
              nav.stuck = false;
              $this.removeClass(stickyCls);
              $this.css('top', '');
              navActions.editorCheck(nav.$, false);
            }
          };
          drzzle.window.on('scroll', findStop);
        } else if ($this.hasClass('drzNav-fixed')) {
          navActions.editorCheck(nav.$, true);
          var opacity = get.opacity($this);
          var checkPoint = nav.startingLocation;
          nav.stuck = true;
          // only initiate the added class for transparent fixed menus
          if (window.pageYOffset > nav.height && opacity < 0.1) {
            $this.addClass(stickyCls);
            checkPoint = nav.height;
          }
          findStop = function findStop() {
            view = Math.round(drzzle.window.scrollTop());
            if (view > checkPoint && opacity < 0.1) {
              $this.addClass(stickyCls);
              $this.css('top', get.top());
            } else {
              $this.removeClass(stickyCls);
              $this.css('top', '');
            }
          };
          drzzle.window.on('scroll', findStop);
        }
      });
    };

    // desktop dropdown hover events
    $dropDownLink.each(function attachHovers() {
      navActions.desktopDropDown($(this));
    });

    // desktop sublist hover events
    $subDropDownLink.each(function attachSubHovers() {
      navActions.desktopDropDown($(this));
    });

    // mobile dropdown click events
    $dropDownLink.click(navActions.sliderDropDown);
    $subDropDownLink.click(navActions.sliderDropDown);

    // close slider for any anchor menu buttons
    $navList.find('.drzNav-link:not(.drzNav-link-dropDown)').click(navActions.checkAnchor);
    $navList.find('.drzNav-subLink:not(.drzNav-link-subDropDown)').click(navActions.checkAnchor);

    // Slider actions
    $navHamburger.click(navActions.openSlider);
    $closeSliderBtn.click(navActions.closeSlider);
    $sliderOverlay.click(navActions.closeSlider);
    $sliderContainer.click(function (e) {
      e.stopPropagation();
    });

    // insert the clone for mobile after listeners have been attached
    var $navListClone = $navList.clone(true, true);
    $sliderContainer.append($navListClone);

    // Reset some things on nav on resizing
    var resizeTimer = void 0;
    var navResize = function navResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(navActions.resetNav, 250);
      navActions.fitCheck();
    };
    drzzle.window.on('resize', navResize);
    // Init the check right on page load
    navActions.fitCheck();
    // init the scrolling plugin
    $.fn.drzNav.setScrolling();
    // destroy nav attachments
    $.fn.drzNav.destroy = function ($el) {
      $el.next('.drzNav-overlay').remove();
      $el.find('.drzNav-list').css('display', '');
      $el.find('.drzNav-hamburger').removeClass('drzNav-hamburger-show');
      drzzle.window.off('resize', navResize);
      drzzle.window.off('scroll', findStop);
      $el.find('*').off();
    };

    return this;
  };
})(jQuery);

/* Section Bg Videos
* ======================= */
(function ($) {
  $.fn.drzSectionVideo = function drzAccordion() {
    var $video = $(this);
    $video.each(function initVideo() {
      var $v = $(this);
      var $attrs = $v.attr('data-videos');
      var resizeTimer = void 0;
      var start = true;
      var startingViewport = void 0;
      var endingViewport = void 0;
      var methods = {
        init: function init($vid, resize) {
          $attrs = $vid.attr('data-videos');
          $attrs = $attrs.desktop ? $attrs : JSON.parse($attrs);
          // we only want to redraw on resize if there is a change
          if (resize && $attrs[resize.startingViewport].src !== $attrs[resize.endingViewport].src) {
            $vid.find('video.drzSection-video').remove();
            methods.drawVideo($vid);
          }
          if (!resize) {
            $vid.find('video.drzSection-video').remove();
            methods.drawVideo($vid);
          }
        },
        drawVideo: function drawVideo($vid) {
          // draw new video
          var data = methods.getSource($attrs);
          var $newVideo = $('\n            <video class="drzSection-video" muted loop playsinline autoplay>\n              <source src="' + methods.getVidPath(data.src) + '" type="video/' + data.type + '" />\n              <p class="warning">Your browser does not support HTML5 video.</p>\n            </video>');
          // prepend to container
          $vid.prepend($newVideo);
          // auto play video if it hasn't started on it's own
          var domV = $vid.find('.drzSection-video').get(0);
          domV.addEventListener('loadeddata', function () {
            var count = 0;
            var tryToPlay = function tryToPlay() {
              if (domV.paused && count < 31) {
                count += 1;
                domV.play().catch(function () {
                  tryToPlay();
                });
              }
            };
            tryToPlay();
          });
        },
        getVidPath: function getVidPath(src) {
          var path = src;
          if (window.__editor && !src.match(/^http/gi)) {
            var prefix = process.env.NODE_ENV === 'development' ? '' : 'file://';
            prefix = '' + prefix + process.env._staticWrite; // eslint-disable-line
            path = prefix + '/' + window._currentSite.name + path; // eslint-disable-line
          }
          return path;
        },
        getSource: function getSource(data) {
          var src = '';
          var type = '';
          if (window.matchMedia(drzzle.viewports.desktop).matches) {
            src = data.desktop.src;
            type = data.desktop.type;
          }
          if (window.matchMedia(drzzle.viewports.tablet).matches) {
            src = data.tablet.src;
            type = data.tablet.type;
          }
          if (window.matchMedia(drzzle.viewports.mobile).matches) {
            src = data.mobile.src;
            type = data.mobile.type;
          }
          return { src: src, type: type };
        },
        get: function get() {
          var viewport = '';
          if (window.matchMedia(drzzle.viewports.desktop).matches) {
            viewport = 'desktop';
          }
          if (window.matchMedia(drzzle.viewports.tablet).matches) {
            viewport = 'tablet';
          }
          if (window.matchMedia(drzzle.viewports.mobile).matches) {
            viewport = 'mobile';
          }
          return { viewport: viewport };
        },
        resize: function resize() {
          if (start) {
            startingViewport = methods.get().viewport;
            start = false;
          }
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            endingViewport = methods.get().viewport;
            methods.init($v, { startingViewport: startingViewport, endingViewport: endingViewport });
            start = true;
          }, 250);
        }
      };

      if ($attrs) {
        // init the plugin on load
        methods.init($v);
        // redraw on screen resize
        drzzle.window.resize(methods.resize);
      }
      // destroy plugin
      $.fn.drzSectionVideo.destroy = function ($el) {
        $el.find('video.drzSection-video').remove();
        drzzle.window.off('resize', methods.resize);
      };
    });
    return this;
  };
})(jQuery);

/*
===================================
 Drzzle Responsive Tables Plugin
===================================
*/
(function ($) {
  $.fn.responsiveTables = function responsiveTables() {
    var $table = $(this);
    $table.each(function initTable() {
      var $this = $(this);
      var mobileTitleClass = 'drzTable-mobileTitle';
      var $headTitle = $this.find('thead tr td');
      $this.find('tbody tr td').each(function addMobile() {
        var $tableData = $(this);
        var $index = $tableData.index();
        $tableData.prepend('<b class="' + mobileTitleClass + '">' + $headTitle.eq($index).html() + ': </b>');
      });
      $.fn.responsiveTables.destroy = function ($el) {
        $el.find('.' + mobileTitleClass).remove();
      };
    });
    return this;
  };
})(jQuery);

/*
============================
 Drzzle Tabs Plugin
============================
*/
(function ($) {
  $.fn.drzTabs = function drzTabs() {
    var $tabs = $(this);
    var tabsClass = 'drzTabs';
    var tabsMenuClass = 'drzTabs-menu';
    var desktopTabClass = 'drzTabs-tab';
    var desktopLinkClass = 'drzTabs-tabLink';
    var activeTabClass = 'drzTabs-activeTab';
    var mobileTabClass = 'drzTabs-mobileTab';
    var tabContentWrap = 'drzTabs-content';
    var tabContentClass = 'drzTabs-tabContent';

    var tabActions = {
      tabsAreMobile: false,
      setActive: function setActive(e) {
        e.preventDefault();
        var $el = $(e.currentTarget);
        var $thisSet = $el.closest('.' + tabsClass);
        var $tabSiblings = $thisSet.find('.' + desktopTabClass);
        var $mTabSiblings = $thisSet.find('.' + mobileTabClass);
        var $tabIndex = void 0;
        var $variationTab = void 0;
        var showSpeed = 200;

        if ($el.hasClass(mobileTabClass)) {
          tabActions.tabsAreMobile = true;
        } else {
          tabActions.tabsAreMobile = false;
        }

        if (tabActions.tabsAreMobile) {
          $tabIndex = $el.parent().children('.' + mobileTabClass).index($el);
          $variationTab = $tabSiblings.eq($tabIndex);
        } else {
          $tabIndex = $el.index();
          $variationTab = $mTabSiblings.eq($tabIndex);
        }

        var $activeContent = $thisSet.find('.' + tabContentClass).eq($tabIndex);

        $tabSiblings.removeClass(activeTabClass);
        $mTabSiblings.removeClass(activeTabClass);
        $el.addClass(activeTabClass);
        $variationTab.addClass(activeTabClass);

        if (tabActions.tabsAreMobile) {
          // when closing mobile tab, remove active state
          if ($activeContent.is(':visible')) {
            $el.removeClass(activeTabClass);
          }

          $activeContent.siblings('.' + tabContentClass).slideUp(showSpeed);
          $activeContent.slideToggle(showSpeed);
        } else {
          // If in desktop or tablet
          $activeContent.siblings('.' + tabContentClass).hide();
          $activeContent.show();
        }
      },
      setFirstTab: function setFirstTab($tab, $tabMobile, $tabContent, $tabMenu) {
        $tab.addClass(activeTabClass);
        $tabMobile.addClass(activeTabClass);
        $tabContent.show();
        // make sure left content border extends beyond left menu
        if ($tab.hasClass('drzTabs-tab-left')) {
          tabActions.setLeftHeight($tabContent, $tabMenu);
        }
      },
      resetTabs: function resetTabs($hiddenActive, $tabContent, $tabMenu) {
        // if all mobile tabs are collapsed, re open correct content if moving to desktop
        var $findContent = $tabContent.eq($hiddenActive);
        if (!window.matchMedia(drzzle.viewports.mobile).matches && !$findContent.is(':visible')) {
          $findContent.show();
        }
        // make sure left content border extends beyond left menu
        if ($tabMenu.hasClass('drzTabs-menu-left')) {
          tabActions.setLeftHeight($tabContent, $tabMenu);
        }
      },
      setLeftHeight: function setLeftHeight($tabContent, $tabMenu) {
        if (!window.matchMedia(drzzle.viewports.mobile).matches) {
          $tabContent.parent().css('min-height', parseInt($tabMenu.outerHeight() + 25, 10));
        } else {
          $tabContent.parent().css('min-height', 1);
        }
      },
      removeActives: function removeActives($el) {
        $el.children().each(function remove() {
          var $this = $(this);
          if ($this.hasClass(activeTabClass)) {
            $this.removeClass(activeTabClass);
          }
          if ($this.attr('style')) {
            $this.css('display', '');
          }
        });
      }
    };

    var $tabMenu = $tabs.find('.' + tabsMenuClass);
    var $tabLink = $tabs.find('.' + desktopTabClass);
    var $tabContent = $tabs.find('.' + tabContentClass);

    $tabLink.click(tabActions.setActive);
    // Insert tab text into the mobile tab buttons
    function attachMobile($m) {
      $tabs.find('.' + desktopTabClass).each(function insertMobileText() {
        var $tab = $(this);
        var $index = $tab.index();
        $m.eq($index).text($tab.find('.' + desktopLinkClass).text());
      });
    }

    // inject accordion buttons for mobile
    $('<div class="' + mobileTabClass + '"></div>').insertBefore($tabContent);
    var $mobileTab = $tabs.find('.' + mobileTabClass);
    attachMobile($mobileTab);

    // set first tab active
    tabActions.setFirstTab($tabLink.first(), $mobileTab.first(), $tabContent.first(), $tabMenu);

    $mobileTab.click(tabActions.setActive);

    // reset tabs when resizing screen
    var resizeTimer = void 0;
    drzzle.window.resize(function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var $hiddenActive = $tabs.find('.' + activeTabClass).index();
        tabActions.resetTabs($hiddenActive, $tabContent, $tabMenu);
      }, 250);
    });

    $.fn.drzTabs.destroy = function ($el) {
      // grab attached selectors and remove/ attached data
      $el.find('.' + desktopTabClass).off('click');
      $el.find('.' + mobileTabClass).remove();
      $el.find('.' + tabContentWrap).css('min-height', 1);
      tabActions.removeActives($el.find('.' + tabsMenuClass));
      tabActions.removeActives($el.find('.' + tabContentWrap));
    };

    return this;
  };
})(jQuery);

/*
============================
 Drzzle Video Plugin
============================
*/
(function ($) {
  $.fn.drzVideoPlayer = function drzVideoPlayer() {
    var $videoContainer = $(this);
    $videoContainer.each(function initPlayer() {
      var $this = $(this);
      var $video = $this.find('.drzVideo-src').get(0);
      var thisNode = $this.get(0);
      var $controlsContainer = $this.find('.drzVideo-controls');
      var $playBtn = $this.find('.drzVideo-playBtn');
      var $pauseBtn = $this.find('.drzVideo-pauseBtn');
      var $volume = $this.find('.drzVideo-volSlider');
      var $mute = $this.find('.drzVideo-muteBtn');
      var $progress = $this.find('.drzVideo-progress');
      var $progressBar = $this.find('.drzVideo-progressBar');
      var $fullScreenBtn = $this.find('.drzVideo-fullScreenBtn');
      var $timeElapsed = $this.find('.drzVideo-currentTime');
      var $totalTime = $this.find('.drzVideo-totalTime');
      var $timeContainer = $this.find('.drzVideo-videoTime');
      var $sliderContainer = $this.find('.drzVideo-volSliderContainer');
      var $overlay = $this.find('.drzVideo-overlay');
      var $initialOverlayBg = $overlay.css('background-color');
      var $overlayPlayBtn = $overlay.find('.drzVideo-playBtn-lrg');

      // set timeElapsed to 0 at first
      $timeElapsed.html('0:00');

      // prepare for any dynamically changed src
      $this.find('.drzVideo-src').load();

      // callback for triggering video play on overlay click
      var oPlay = function oPlay() {
        if ($video.paused || $video.ended) {
          $video.play();
          $overlay.css('background-color', 'transparent');
          if ($overlayPlayBtn.is(':visible')) {
            $overlayPlayBtn.fadeOut();
          }
        } else {
          $video.pause();
          $overlay.css('background-color', $initialOverlayBg);
          if (!$overlayPlayBtn.is(':visible')) {
            $overlayPlayBtn.fadeIn();
          }
        }
      };

      // wait for the video meta data to come in, then show total time
      var getTotalTime = function getTotalTime() {
        var totalMinutes = parseInt($video.duration / 60, 10);
        var totalSeconds = parseInt($video.duration % 60, 10);
        var totalHours = parseInt(totalMinutes / 60, 10);
        if (totalSeconds < 10) {
          totalSeconds = ':0' + totalSeconds;
        } else {
          totalSeconds = ':' + totalSeconds;
        }
        if (totalHours > 0) {
          totalHours = totalHours + ':';
        } else {
          totalHours = '';
        }
        $totalTime.html(totalHours + totalMinutes + totalSeconds);
        var $parent = $this.parent();
        if ($parent.hasClass('drzVideo-feature')) {
          $parent.find('.drzVideo-featureDuration').html('0:00');
          $parent.find('.drzVideo-featureTotalTime').html(totalHours + totalMinutes + totalSeconds);
        }
      };

      // update time of video for progress callback
      var updateTime = function updateTime() {
        var value = 0;
        var minutes = parseInt($video.currentTime / 60, 10);
        var seconds = parseInt($video.currentTime % 60, 10);
        var hours = parseInt(minutes / 60, 10);
        if ($video.currentTime > 0) {
          value = Math.floor(100 / $video.duration * $video.currentTime);
        }
        if (seconds < 10) {
          seconds = ':0' + seconds;
        } else {
          seconds = ':' + seconds;
        }
        if (hours > 0) {
          hours = hours + ':';
        } else {
          hours = '';
        }
        $progress.css('width', value + '%');
        $timeElapsed.html(hours + minutes + seconds);
        var $parent = $this.parent();
        if ($parent.hasClass('drzVideo-feature')) {
          $parent.find('.drzVideo-featureDuration').html(hours + minutes + seconds);
        }
      };

      // when video is over, show the overlay and play button again
      var setOverlay = function setOverlay() {
        $overlay.css('background-color', $initialOverlayBg);
        if (!$overlayPlayBtn.is(':visible')) {
          $overlayPlayBtn.fadeIn();
        }
      };

      // enable the dragging events to update/change the video time
      var progressDrag = false;
      var doc = $(document);

      // update progress for dragging on time bar
      var updateProgress = function updateProgress(p) {
        var dur = $video.duration;
        var pos = p - $progressBar.offset().left;
        var perc = 100 * (pos / $progressBar.width());
        if (perc > 100) {
          perc = 100;
        }
        if (perc < 0) {
          perc = 0;
        }
        $video.currentTime = dur * (perc / 100);
        $progress.css('width', perc + '%');
      };

      var setProgress = function setProgress(e) {
        progressDrag = true;
        updateProgress(e.pageX);
      };

      doc.on('vmouseup', function (e) {
        if (progressDrag) {
          progressDrag = false;
          updateProgress(e.pageX);
        }
      });

      doc.on('vmousemove', function (e) {
        if (progressDrag) {
          updateProgress(e.pageX);
        }
      });

      var toggleControls = function toggleControls() {
        var hideControls = void 0;
        function slideControlsUp() {
          if ($controlsContainer.hasClass('drzVide-slideDown')) {
            $controlsContainer.removeClass('drzVide-slideDown');
            $progress.removeClass('drzVideo-soloProgress');
            $progressBar.removeClass('drzVideo-soloProgress');
            clearTimeout(hideControls);
            hideControls = setTimeout(function () {
              if (!$controlsContainer.hasClass('drzVide-slideDown')) {
                $controlsContainer.addClass('drzVide-slideDown');
                $progress.addClass('drzVideo-soloProgress');
                $progressBar.addClass('drzVideo-soloProgress');
              }
            }, 3000);
          }
        }

        function clearTime() {
          return clearTimeout(hideControls);
        }

        function slideControlsDown() {
          clearTimeout(hideControls);
          hideControls = setTimeout(function () {
            if (!$controlsContainer.hasClass('drzVide-slideDown')) {
              $controlsContainer.addClass('drzVide-slideDown');
              $progress.addClass('drzVideo-soloProgress');
              $progressBar.addClass('drzVideo-soloProgress');
            }
          }, 3000);
        }

        function offHover() {
          clearTimeout(hideControls);
          if (!$controlsContainer.hasClass('drzVide-slideDown')) {
            $controlsContainer.addClass('drzVide-slideDown');
            $progress.addClass('drzVideo-soloProgress');
            $progressBar.addClass('drzVideo-soloProgress');
          }
        }

        $this.on('vmousemove', slideControlsUp);
        $this.find('.drzVideo-controlBar').on('vmouseover', clearTime);
        $this.find('.drzVideo-controlBar').on('mouseleave', slideControlsDown);
        $this.mouseleave(offHover);
      };

      function playVideo() {
        if ($video.paused || $video.ended) {
          $video.play();
          $overlay.css('background-color', 'transparent');
          if ($overlayPlayBtn.is(':visible')) {
            $overlayPlayBtn.fadeOut();
          }
        }
      }

      function pauseVideo(e) {
        e.stopPropagation();
        $video.pause();
        $overlay.css('background-color', $initialOverlayBg);
        if (!$overlayPlayBtn.is(':visible')) {
          $overlayPlayBtn.fadeIn();
        }
      }

      function setVolume() {
        $video.volume = $volume.val();
      }

      function toggleMute(e) {
        e.stopPropagation();
        $video.muted = !$video.muted;
        $mute.toggleClass('drzVideo-muteOff');
      }

      var toggleFullScreen = function toggleFullScreen(e) {
        e.stopPropagation();
        if (document.fullScreenElement !== undefined && document.fullScreenElement === null || document.msFullscreenElement !== undefined && document.msFullscreenElement === null || document.mozFullScreen !== undefined && !document.mozFullScreen || document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen) {
          if (thisNode.requestFullScreen) {
            thisNode.requestFullScreen();
          } else if (thisNode.mozRequestFullScreen) {
            thisNode.mozRequestFullScreen();
          } else if (thisNode.webkitRequestFullScreen) {
            thisNode.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
          } else if (thisNode.msRequestFullscreen) {
            thisNode.msRequestFullscreen();
          }
        } else if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      };

      // bind the control toggling only once after clicking on video
      $this.one('click', toggleControls);

      // need to stop propagation on the following
      $timeContainer.click(function (e) {
        return e.stopPropagation();
      });
      $sliderContainer.click(function (e) {
        return e.stopPropagation();
      });

      // attach callbacks on listeners
      $overlay.click(oPlay);
      $video.addEventListener('durationchange', getTotalTime, false);
      $video.addEventListener('timeupdate', updateTime, false);
      $video.addEventListener('ended', setOverlay, false);
      $progressBar.on('vmousedown', setProgress);

      $playBtn.click(playVideo);
      $pauseBtn.click(pauseVideo);
      $volume.change(setVolume);
      $mute.click(toggleMute);
      $fullScreenBtn.click(toggleFullScreen);

      $.fn.drzVideoPlayer.destroy = function ($el) {
        // grab attached selectors and remove attached listeners
        $el.off('click');
        $el.off('mouseleave');
        $el.off('vmousemove');
        $el.find('.drzVideo-videoTime').off('click');
        $el.find('.drzVideo-volSliderContainer').off('click');
        $el.find('.drzVideo-overlay').off('click');
        $el.find('.drzVideo-progressBar').off('vmousedown');
        $el.find('.drzVideo-playBtn').off('click');
        $el.find('.drzVideo-pauseBtn').off('click');
        $el.find('.drzVideo-volSlider').off('change');
        $el.find('.drzVideo-muteBtn').off('click');
        $el.find('.drzVideo-fullScreenBtn').off('click');
        var vidNode = $el.find('.drzVideo-src').get(0);
        vidNode.removeEventListener('durationchange', getTotalTime, false);
        vidNode.removeEventListener('timeupdate', updateTime, false);
        vidNode.removeEventListener('ended', setOverlay, false);
        var $ctrlBar = $el.find('.drzVideo-controlBar');
        $ctrlBar.off('vmouseover');
        $ctrlBar.off('mouseleave');
      };
    });
    return this;
  };
})(jQuery);

/*
============================
 Drzzle Filtering Plugin
============================
*/
(function ($) {
  $.fn.sortFilter = function sortFilter() {
    var $filter = $(this);
    $filter.each(function initPlugin() {
      var $this = $(this);
      var filterContainer = void 0;
      var isTable = false;
      if ($this.next().is('table')) {
        isTable = true;
        filterContainer = $this.next('table').find('.drzFilter-container');
      } else {
        filterContainer = $this.next('.drzFilter-container');
      }
      var filterBtn = $this.find('button');
      var filterSearch = $this.find('.search');
      var filterSearchAttr = filterSearch.attr('data-filter-search');
      var animationSpeed = 200;

      if ((typeof filterSearchAttr === 'undefined' ? 'undefined' : _typeof(filterSearchAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && filterSearchAttr !== false) {
        if (filterSearchAttr.match(/true/gi)) {
          var searchContentContainer = filterContainer;
          searchContentContainer.children().each(function go() {
            $(this).addClass('search-element-parent');
          });
          // store the initial pagination states for resetting
          var initialState = void 0;
          searchContentContainer.ready(function () {
            if (searchContentContainer.hasClass('paginate')) {
              if (isTable === true) {
                initialState = $this.next('table').find('.drzFilter-container').html();
              } else {
                initialState = $this.next('.drzFilter-container').html();
              }
            }
          });
          filterSearch.keyup(function onKeyup() {
            var searchedElement = searchContentContainer.find('.search-element-parent');
            var input = $(this).val();
            var thisText = input.toString();
            var searchedText = new RegExp(thisText, 'gim');
            // var searchedText = new RegExp('(?![^<]*>)' + thisText + '\b(?![^ <>])', 'gim');
            searchedElement.each(function update() {
              var el = $(this);
              var elText = el.text();
              // var elText = el.html();
              // elText = elText.replace('<mark class="search-result">','').replace('</mark>','');
              if (elText.match(searchedText)) {
                if (!el.is(':visible')) {
                  if (isTable === true) {
                    el.removeClass('hide');
                    el.addClass('show-tr');
                  } else {
                    if (filterContainer.hasClass('paginate')) {
                      if (!el.parent().is(':visible')) {
                        el.parent().show();
                      }
                    }
                    el.fadeIn();
                  }
                }
                if (input !== '') {
                  // stashing for future use (highlighting text)
                  // need to not get <tag text>
                  // elText = elText.replace(
                  // new RegExp('(?![^<>]*>) *' + thisText + '*([^<> \d])', "igm"),
                  // '<mark class="search-result">' + thisText + '</mark>');
                  // el.html(elText);
                }
              } else if (isTable === true) {
                el.removeClass('show-tr');
                el.addClass('hide');
              } else {
                el.fadeOut();
              }
              if (input === '') {
                if (filterContainer.hasClass('paginate')) {
                  searchContentContainer.html(initialState);
                  if (isTable === true) {
                    searchContentContainer.parent().next('.pagination').find('.pg-link-1').trigger('click');
                  } else {
                    searchContentContainer.next('.pagination').find('.pg-link-1').trigger('click');
                  }
                }
              }
            });
          });
        }
      }
      var filterContainerContent = void 0;
      filterContainer.ready(function () {
        filterContainerContent = filterContainer.html();
      });

      function sortContent(el, attr, sortBtn) {
        return $(filterContainer.find(el).toArray().sort(function (a, b) {
          var top = new Date($(a).attr(attr));
          var bottom = new Date($(b).attr(attr));
          var result = void 0;
          if (sortBtn.match(/newest/gi)) {
            result = bottom - top;
          } else if (sortBtn.match(/oldest/gi)) {
            result = top - bottom;
          }
          return result;
        }));
      }

      filterBtn.each(function initBtn() {
        var thisBtn = $(this);
        var thisBtnAttr = thisBtn.attr('data-filter-category');
        var thisResetAttr = thisBtn.attr('data-filter-reset');
        var thisSortAttr = thisBtn.attr('data-filter-sort');
        // if reset button is present
        if ((typeof thisResetAttr === 'undefined' ? 'undefined' : _typeof(thisResetAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && thisResetAttr !== false && thisResetAttr.match(/true/gi)) {
          thisBtn.click(function () {
            filterContainer.html(filterContainerContent);
            if (filterContainer.hasClass('paginate')) {
              filterContainer.next('.pagination').find('.pg-link-1').trigger('click');
            }
            filterContainer.find('[data-filter-category]').each(function categ() {
              var el = $(this);
              if (!el.is(':visible')) {
                setTimeout(function () {
                  el.fadeIn(animationSpeed);
                }, animationSpeed);
              }
            });
          });
        }
        // if a data-filter-category exists on a button
        if ((typeof thisBtnAttr === 'undefined' ? 'undefined' : _typeof(thisBtnAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && thisBtnAttr !== false) {
          thisBtn.click(function () {
            filterContainer.find('[data-filter-category]').each(function initCat() {
              var el = $(this);
              var filterContentAttr = el.attr('data-filter-category');
              if (filterContentAttr !== thisBtnAttr) {
                el.fadeOut(animationSpeed);
              } else {
                if (filterContainer.hasClass('paginate')) {
                  if (!el.parent().is(':visible')) {
                    el.parent().show();
                  }
                }
                setTimeout(function () {
                  el.fadeIn(animationSpeed);
                }, animationSpeed);
              }
            });
          });
        }
        // if a data-filter-sort exists on a button
        if ((typeof thisSortAttr === 'undefined' ? 'undefined' : _typeof(thisSortAttr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && thisSortAttr !== false) {
          thisBtn.click(function () {
            var newBuild = sortContent('[data-filter-sort]', 'data-filter-sort', thisSortAttr);
            filterContainer.html(newBuild);
          });
        }
      });
    });
    return this;
  };
})(jQuery);

/*
============================
 Drzzle Modal Plugin
============================
*/
(function ($) {
  $.fn.drzModal = function drzModal() {
    var $modal = $(this);
    $modal.each(function initModal() {
      var $modalTrigger = $(this);
      var $modalOverlay = $modalTrigger.next('.drzModal-overlay');
      var $modalContent = $modalOverlay.find('.drzModal-content');
      var $body = $('body');
      var swapModalClass = void 0;
      var addLeaveClasses = void 0;
      var resetModal = void 0;

      $modalOverlay.addClass('drzModal-overlay-inStart');
      $modalContent.addClass('drzModal-content-inStart');

      function buildModal($thisModal) {
        $thisModal.insertAfter($body);
        $thisModal.show();

        clearTimeout(swapModalClass);
        swapModalClass = setTimeout(function () {
          $thisModal.removeClass('drzModal-overlay-inStart').addClass('drzModal-overlay-inEnd');
          $modalContent.removeClass('drzModal-content-inStart').addClass('drzModal-content-inEnd');
        }, 50);

        if ($thisModal.hasClass('drzModal-announcement')) {
          $modalContent.addClass('drzModal-anMessage');
          $body.addClass('blur');
        }

        // focus on input if a search modal
        if ($modalContent.find('.drzModal-search-bar').length) {
          $modalContent.find('.drzModal-search-bar').focus();
        }

        function closeModal(e) {
          $thisModal.removeClass('drzModal-overlay-inEnd').addClass('drzModal-overlay-leaveStart');
          $modalContent.removeClass('drzModal-content-inEnd').addClass('drzModal-content-leaveStart');

          clearTimeout(addLeaveClasses);
          addLeaveClasses = setTimeout(function () {
            $thisModal.removeClass('drzModal-overlay-leaveStart').addClass('drzModal-overlay-leaveEnd');
            $modalContent.removeClass('drzModal-content-leaveStart').addClass('drzModal-content-leaveEnd');
          }, 50);

          if ($body.hasClass('blur')) {
            $body.removeClass('blur');
          }

          clearTimeout(resetModal);
          resetModal = setTimeout(function () {
            // move the modal node back inside it's container
            $thisModal.insertAfter($modalTrigger);
            $thisModal.hide();
            $thisModal.removeClass('drzModal-overlay-leaveEnd').addClass('drzModal-overlay-inStart');
            $modalContent.removeClass('drzModal-content-leaveEnd').addClass('drzModal-content-inStart');
          }, 600);
          e.preventDefault();
        }

        $thisModal.find('.drzModal-closeLink').click(closeModal);
        $thisModal.click(closeModal);
        $thisModal.find('.drzModal-content').click(function (e) {
          e.stopPropagation();
        });

        // close modal on escape key
        $(document).keyup(function (e) {
          if (e.key === 'Escape') {
            closeModal(e);
          }
        });
      }

      $modalTrigger.click(function (e) {
        e.preventDefault();
        if (!$modalOverlay.hasClass('drzModal-overlay-leaveEnd')) {
          buildModal($modalOverlay);
        }
      });

      // Auto show announcement modal
      if ($modalOverlay.hasClass('drzModal-announcement')) {
        /* disabled for demo */
        // buildModal($modalOverlay);
      }
    });
    return this;
  };
})(jQuery);

/*
============================
 Drzzle Multi-Step Plugin
============================
*/
(function ($) {
  $.fn.drzMultiStep = function multiStep() {
    var $multiStep = $(this);
    $multiStep.find('.drzMultiStep-step').each(function initStep() {
      var $this = $(this);
      var indexNum = $this.index() + 1;
      var $stepLabel = $this.attr('data-step-label');

      $this.parent().prev('.drzMultiStep-progress').append('\n          <span class="drzMultiStep-progressStep drzMultiStep-progressStep' + indexNum + '">\n            <div class="drzMultiStep-progressStep-num"></div>\n          </span>');
      $this.parent().prev('.drzMultiStep-progress').find('.drzMultiStep-progressStep' + indexNum).append($stepLabel);
      $this.parent().prev('.drzMultiStep-progress').find('.drzMultiStep-progressStep' + indexNum).find('.drzMultiStep-progressStep-num').html(indexNum);

      var $nextBtn = $('<button class="drzMultiStep-nextBtn">Next</button>');
      var $backBtn = $('<button class="drzMultiStep-backBtn">Back</button>');
      var $msRow = $this.find('.drzMultiStep-btnRow');
      var $msProgress = $this.parent().prev('.drzMultiStep-progress');

      if ($this.is(':first-child')) {
        $this.addClass('drzMultiStep-stepActive');
        $msProgress.find('.drzMultiStep-progressStep' + indexNum + ' .drzMultiStep-progressStep-num').addClass('drzMultiStep-progressStep-numActive');
        $msRow.prepend($nextBtn);
      }

      if ($this.is(':last-child')) {
        $msRow.prepend($backBtn);
      }

      if ($this.is(':not(:first-child)') && $this.is(':not(:last-child)')) {
        $msRow.prepend($nextBtn);
        $msRow.prepend($backBtn);
      }

      // next click event
      $this.find('.drzMultiStep-nextBtn').click(function (e) {
        if (!$this.is(':animated')) {
          e.preventDefault();
          $this.css('height', $this.outerHeight());
          $this.css('width', $this.outerWidth());
          $this.addClass('position-absolute');
          $this.animate({
            marginLeft: '-200px',
            opacity: 0
          }, 300);
          $this.next().addClass('drzMultiStep-stepActive');
          setTimeout(function () {
            $this.removeClass('drzMultiStep-stepActive');
          }, 300);
          $msProgress.find('.drzMultiStep-progressStep' + indexNum).next().find('.drzMultiStep-progressStep-num').addClass('drzMultiStep-progressStep-numActive');
        }
      });

      // back click event
      $this.find('.drzMultiStep-backBtn').click(function (e) {
        if (!$this.prev().is(':animated')) {
          e.preventDefault();
          $this.removeClass('drzMultiStep-stepActive');
          $this.prev().removeClass('position-absolute');
          $this.prev().addClass('drzMultiStep-stepActive');
          $this.prev().animate({
            marginLeft: '0px',
            opacity: 1
          }, 300);
          setTimeout(function () {
            $this.prev().css('height', '');
            $this.prev().css('width', '');
          }, 300);
          $msProgress.find('.drzMultiStep-progressStep' + indexNum + ' .drzMultiStep-progressStep-num').removeClass('drzMultiStep-progressStep-numActive');
        }
      });
    });
    return this;
  };
})(jQuery);

/*
===============================
 Drzzle Notifications Plugin
===============================
*/
(function ($) {
  $.fn.drzNotify = function drzNotify() {
    var $notification = $(this);
    $notification.each(function initNotify() {
      var $this = $(this);
      var $dismissBtn = $this.find('.drzNotification-close');
      var shown = false;

      // callback to check if notification is in view of user
      function inView($el) {
        var $docViewTop = drzzle.window.scrollTop();
        var $docViewBottom = $docViewTop + drzzle.window.height();
        var $elTop = $el.offset().top;
        var $elBottom = $elTop + $el.height();

        if ($elBottom <= $docViewBottom && $elTop >= $docViewTop && !shown) {
          shown = true;
          $this.animate({
            opacity: 1,
            marginLeft: 0
          }, 600);
        }
      }

      drzzle.window.on('scroll', function () {
        inView($this);
      });

      inView($this);

      $dismissBtn.click(function (e) {
        e.preventDefault();
        $this.animate({
          opacity: 0
        }, 200);

        setTimeout(function () {
          $this.remove();
        }, 200);
      });
    });
    return this;
  };
})(jQuery);

/*
============================
 Drzzle Pagination Plugin
============================
*/
(function ($) {
  $.fn.drzPagination = function drzPagination() {
    var $pagination = $(this);
    $pagination.each(function initPlugin() {
      var $this = $(this);
      var $pageItems = $this.children();
      var totalItems = $pageItems.length;
      var itemLimit = $this.attr('data-paginate-items');

      // insert pagination markup
      var paginationUl = void 0;
      var isTable = false;
      if ($this.parent().is('table')) {
        isTable = true;
        $('<ul class="drzPagination"><div class="drzPaginate-numbers"></div></ul>').insertAfter($this.parent());
        paginationUl = $this.parent().next('.drzPagination').find('.drzPaginate-numbers');
        $this.parent().next('.drzPagination').prepend('<li class="drzPaginate-back"><a class="drzPaginate-back-link" href="#"></a></li>');
        $this.parent().next('.drzPagination').append('<li class="drzPaginate-next"><a class="drzPaginate-next-link" href="#"></a></li>');
      } else {
        $('<ul class="drzPagination"><div class="drzPaginate-numbers"></div></ul>').insertAfter($this);
        paginationUl = $this.next('.drzPagination').find('.drzPaginate-numbers');
        $this.next('.drzPagination').prepend('<li class="drzPaginate-back"><a class="drzPaginate-back-link" href="#"></a></li>');
        $this.next('.drzPagination').append('<li class="drzPaginate-next"><a class="drzPaginate-next-link" href="#"></a></li>');
      }

      if ((typeof itemLimit === 'undefined' ? 'undefined' : _typeof(itemLimit)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && itemLimit !== false) {
        if (itemLimit === '') {
          itemLimit = 9;
        } else {
          itemLimit = ~~itemLimit;
        }
      } else {
        // set default item limit
        itemLimit = 9;
      }
      var item = 0;
      for (var i = 0; i < totalItems; i += itemLimit) {
        item += 1;
        if (isTable === true) {
          $pageItems.slice(i, i + itemLimit).addClass('drzPg-page-' + item);
        } else {
          $pageItems.slice(i, i + itemLimit).wrapAll('<div class="drzPg-page-' + item + '"></div>');
        }
        paginationUl.append('<li class="drzPaginate-li"><a href="#" class="drzPg-link-' + item + ' drzPaginate-link">' + item + '</a></li>');
      }

      var pgLink = paginationUl.find('[class^="drzPg-link-"]');
      var pages = pgLink.length;
      var elpFirst = void 0;
      var elpLast = void 0;

      if (pages < 2) {
        if (isTable === true) {
          elpFirst = $this.parent().next('.drzPagination').hide();
        } else {
          elpFirst = $this.next('.drzPagination').hide();
        }
      }

      $this.find('[class^="drzPg-page-"]').each(function hide() {
        var i = $(this).index() + 1;
        if (pages > 11) {
          if (i > 5) {
            paginationUl.find('.drzPg-link-' + i).parent().hide();
          }
        }
      });
      paginationUl.find('.drzPg-link-' + pages).parent().show();

      // insert ellipses
      paginationUl.find('li:first-child').addClass('active');
      $('<li class="drzPagination-ellipsis-last" style="display:none;">&hellip;</li>').insertBefore(paginationUl.find('li:last-child'));
      $('<li class="drzPagination-ellipsis-first" style="display:none;">&hellip;</li>').insertAfter(paginationUl.find('li:first-child'));

      var index = 1;
      var thisPage = void 0;
      if (isTable === true) {
        elpFirst = $this.parent().next('.drzPagination').find('.drzPagination-ellipsis-first');
        elpLast = $this.parent().next('.drzPagination').find('.drzPagination-ellipsis-last');
      } else {
        elpFirst = $this.next('.drzPagination').find('.drzPagination-ellipsis-first');
        elpLast = $this.next('.drzPagination').find('.drzPagination-ellipsis-last');
      }

      if (pages > 11) {
        elpLast.show();
      }

      var backBtn = paginationUl.parent().find('.drzPaginate-back');
      var nextBtn = paginationUl.parent().find('.drzPaginate-next');

      // start the back button as disabled
      backBtn.attr('disabled', 'disabled');

      // update callback
      function updatePagination(inx, btn) {
        var newIndex = inx + 2;
        var oldIndex = inx - 3;
        // when clicking on page number links
        if (!btn.match(/drzPaginate-next/gi) && !btn.match(/back/gi)) {
          if (inx > 5 && inx < pages - 4) {
            paginationUl.find('.drzPg-link-' + inx).parent().siblings().hide();
            elpLast.show();elpFirst.show();
            // basicaly create this layout: < 1... 5 6 [7] 8 9...20 >
            paginationUl.find('.drzPg-link-1, .drzPg-link-' + (inx + 1) + ', .drzPg-link-' + (inx + 2) + ',\n            .drzPg-link-' + (inx - 1) + ', .drzPg-link-' + (inx - 2) + ', .drzPg-link-' + pages).parent().show();
          }
          // to control the last group of page links: < 1...12 14 [15] 16 17 18 >
          if (inx > pages - 5 && inx <= pages - 2) {
            elpLast.hide();
            paginationUl.find('.drzPg-link-' + (inx - 3)).parent().hide();
            paginationUl.find('.drzPg-link-' + (inx - 2) + ', .drzPg-link-' + (pages - 1) + ', .drzPg-link-' + (pages - 2)).parent().show();
            if (inx === pages - 4 || inx === pages - 3) {
              paginationUl.find('.drzPg-link-' + (inx - 3) + ', .drzPg-link-' + (inx - 4)).parent().hide();
              paginationUl.find('.drzPg-link-' + (inx + 1) + ', .drzPg-link-' + (inx - 1)).parent().show();
            }
          }
          if (inx > pages - 3) {
            elpLast.hide();
            elpFirst.show();
            pgLink.parent().hide(); // hide all page links
            paginationUl.find('.drzPg-link-1, .drzPg-link-' + (pages - 4) + ', .drzPg-link-' + (pages - 3) + ',\n            .drzPg-link-' + (pages - 2) + ', .drzPg-link-' + (pages - 1) + ', .drzPg-link-' + pages).parent().show();
          }
          // if clicking very last page link
          if (inx === pages) {
            elpLast.hide();
            elpFirst.show();
            pgLink.parent().hide(); // hide all page links
            // then show last 5
            paginationUl.find('.drzPg-link-1, .drzPg-link-' + pages + ', .drzPg-link-' + (pages - 1) + ', .drzPg-link-' + (pages - 2) + ',\n            .drzPg-link-' + (pages - 3) + ', .drzPg-link-' + (pages - 4)).parent().show();
          }
          // to control first group of page links: < 1 2 3 5 [5] 6 7...18 >
          if (inx > 2 && inx < 6) {
            // 3-5
            elpFirst.hide();
            paginationUl.find('.drzPg-link-' + (inx + 3)).parent().hide();
            paginationUl.find('.drzPg-link-' + (inx + 1) + ', .drzPg-link-' + (inx - 1) + ',\n            .drzPg-link-' + (inx - 2) + ', .drzPg-link-2').parent().show();
            if (inx === 4 || inx === 5) {
              paginationUl.find('.drzPg-link-' + (inx + 2)).parent().show();
              paginationUl.find('.drzPg-link-' + (inx + 4)).parent().hide();
            }
          }
          if (inx === 1 || inx === 2 || inx === 3) {
            paginationUl.find('.drzPg-link-6, .drzPg-link-7').parent().hide();
          }
          // in case clicking very first page link from random location
          if (inx === 1) {
            // set up first 5
            elpLast.show();
            elpFirst.hide();
            pgLink.parent().hide(); // hide all page links
            // then show first 5
            paginationUl.find('.drzPg-link-1, .drzPg-link-2, .drzPg-link-3, .drzPg-link-4, .drzPg-link-5, .drzPg-link-' + pages).parent().show();
          }
        }
        if (btn.match(/drzPaginate-next/gi)) {
          // update newer buttons
          if (inx >= 4 && inx < pages - 2) {
            paginationUl.find('.drzPg-link-' + newIndex).parent().show();
            if (inx >= pages - 4) {
              elpLast.hide();
              paginationUl.find('.drzPg-link-' + (pages - 1)).parent().show();
            }
          }
          // update older buttons
          if (inx > 5 && inx < pages - 1) {
            elpFirst.show();
            paginationUl.find('.drzPg-link-' + oldIndex).parent().hide();
            paginationUl.find('.drzPg-link-' + 2).parent().hide();
          }
        }
        if (btn.match(/back/gi)) {
          if (inx > 5 && inx < pages - 2) {
            newIndex += 1;
            oldIndex += 1;
            paginationUl.find('.drzPg-link-' + oldIndex).parent().show();
            paginationUl.find('.drzPg-link-' + newIndex).parent().hide();
            paginationUl.find('.drzPg-link-' + pages).parent().show(); // always show last page btn
            if (inx === pages - 4) {
              paginationUl.find('.drzPg-link-' + (pages - 1)).parent().show();
            }
            if (inx === pages - 5) {
              paginationUl.find('.drzPg-link-' + (pages - 1)).parent().hide();
              elpLast.show();
            }
          } else if (inx <= 5) {
            // when you navigate back into the lower numbers again
            paginationUl.find('.drzPg-link-' + 2 + ', .drzPg-link-' + 3).parent().show();
            elpFirst.hide();
            if (inx <= 5 && inx >= 3) {
              paginationUl.find('.drzPg-link-' + (newIndex + 1)).parent().hide();
            }
          }
        }
      }

      pgLink.click(function clickLink(e) {
        e.preventDefault();
        var el = $(this);
        el.parent().addClass('active').siblings().removeClass('active');
        index = ~~el.attr('class').split('-')[2];
        if (pages > 11) {
          updatePagination(index, el.attr('class'));
        }
        // make the clicked page link page visible
        thisPage = $this.find('.drzPg-page-' + index);
        if (isTable === true) {
          thisPage.siblings().removeClass('show-tr').addClass('hide');
          thisPage.removeClass('hide').addClass('show-tr');
        } else if (!thisPage.is(':visible')) {
          thisPage.show().siblings().hide();
        }
        if (index === 1) {
          if (!backBtn.is('[disabled]')) {
            backBtn.attr('disabled', 'disabled');
          }
        } else {
          backBtn.removeAttr('disabled');
        }
        if (index === pages) {
          if (!nextBtn.is('[disabled]')) {
            nextBtn.attr('disabled', 'disabled');
          }
        } else {
          nextBtn.removeAttr('disabled', 'disabled');
        }
      });

      backBtn.click(function backLink(e) {
        e.preventDefault();
        var el = $(this);
        index -= 1;
        if (pages > 11) {
          updatePagination(index, el.attr('class'));
        }
        if (index < 1) {
          index = 1;
        } else if (index === 1) {
          el.attr('disabled', 'disabled');
        }
        // make the previous page visible
        thisPage = $this.find('.drzPg-page-' + index);
        if (isTable === true) {
          thisPage.siblings().removeClass('show-tr').addClass('hide');
          thisPage.removeClass('hide').addClass('show-tr');
        } else if (!thisPage.is(':visible')) {
          thisPage.show().siblings().hide();
        }
        paginationUl.find('.drzPg-link-' + index).parent().addClass('active').siblings().removeClass('active');

        if (nextBtn.is('[disabled]')) {
          nextBtn.removeAttr('disabled');
        }
      });
      nextBtn.click(function nextClick(e) {
        e.preventDefault();
        var el = $(this);
        index += 1;
        if (pages > 11) {
          updatePagination(index, el.attr('class'));
        }
        if (index > pages) {
          index = pages;
        } else if (index === pages) {
          el.attr('disabled', 'disabled');
        }
        paginationUl.find('.drzPg-link-' + index).parent().addClass('active').siblings().removeClass('active');

        // make the next page visible
        thisPage = $this.find('.drzPg-page-' + index);
        if (isTable === true) {
          thisPage.siblings().removeClass('show-tr').addClass('hide');
          thisPage.removeClass('hide').addClass('show-tr');
        } else if (!thisPage.is(':visible')) {
          thisPage.show().siblings().hide();
        }
        if (backBtn.is('[disabled]')) {
          backBtn.removeAttr('disabled');
        }
      });
    });
    return this;
  };
})(jQuery);

/* Back To Top Scrolling
* ======================= */
(function ($) {
  $.fn.drzTopScroll = function topScroll() {
    var $this = $(this);
    drzzle.window.scroll(function () {
      var passedCheck = $this.offset().top > 500;
      if (passedCheck && !$this.is(':visible')) {
        $this.fadeIn();
      } else if (!passedCheck && $this.is(':visible')) {
        $this.fadeOut();
      }
    });
    $this.click(function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 'slow');
      return false;
    });
    return this;
  };
})(jQuery);

/* Anchor Scrolling
* ======================= */
(function ($) {
  $.fn.drzAnchorScroll = function anchorScroll() {
    var $this = $(this);
    var scrollTo = function scrollTo(e) {
      var name = $(this.hash).selector.split('#')[1];
      var $el = $('[data-anchor-scroll="' + name + '"]');
      if (_typeof($el.offset()) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $el.offset() !== false) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $el.offset().top }, 500);
      }
    };
    $this.find('a').click(scrollTo);
    $.fn.drzAnchorScroll.destroy = function ($el) {
      $el.find('a').off('click', scrollTo);
    };
    return this;
  };
})(jQuery);

/*
============================
 Drzzle Tooltips Plugin
============================
*/
(function ($) {
  $.fn.drzTooltip = function initTooltips() {
    var $tooltip = $(this);
    var $body = $('body');
    $tooltip.each(function tip() {
      var $this = $(this);
      var ttContent = $this.attr('data-tooltip-content');
      var $ttPos = $this.attr('data-tooltip-position');
      var toolTip = void 0;
      var liveTip = void 0;
      var liveTipWidth = void 0;
      var liveTipHeight = void 0;
      var liveTipArrow = void 0;
      var liveArrowHeight = void 0;
      var liveArrowWidth = void 0;
      var triggerHeight = void 0;
      var triggerWidth = void 0;
      var triggerOffsetLeft = void 0;
      var triggerOffsetTop = void 0;

      // attribute options
      if ((typeof $ttPos === 'undefined' ? 'undefined' : _typeof($ttPos)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && $ttPos !== false) {
        if ($ttPos === '') {
          $ttPos = 'top';
        }
      } else {
        $ttPos = 'top';
      }

      if ((typeof ttContent === 'undefined' ? 'undefined' : _typeof(ttContent)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && ttContent !== false) {
        if (ttContent === '') {
          ttContent = 'Content Here';
        }
      } else {
        ttContent = 'Content Here';
      }

      var actions = {
        buildTip: function buildTip() {
          triggerHeight = ~~$this.outerHeight();
          triggerWidth = ~~$this.outerWidth();
          triggerOffsetLeft = ~~$this.offset().left;
          triggerOffsetTop = ~~$this.offset().top;

          toolTip = $('<span class="drzTooltip-tip">' + ttContent + '<div class="drzTooltip-arrow"></div></span>');
          if (!$body.siblings('.drzTooltip-tip').length) {
            toolTip.insertAfter($body);
          }

          liveTip = $body.siblings('.drzTooltip-tip');
          liveTipArrow = liveTip.find('.drzTooltip-arrow');
          liveTipWidth = ~~liveTip.outerWidth();
          liveTipHeight = ~~liveTip.outerHeight();

          // set arrow class here based on position
          if ($ttPos.match(/top/gi)) {
            liveTipArrow.addClass('drzTooltip-tip-arrowTop');
          } else if ($ttPos.match(/bottom/gi)) {
            liveTipArrow.addClass('drzTooltip-tip-arrowBottom');
          } else if ($ttPos.match(/right/gi)) {
            liveTipArrow.addClass('drzTooltip-tip-arrowRight');
          } else if ($ttPos.match(/left/gi)) {
            liveTipArrow.addClass('drzTooltip-tip-arrowLeft');
          }

          liveArrowHeight = ~~liveTip.find('.drzTooltip-arrow').outerHeight();
          liveArrowWidth = ~~liveTip.find('.drzTooltip-arrow').outerWidth();

          if ($ttPos.match(/top/gi) || $ttPos.match(/bottom/gi)) {
            if (liveTipWidth <= triggerWidth) {
              liveTip.css('left', triggerOffsetLeft + (triggerWidth - liveTipWidth) / 2);
            } else if (liveTipWidth > triggerWidth) {
              liveTip.css('left', triggerOffsetLeft - (liveTipWidth - triggerWidth) / 2);
            }
            if ($ttPos.match(/top/gi)) {
              liveTip.css('top', triggerOffsetTop - liveTipHeight - liveArrowHeight);
            } else if ($ttPos.match(/bottom/gi)) {
              liveTip.css('top', triggerOffsetTop + triggerHeight + liveArrowHeight);
            }
          }
          if ($ttPos.match(/right/gi) || $ttPos.match(/left/gi)) {
            if (triggerHeight >= liveTipHeight) {
              liveTip.css('top', triggerOffsetTop + (triggerHeight - liveTipHeight) / 2);
            } else if (triggerHeight < liveTipHeight) {
              liveTip.css('top', triggerOffsetTop - (liveTipHeight - triggerHeight) / 2);
            }
            if ($ttPos.match(/right/gi)) {
              liveTip.css('left', triggerOffsetLeft + triggerWidth + liveArrowWidth);
            } else if ($ttPos.match(/left/gi)) {
              liveTip.css('left', triggerOffsetLeft - (liveTipWidth + liveArrowWidth));
            }
            // vertically center arrows for left/right positioned tips
            liveTipArrow.css('top', liveTipHeight / 2 - liveArrowHeight / 2);
          }
          liveTip.addClass('drzTooltip-activeTip');
        },
        removeTip: function removeTip() {
          if ($body.siblings('.drzTooltip-tip').length) {
            $body.siblings('.drzTooltip-tip').removeClass('drzTooltip-activeTip').remove();
          }
        },

        resizeTimer: null,
        resizeTip: function resizeTip() {
          clearTimeout(this.resizeTimer);
          this.resizeTimer = setTimeout(function () {
            actions.removeTip();
          }, 200);
        }
      };

      // attach all listeners
      drzzle.window.resize(actions.resizeTip);

      $this.mouseover(function () {
        if (window.matchMedia(drzzle.viewports.desktop).matches) {
          actions.buildTip();
        }
      });
      $this.mouseleave(function () {
        if (window.matchMedia(drzzle.viewports.desktop).matches) {
          actions.removeTip();
        }
      });
      $this.click(function () {
        if (window.matchMedia(drzzle.viewports.tablet).matches || window.matchMedia(drzzle.viewports.mobile).matches) {
          if (!$body.siblings('.drzTooltip-tip').length) {
            actions.buildTip();
          } else {
            actions.removeTip();
          }
        }
      });

      // Destroy method
      $.fn.drzTooltip.destroy = function ($el) {
        drzzle.window.off('resize', actions.resizeTip);
        actions.removeTip();
        $el.each(function removeListeners() {
          var $tip = $(this);
          $tip.off('mouseover');
          $tip.off('mouseleave');
          $tip.off('click');
        });
      };
    });
    return this;
  };
})(jQuery);