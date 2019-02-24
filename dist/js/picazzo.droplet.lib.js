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
  window: $(window)
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