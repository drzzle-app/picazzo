/*
*  ===================================
*   Drzzle Jquery droplet library
*  ===================================
*   Author: Roger Avalos
*  ==================================
*/
// Global variables
const drzMobile = 'screen and (min-width:50px) and (max-width:600px)';
const drzTablet = 'screen and (min-width:601px) and (max-width:992px)';
const drzDesktop = 'screen and (min-width : 993px)';
const drzWindow = $(window);

window.drzzle = {
  viewports: {
    mobile: 'screen and (min-width:50px) and (max-width:600px)',
    tablet: 'screen and (min-width:601px) and (max-width:992px)',
    desktop: 'screen and (min-width : 993px)',
  },
  googleMaps: [],
  window: $(window),
};

/* Equal Heights
* ======================= */
(($) => {
  $.fn.equalHeights = function equalHeights() {
    const $row = $(this);
    function setHeights() {
      $row.each(function findEquals() {
        const $elements = $(this).children();
        if ($elements.length > 1) {
          let largestHeight = 0;
          if (!window.matchMedia(drzzle.viewports.mobile).matches) {
            $elements.css('min-height', '1px');
            $elements.each(function find() {
              const $col = $(this);
              if ($col.hasClass('column')) {
                const colHeight = $col.outerHeight();
                if (colHeight > largestHeight) {
                  largestHeight = colHeight;
                }
              }
            });
            $elements.each(function set() {
              const $col = $(this);
              if ($col.hasClass('column')) {
                $col.css('min-height', largestHeight);
              }
            });
          } else {
            $elements.each(function set() {
              const $col = $(this);
              if ($col.hasClass('column')) {
                $col.css('min-height', '1px');
              }
            });
          }
        }
      });
    }

    let resizeTimer;
    drzzle.window.resize(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setHeights, 250);
    });
    setHeights();
    $.fn.equalHeights.destroy = ($el) => {
      $el.children().each(function unSet() {
        $(this).css('min-height', '');
      });
    };
    return this;
  };
})(jQuery);

/* Back To Top Scrolling
* ======================= */
(($) => {
  $.fn.topScroll = function topScroll() {
    const $this = $(this);
    const $topScrollBtn = $('.topScroll-button');
    $this.scroll(() => {
      if ($this.scrollTop() > 500) {
        if (!$topScrollBtn.is(':visible')) {
          $topScrollBtn.fadeIn();
        }
      } else if ($topScrollBtn.is(':visible')) {
        $topScrollBtn.fadeOut();
      }
    });
    $topScrollBtn.click((e) => {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 'slow');
      return false;
    });
    return this;
  };
})(jQuery);

/* Anchor Scrolling
* ======================= */
(($) => {
  $.fn.drzAnchorScroll = function anchorScroll() {
    const $this = $(this);
    const scrollTo = function scrollTo(e) {
      const name = $(this.hash).selector.split('#')[1];
      const $el = $(`[data-anchor-scroll="${name}"]`);
      if (typeof $el.offset() !== typeof undefined && $el.offset() !== false) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $el.offset().top }, 500);
      }
    };
    $this.find('a').click(scrollTo);
    $.fn.drzAnchorScroll.destroy = ($el) => {
      $el.find('a').off('click', scrollTo);
    };
    return this;
  };
})(jQuery);

/* Section Bg Videos
* ======================= */
(($) => {
  $.fn.drzSectionVideo = function drzAccordion() {
    const $video = $(this);
    $video.each(function initVideo() {
      const $v = $(this);
      let $attrs = $v.attr('data-videos');
      let resizeTimer;
      let start = true;
      let startingViewport;
      let endingViewport;
      const methods = {
        init($v, resize) {
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
        drawVideo($v) {
          // draw new video
          const data = methods.getSource($attrs);
          const $newVideo = $(`
            <video class="drzSection-video" muted loop playsinline autoplay>
              <source src="${data.src}" type="video/${data.type}" />
              <p class="warning">Your browser does not support HTML5 video.</p>
            </video>`);
          // prepend to container
          $v.prepend($newVideo);
          // auto play video if it hasn't started on it's own
          const domV = $v.find('.drzSection-video').get(0);
          domV.addEventListener('loadeddata', () => {
            let count = 0;
            const tryToPlay = () => {
              if (domV.paused && count < 31) {
                count += 1;
                domV.play().catch(() => { tryToPlay(); });
              }
            };
            tryToPlay();
          });
        },
        getSource(data) {
          let src = '';
          let type = '';
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
          return { src, type };
        },
        get() {
          let viewport = '';
          if (window.matchMedia(drzzle.viewports.mobile).matches) {
            viewport = 'mobile';
          }
          if (window.matchMedia(drzzle.viewports.tablet).matches) {
            viewport = 'tablet';
          }
          if (window.matchMedia(drzzle.viewports.desktop).matches) {
            viewport = 'desktop';
          }
          return { viewport };
        },
        resize() {
          if (start) {
            startingViewport = methods.get().viewport;
            start = false;
          }
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            endingViewport = methods.get().viewport;
            methods.init($v, { startingViewport, endingViewport });
            start = true;
          }, 250);
        },
      };

      if ($attrs) {
        // init the plugin on load
        methods.init($v);
        // redraw on screen resize
        drzzle.window.resize(methods.resize);
      }
      // destroy plugin
      $.fn.drzSectionVideo.destroy = ($el) => {
        $el.find('video.drzSection-video').remove();
        drzzle.window.off('resize', methods.resize);
      };
    });
    return this;
  };
})(jQuery);

/* Site Search (Client Side)
* ======================= */
(($) => {
  $.fn.drzSiteSearch = function siteSearch() {
    const $search = $(this);
    $search.each(function init() {
      const $this = $(this);
      const defaults = {
        file: 'js/site-search.json',
      };
      let $attrs = $this.attr('data-search');
      $attrs = $attrs.file ? $attrs : JSON.parse($attrs);
      const opts = $.extend(true, {}, defaults, $attrs);
      const $searchFile = opts.file;
      let $srContainer;
      const prevent = window.__editor ? ' onclick="event.preventDefault();"' : '';
      const methods = {
        data: [],
        filterResults(e) {
          let searchResults = '';
          let $searchedData = $(e.currentTarget).val();
          if ($searchedData !== '') {
            $searchedData = new RegExp($searchedData, 'gi');
            $(methods.data).each((key, val) => {
              if (val.pagetitle.match($searchedData) || val.metadata.match($searchedData)) {
                searchResults += `<a href="${window.__editor ? '#' : val.href}" class="searchResult-link"${prevent}>
                <div class="searchResult"><strong>${val.pagetitle}`;
                searchResults += `</strong><br/>${val.metadata}</div></a>`;
                $srContainer.removeClass('hide');
              }
            });
            $srContainer.html(searchResults);
          } else {
            $srContainer.addClass('hide');
            $srContainer.html('');
          }
        },
      };
      $.getJSON($searchFile)
        .done((data) => {
          methods.data = data;
          // only insert search container if not there
          if (!$this.next('.searchResults-container').length) {
            $('<div class="searchResults-container"></div>').insertAfter($this);
          }
          $srContainer = $this.next('.searchResults-container');
          $srContainer.addClass('hide');
          $this.keyup(methods.filterResults);
        })
        .fail(() => {
          console.log('Error loading site search'); // eslint-disable-line
        });
      // destroy plugin
      $.fn.drzSiteSearch.destroy = ($el) => {
        $el.off('keyup', this.filterResults);
      };
    });
    return this;
  };
})(jQuery);
