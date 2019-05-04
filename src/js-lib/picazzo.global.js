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
    // initiate the plugin after load
    drzzle.window.load(() => setHeights());
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
