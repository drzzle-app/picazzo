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
    desktop: 'screen and (min-width : 993px)',
  },
  googleMaps: [],
  window: $(window),
  document: $(document),
  picazzo: window.picazzo,
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
    if (window.__editor) {
      // initiate the plugin asap in editor
      setHeights();
    } else {
      // set after window loads in a page env
      drzzle.window.load(() => setHeights());
    }
    $.fn.equalHeights.destroy = ($el) => {
      $el.children().each(function unSet() {
        $(this).css('min-height', '');
      });
    };
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
      if (!window.__editor) {
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
          });
      }
      // destroy plugin
      $.fn.drzSiteSearch.destroy = ($el) => {
        $el.off('keyup', this.filterResults);
      };
    });
    return this;
  };
})(jQuery);

/* Url checker for hashed links
* ======================= */
(($) => {
  $.fn.drzCheckUrl = function drzCheckUrl() {
    const hash = window.location.hash;
    if (hash.match(/^#/gi)) {
      const scrollId = hash.split('#')[1];
      const $el = $(`[data-anchor-scroll="${scrollId}"]`);
      if ($el.length && typeof $el.offset() !== 'undefined' && $el.offset() !== false) {
        $('html, body').animate({ scrollTop: $el.offset().top }, 500);
      }
    }
  };
})(jQuery);

/* On Reveal Plugin
* ======================= */
(($) => {
  $.fn.drzOnReveal = function drzOnReveal(options) {
    const $droplet = $(this);
    const $child = $droplet.find(options.child);
    $droplet.css('transition', '0s');
    $child.css('transition', '0s');
    const animations = $droplet.attr('data-on-reveal');
    const editor = window.__editor;
    let onScroll;
    const methods = {
      beenAnimated: false,
      isVisible(el) {
        const rect = el.getBoundingClientRect();
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
      },
      get() {
        let viewport = '';
        if (window.matchMedia(drzzle.viewports.desktop).matches) {
          viewport = 'desktop';
        }
        if (window.matchMedia(drzzle.viewports.tablet).matches) {
          viewport = 'tablet';
        }
        if (window.matchMedia(drzzle.viewports.mobile).matches) {
          viewport = 'mobile';
        }
        return { viewport };
      },
      getValue(revealData, type) {
        const viewport = methods.get().viewport;
        let value = revealData[type][viewport];
        if (viewport !== 'desktop' && value === 'default' && value.desktop !== 'default') {
          value = revealData[type].desktop;
        }
        if (value === 'default') {
          value = '0s';
        }
        return parseFloat(value.replace(/[^0-9.,]+/gi, ''));
      },
      getTotalDuration(buffer) {
        const revealData = JSON.parse(animations);
        const time = buffer || 0;
        if (!revealData.transition) {
          return time;
        }
        const transition = methods.getValue(revealData, 'transition');
        const transitionDelay = methods.getValue(revealData, 'transition-delay');
        const life = transition + transitionDelay + (time / 1000.0);
        // change to milliseconds for setTimeout
        return life.toFixed(3) * 1000.0;
      },
      life: 0,
      revealingTime: null,
      checkElement(buffer) {
        const isVisible = methods.isVisible($child.get(0));
        if (!methods.beenAnimated) {
          $droplet.addClass('drzAnimation-onReveal-row');
          $child.addClass('drzAnimation-onReveal');
          if (animations && isVisible) {
            const startAfter = buffer === 0 && !editor ? 100 : 0;
            setTimeout(() => {
              $droplet.css('transition', '');
              $child.css('transition', '');
              $droplet.addClass('drzAnimation-revealing');
              $child.addClass('drzAnimation-revealing');
              methods.beenAnimated = true;
              const life = methods.getTotalDuration(buffer);
              methods.life = life;
              $droplet.removeClass('drzAnimation-onReveal-row');
              $child.removeClass('drzAnimation-onReveal');
              clearTimeout(methods.revealingTime);
              methods.revealingTime = setTimeout(() => {
                $droplet.removeClass('drzAnimation-revealing');
                $child.removeClass('drzAnimation-revealing');
                // we need to add the animation class back if editing
                // the reveal state
                if (editor && options.editing) {
                  $droplet.addClass('drzAnimation-onReveal-row');
                  $child.addClass('drzAnimation-onReveal');
                }
                if (onScroll) {
                  drzzle.window.off('scroll', onScroll);
                }
              }, life);
            }, startAfter);
          }
        }
      },
      init() {
        $(document).ready(() => {
          this.checkElement(0);
          let scrollTimer;
          onScroll = () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(methods.checkElement, 25);
          };
          if (!editor) {
            drzzle.window.on('scroll', onScroll);
          }
        });
      },
    };
    methods.init();
    // destroy plugin
    $.fn.drzOnReveal.destroy = () => {
      drzzle.window.off('scroll', onScroll);
    };
    return this;
  };
})(jQuery);
