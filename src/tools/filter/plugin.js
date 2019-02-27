/*
============================
 Drzzle Filtering Plugin
============================
*/
(($) => {
  $.fn.sortFilter = function sortFilter() {
    const $filter = $(this);
    $filter.each(function initPlugin() {
      const $this = $(this);
      let filterContainer;
      let isTable = false;
      if ($this.next().is('table')) {
        isTable = true;
        filterContainer = $this.next('table').find('.drzFilter-container');
      } else {
        filterContainer = $this.next('.drzFilter-container');
      }
      const filterBtn = $this.find('button');
      const filterSearch = $this.find('.search');
      const filterSearchAttr = filterSearch.attr('data-filter-search');
      const animationSpeed = 200;

      if (typeof filterSearchAttr !== typeof undefined && filterSearchAttr !== false) {
        if (filterSearchAttr.match(/true/gi)) {
          const searchContentContainer = filterContainer;
          searchContentContainer.children().each(function go() {
            $(this).addClass('search-element-parent');
          });
          // store the initial pagination states for resetting
          let initialState;
          searchContentContainer.ready(() => {
            if (searchContentContainer.hasClass('paginate')) {
              if (isTable === true) {
                initialState = $this.next('table').find('.drzFilter-container').html();
              } else {
                initialState = $this.next('.drzFilter-container').html();
              }
            }
          });
          filterSearch.keyup(function onKeyup() {
            const searchedElement = searchContentContainer.find('.search-element-parent');
            const input = $(this).val();
            const thisText = input.toString();
            const searchedText = new RegExp(thisText, 'gim');
            // var searchedText = new RegExp('(?![^<]*>)' + thisText + '\b(?![^ <>])', 'gim');
            searchedElement.each(function update() {
              const el = $(this);
              const elText = el.text();
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
      let filterContainerContent;
      filterContainer.ready(() => {
        filterContainerContent = filterContainer.html();
      });

      function sortContent(el, attr, sortBtn) {
        return $(filterContainer.find(el).toArray().sort((a, b) => {
          const top = new Date($(a).attr(attr));
          const bottom = new Date($(b).attr(attr));
          let result;
          if (sortBtn.match(/newest/gi)) {
            result = bottom - top;
          } else if (sortBtn.match(/oldest/gi)) {
            result = top - bottom;
          }
          return result;
        }));
      }

      filterBtn.each(function initBtn() {
        const thisBtn = $(this);
        const thisBtnAttr = thisBtn.attr('data-filter-category');
        const thisResetAttr = thisBtn.attr('data-filter-reset');
        const thisSortAttr = thisBtn.attr('data-filter-sort');
        // if reset button is present
        if (typeof thisResetAttr !== typeof undefined && thisResetAttr !== false && thisResetAttr.match(/true/gi)) {
          thisBtn.click(() => {
            filterContainer.html(filterContainerContent);
            if (filterContainer.hasClass('paginate')) {
              filterContainer.next('.pagination').find('.pg-link-1').trigger('click');
            }
            filterContainer.find('[data-filter-category]').each(function categ() {
              const el = $(this);
              if (!el.is(':visible')) {
                setTimeout(() => {
                  el.fadeIn(animationSpeed);
                }, animationSpeed);
              }
            });
          });
        }
        // if a data-filter-category exists on a button
        if (typeof thisBtnAttr !== typeof undefined && thisBtnAttr !== false) {
          thisBtn.click(() => {
            filterContainer.find('[data-filter-category]').each(function initCat() {
              const el = $(this);
              const filterContentAttr = el.attr('data-filter-category');
              if (filterContentAttr !== thisBtnAttr) {
                el.fadeOut(animationSpeed);
              } else {
                if (filterContainer.hasClass('paginate')) {
                  if (!el.parent().is(':visible')) {
                    el.parent().show();
                  }
                }
                setTimeout(() => {
                  el.fadeIn(animationSpeed);
                }, animationSpeed);
              }
            });
          });
        }
        // if a data-filter-sort exists on a button
        if (typeof thisSortAttr !== typeof undefined && thisSortAttr !== false) {
          thisBtn.click(() => {
            const newBuild = sortContent('[data-filter-sort]', 'data-filter-sort', thisSortAttr);
            filterContainer.html(newBuild);
          });
        }
      });
    });
    return this;
  };
})(jQuery);
