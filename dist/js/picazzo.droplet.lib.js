'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
*  ===================================
*   Drzzle Jquery droplet library
*  ===================================
*   Author: Roger Avalos
*  ==================================
*/
// Global variables
// TODO remove these
var drzMobile = 'screen and (min-width:50px) and (max-width:600px)';
var drzTablet = 'screen and (min-width:601px) and (max-width:992px)';
var drzDesktop = 'screen and (min-width : 993px)';
var drzWindow = $(window);

window.drzzle = {
  viewports: {
    mobile: 'screen and (min-width:50px) and (max-width:600px)',
    tablet: 'screen and (min-width:601px) and (max-width:992px)',
    desktop: 'screen and (min-width : 993px)'
  },
  googleMaps: [],
  window: $(window),
  document: $(document)
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
    setHeights();
    $.fn.equalHeights.destroy = function ($el) {
      $el.children().each(function unSet() {
        $(this).css('min-height', '');
      });
    };
    return this;
  };
})(jQuery);

/* Back To Top Scrolling
* ======================= */
(function ($) {
  $.fn.topScroll = function topScroll() {
    var $this = $(this);
    var $topScrollBtn = $('.topScroll-button');
    $this.scroll(function () {
      if ($this.scrollTop() > 500) {
        if (!$topScrollBtn.is(':visible')) {
          $topScrollBtn.fadeIn();
        }
      } else if ($topScrollBtn.is(':visible')) {
        $topScrollBtn.fadeOut();
      }
    });
    $topScrollBtn.click(function (e) {
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
      if ((0, _typeof3.default)($el.offset()) !== (typeof undefined === 'undefined' ? 'undefined' : (0, _typeof3.default)(undefined)) && $el.offset() !== false) {
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
        init: function init($v, resize) {
          $attrs = $v.attr('data-videos');
          $attrs = $attrs.desktop ? $attrs : JSON.parse($attrs);
          // we only want to redraw on resize if there is a change
          if (resize && $attrs[resize.startingViewport].src !== $attrs[resize.endingViewport].src) {
            $v.find('video.drzSection-video').remove();
            methods.drawVideo($v);
          }
          if (!resize) {
            $v.find('video.drzSection-video').remove();
            methods.drawVideo($v);
          }
        },
        drawVideo: function drawVideo($v) {
          // draw new video
          var data = methods.getSource($attrs);
          var $newVideo = $('\n            <video class="drzSection-video" muted loop playsinline autoplay>\n              <source src="' + data.src + '" type="video/' + data.type + '" />\n              <p class="warning">Your browser does not support HTML5 video.</p>\n            </video>');
          // prepend to container
          $v.prepend($newVideo);
          // auto play video if it hasn't started on it's own
          var domV = $v.find('.drzSection-video').get(0);
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
        getSource: function getSource(data) {
          var src = '';
          var type = '';
          if (window.matchMedia(drzzle.viewports.mobile).matches) {
            src = data.mobile.src;
            type = data.mobile.type;
          }
          if (window.matchMedia(drzzle.viewports.tablet).matches) {
            src = data.tablet.src;
            type = data.tablet.type;
          }
          if (window.matchMedia(drzzle.viewports.desktop).matches) {
            src = data.desktop.src;
            type = data.desktop.type;
          }
          return { src: src, type: type };
        },
        get: function get() {
          var viewport = '';
          if (window.matchMedia(drzzle.viewports.mobile).matches) {
            viewport = 'mobile';
          }
          if (window.matchMedia(drzzle.viewports.tablet).matches) {
            viewport = 'tablet';
          }
          if (window.matchMedia(drzzle.viewports.desktop).matches) {
            viewport = 'desktop';
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

      // attach listeners
      $audio.addEventListener('durationchange', durChange, false);
      $audio.addEventListener('timeupdate', timeUpdate, false);
      $playBtn.click(playAudio);
      $pauseBtn.click(pauseAudio);
      $volume.change(setVolume);
      $mute.click(toggleMute);

      $.fn.drzAudioPlayer.destroy = function ($el) {
        // grab attached selectors and remove attached listeners
        $el.find('.drzAudio-playBtn').off('click');
        $el.find('.drzAudio-pauseBtn').off('click');
        $el.find('.drzAudio-volSlider').off('change');
        $el.find('.drzAudio-muteBtn').off('click');
        $el.find('.drzAudio-progressBar').off('vmousedown');
        var audioNode = $el.find('.drzAudio-src').get(0);
        audioNode.removeEventListener('durationchange', durChange, false);
        audioNode.removeEventListener('timeupdate', timeUpdate, false);
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

      if ((typeof $delayOption === 'undefined' ? 'undefined' : (0, _typeof3.default)($delayOption)) !== (typeof undefined === 'undefined' ? 'undefined' : (0, _typeof3.default)(undefined)) && $delayOption !== false) {
        if ($delayOption === '') {
          $delayOption = 2 * 1000;
        } else {
          $delayOption = ~~$delayOption * 1000;
        }
      } else {
        // set default delay
        $delayOption = 2 * 1000;
      }

      if ((typeof $controlsOption === 'undefined' ? 'undefined' : (0, _typeof3.default)($controlsOption)) !== (typeof undefined === 'undefined' ? 'undefined' : (0, _typeof3.default)(undefined)) && $controlsOption !== false) {
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
        if (window.matchMedia(window.drzzle.viewports.mobile).matches) {
          visibleNum = 1;
        } else if ((typeof $visibleOption === 'undefined' ? 'undefined' : (0, _typeof3.default)($visibleOption)) !== (typeof undefined === 'undefined' ? 'undefined' : (0, _typeof3.default)(undefined)) && $visibleOption !== false) {
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
      if ((typeof $slideDelay === 'undefined' ? 'undefined' : (0, _typeof3.default)($slideDelay)) !== (typeof undefined === 'undefined' ? 'undefined' : (0, _typeof3.default)(undefined)) && $slideDelay !== false) {
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
      if ((typeof $controlOption === 'undefined' ? 'undefined' : (0, _typeof3.default)($controlOption)) !== (typeof undefined === 'undefined' ? 'undefined' : (0, _typeof3.default)(undefined)) && $controlOption !== false) {
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
      if ((typeof $bulletOption === 'undefined' ? 'undefined' : (0, _typeof3.default)($bulletOption)) !== (typeof undefined === 'undefined' ? 'undefined' : (0, _typeof3.default)(undefined)) && $bulletOption !== false) {
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
      if ((typeof $effectOption === 'undefined' ? 'undefined' : (0, _typeof3.default)($effectOption)) !== (typeof undefined === 'undefined' ? 'undefined' : (0, _typeof3.default)(undefined)) && $effectOption !== false) {
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
          window.drzzle.window.resize(resizeContentSlider);
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
        window.drzzle.window.off('resize', resizeContentSlider);
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
    $countDown.each(function initPlugin() {
      var $this = $(this);
      var $endMsg = $this.find('.drzCountdown-endedMsg');
      var $timer = $this.find('.drzCountdown-timerContainer');
      var countDownInterval = void 0;
      var checkStartInterval = void 0;
      var sets = void 0;

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
          if ((typeof nextSet === 'undefined' ? 'undefined' : (0, _typeof3.default)(nextSet)) !== (typeof undefined === 'undefined' ? 'undefined' : (0, _typeof3.default)(undefined)) && nextSet !== false) {
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
        if ((typeof $opts === 'undefined' ? 'undefined' : (0, _typeof3.default)($opts)) !== (typeof undefined === 'undefined' ? 'undefined' : (0, _typeof3.default)(undefined)) && $opts !== false) {
          $opts = JSON.parse($opts);
          sets = $opts.sets.length;
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
    return this;
  };
})(jQuery);