(($) => {
  $.fn.drzFilterGrid = function filterGrid(options) {
    const $filterGrid = $(this);
    $filterGrid.each(function initPlugin() {
      const $this = $(this);
      const $search = $this.find('.drzFilter-grid-searchInput');
      const $filterBar = $this.find('.drzFilter-grid-bar');
      const $pagination = options.pagination ? ~~(options.pagination) : false;
      const $filters = options.filters;
      const classes = {
        gridContainer: options.gridContainer || 'drzFilter-grid-container',
        pagination: 'drzFilter-grid-pagination',
        firstEllipses: 'drzFilter-ellipses-first',
        lastEllipses: 'drzFilter-ellipses-last',
        pageNums: 'drzFilter-grid-paginationNums',
        activeBtn: 'drzFilter-grid-pageBtnActive',
        pageBtn: 'drzFilter-grid-pageBtn',
        prevBtn: 'drzFilter-grid-paginationPrev',
        nextBtn: 'drzFilter-grid-paginationNext',
        disabledBtn: 'drzFilter-grid-pageBtnDisabled',
        empty: 'drzFilter-grid-empty',
        checkFilters: 'drzFilter-grid-filters',
        checkbox: 'drzFilter-grid-checkInput',
        filterBox: 'drzFilter-grid-filterBox',
        filterReset: 'drzFilter-grid-filterReset',
        filterOpen: 'drzFilter-grid-filterBtn',
      };

      const list = options.feed || [];
      // set by newest by default
      const sortKey = options.sortKey || 'created';
      let shownList = list.sort((a, b) => new Date(b[sortKey]) - new Date(a[sortKey]));

      const methods = {
        paginated: false,
        totalPages: 0,
        currentPage: 1,
        fullList: [],
        filteredList: false,
        searchList: false,
        filterElements: {
          $filterBox: null,
          $resetBtn: null,
          $filterBtn: null,
        },
        drawGrid() {
          const $cardList = $this.find(`.${classes.gridContainer}`);
          $cardList.html('');
          if (shownList.length > 0) {
            $.each(shownList, (index, value) => {
              const $newCard = $(options.output(value));
              if (methods.paginated) {
                $newCard.hide();
                const page = ~~((index / $pagination) + 1);
                $newCard.attr('data-pagination-page', page);
                // set the number of total pages here
                if (index === shownList.length - 1) {
                  methods.totalPages = page;
                }
              }
              $cardList.append($newCard);
              if (options.onRender) {
                options.onRender($newCard);
              }
            });
            if (methods.paginated) {
              methods.updatePagination($this);
              // auto set the first round of pages visible
              methods.updatePaginationView({ $el: $this, page: 1 });
              methods.currentPage = 1;
              $this.find(`.${classes.pageBtn}`).eq(0).addClass(classes.activeBtn);
              // since this also runs on a reset, we need to reset initial class states
              $this.find(`.${classes.disabledBtn}`).removeClass(classes.disabledBtn);
              $this.find(`.${classes.prevBtn}`).addClass(classes.disabledBtn);
              if (methods.totalPages === 1) {
                $this.find(`.${classes.nextBtn}`).addClass(classes.disabledBtn);
              }
            } else {
              // pagination is disabled so show all cards
              $cardList.children().each(function showAllItems() {
                const $card = $(this);
                // lazy load all here
                const $unsetAsset = $card.find('[data-asset]');
                $unsetAsset.each(function lazyLoad() {
                  const $el = $(this);
                  const asset = $el.attr('data-asset');
                  if (options.assets === 'bg') {
                    $el.css('background-image', `url('${asset}')`);
                  } else {
                    $el.attr('src', asset);
                  }
                  $el.removeAttr('data-asset');
                });
              });
            }
            // on redraws, we need to make sure empty message is removed if there
            // are items in the grid list
            const $emptyMsg = $this.find(`.${classes.empty}`);
            if ($emptyMsg.length) {
              $emptyMsg.remove();
            }
          }
          if (shownList.length < 1 && methods.paginated) {
            $this.find(`.${classes.pagination}`).remove();
          }
          if (shownList.length < 1 && !$this.find(`.${classes.empty}`).length) {
            $this.append($(`<span class="${classes.empty}">No Items Found</span>`));
          }
        },
        resetFilter(e) {
          e.preventDefault();
          methods.filteredList = false;
          methods.searchList = false;
          $search.val('');
          // uncheck all filters
          const checked = methods.$filterBox.find(`.${classes.checkbox}:checked`);
          if (checked.length > 0) {
            checked.each(function buildSelected() {
              $(this).attr('checked', false);
            });
          }
          shownList = methods.fullList;
          methods.drawGrid();
        },
        onFilterClick(e) {
          e.preventDefault();
          methods.$filterBox.toggle();
          methods.$resetBtn.toggleClass('drzFilter-grid-filterResetShow');
          methods.$filterBtn.toggleClass('drzFilter-grid-filterBtnOpen');
        },
        buildFilters() {
          if ($filters) {
            // build out filter buttons and events
            const $filterContainer = $(`
              <div class="${classes.filterBox}">
                <a href="#" class="${classes.filterReset}">Reset</a>
                <button class="${classes.filterOpen}" name="filters">Filters</button>
              </div>
            `);
            $filterBar.append($filterContainer);
            const $filterBtn = $filterContainer.find(`.${classes.filterOpen}`);
            methods.$filterBtn = $filterBtn;
            const $resetBtn = $filterContainer.find(`.${classes.filterReset}`);
            methods.$resetBtn = $resetBtn;
            $filterBtn.click(methods.onFilterClick);
            $resetBtn.click(methods.resetFilter);
            // build filter checkboxes
            const $filterBox = $(`<div class="${classes.checkFilters}"></div>`);
            methods.$filterBox = $filterBox;
            $filterBox.insertAfter($filterBar);
            $.each($filters, (index, filter) => {
              const id = methods.tinyId();
              const $filterDiv = $(`
                <div class="drzFilter-grid-checkFilter">
                  <input class="${classes.checkbox}" value="${filter}" id="${filter}-${id}" type="checkbox" />
                  <label class="drzFilter-grid-checkLabel" for="${filter}-${id}">${filter}</label>
                </div>
              `);
              $filterBox.append($filterDiv);
              const $checkbox = $filterDiv.find(`.${classes.checkbox}`);
              $checkbox.change(() => {
                const checked = $filterBox.find(`.${classes.checkbox}:checked`);
                if (checked.length > 0) {
                  const selected = [];
                  checked.each(function buildSelected() {
                    selected.push($(this).attr('value'));
                  });
                  const feed = methods.searchList || methods.fullList;
                  shownList = feed.filter(p => selected.every(f => p.categories.indexOf(f) > -1));
                  methods.filteredList = shownList;
                } else {
                  // reset list to full list
                  shownList = methods.searchList || methods.fullList;
                  methods.filteredList = false;
                }
                // redraw here
                methods.drawGrid();
              });
            });
          }
        },
        updatePagination($el) {
          // This runs when we need to redraw the entire pagination.
          // This builds the pagination links
          let $paginationContaner = $el.find(`.${classes.pagination}`);
          let $nums = $paginationContaner.find(`.${classes.pageNums}`);
          if (!$paginationContaner.length) {
            $paginationContaner = $(`
            <div class="${classes.pagination}">
              <button class="${classes.prevBtn}" data-page="prev"></button>
              <div class="${classes.pageNums}"></div>
              <button class="${classes.nextBtn}" data-page="next"></button>
            </div>`);
            $nums = $paginationContaner.find(`.${classes.pageNums}`);
            // set click events for prev/next buttons
            $paginationContaner.find(`.${classes.prevBtn}`).click(methods.clickPagination);
            $paginationContaner.find(`.${classes.nextBtn}`).click(methods.clickPagination);
            $el.append($paginationContaner);
          } else {
            $nums.html('');
          }
          $.each([...Array(methods.totalPages).keys()], (num) => {
            const page = num + 1;
            const $pageBtn = $(`<button class="${classes.pageBtn}" data-page="${page}">${page}</button>`);
            // for long listed paginations
            if (methods.totalPages >= 10) {
              // after first page btn and before last page btn, we need to add the ellipsis [...]
              if ((page === 2 || page === methods.totalPages)) {
                const direction = page === 2 ? 'first' : 'last';
                const $ellipses = $(`<span class="drzFilter-grid-ellipses drzFilter-ellipses-${direction}">...</span>`);
                $nums.append($ellipses);
                if (direction === 'first') {
                  $ellipses.hide();
                }
              }
              // hide all buttons after the 6th one but not the last one
              if (page >= 7 && page < methods.totalPages) {
                // this basically creates the initial [1 2 3 4 5 6 ... 10]
                $pageBtn.hide();
              }
            }
            $pageBtn.click(methods.clickPagination);
            $nums.append($pageBtn);
          });
          if (methods.totalPages < 2) {
            $paginationContaner.hide();
          } else {
            $paginationContaner.show();
          }
        },
        clickPagination(e) {
          e.preventDefault();
          const $btn = $(e.currentTarget);
          let $newActiveBtb = $btn;
          const attr = $btn.attr('data-page');
          const $activeBtn = $btn.parent().find(`.${classes.activeBtn}`);
          let num;
          if (attr === 'next') {
            const nextPageNum = ~~(methods.currentPage) + 1;
            if (nextPageNum > methods.totalPages) {
              return;
            }
            num = nextPageNum;
            $activeBtn.removeClass(classes.activeBtn);
            $newActiveBtb = $btn.parent().find(`[data-page="${num}"]`);
            $newActiveBtb.addClass(classes.activeBtn);
          }
          if (attr === 'prev') {
            const prevPageNum = ~~(methods.currentPage) - 1;
            if (prevPageNum < 1) {
              return;
            }
            num = prevPageNum;
            $activeBtn.removeClass(classes.activeBtn);
            $newActiveBtb = $btn.parent().find(`[data-page="${num}"]`);
            $newActiveBtb.addClass(classes.activeBtn);
          }
          if (attr !== 'prev' && attr !== 'next') {
            $activeBtn.removeClass(classes.activeBtn);
            $btn.addClass(classes.activeBtn);
            num = ~~(attr);
          }
          methods.currentPage = num;
          // here we disable/enable buttons depending on if first
          // or last page is active
          const $prevBtn = $this.find(`.${classes.prevBtn}`);
          const $nextBtn = $this.find(`.${classes.nextBtn}`);
          if (~~(num) === 1) {
            $prevBtn.addClass(classes.disabledBtn);
          } else {
            $prevBtn.removeClass(classes.disabledBtn);
          }
          if (~~(num) === methods.totalPages) {
            $nextBtn.addClass(classes.disabledBtn);
          } else {
            $nextBtn.removeClass(classes.disabledBtn);
          }
          // set active page cards shown and kick off any lazy loading
          methods.updatePaginationView({ $el: $this, page: num });
          // if there is a large set of pages, we need to run the ellipsis generation
          if (methods.totalPages >= 10) {
            const $paginationContaner = $this.find(`.${classes.pagination}`);
            const $firstEllipses = $paginationContaner.find(`.${classes.firstEllipses}`);
            const $lastEllipses = $paginationContaner.find(`.${classes.lastEllipses}`);
            const bulk = $paginationContaner.find('[data-page]:not(:last-child):not(:first-child)');
            bulk.hide();
            const endThreshold = methods.totalPages - 5;
            // covers clicks from start range [2-6]
            if (num <= 6) {
              methods.setVisibleRange({
                start: 2,
                end: 6,
                $paginationContaner,
              });
              $lastEllipses.show();
              $firstEllipses.hide();
            }
            // covers clicks from ranges [7 - end threshold]. So this is basically
            // the mid range between first and last thresholds
            if (num > 6 && num < endThreshold) {
              methods.setVisibleRange({
                start: num - 2,
                end: num + 2,
                $paginationContaner,
              });
              $firstEllipses.show();
              $lastEllipses.show();
              $newActiveBtb.show();
            }
            // covers clicks from end range [num - end]
            if (num >= endThreshold) {
              methods.setVisibleRange({
                start: endThreshold,
                end: methods.totalPages - 1,
                $paginationContaner,
              });
              $lastEllipses.hide();
              $firstEllipses.show();
            }
          }
        },
        setVisibleRange(params) {
          for (let i = params.start; i <= params.end; i++) {
            const btn = params.$paginationContaner.find(`[data-page="${i}"]`);
            btn.show();
          }
        },
        updatePaginationView(params) {
          // this runs on pagination or next/prev button clicks
          params.$el.find('[data-pagination-page]').hide();
          const $activeCards = params.$el.find(`[data-pagination-page="${params.page}"]`);
          $activeCards.show();
          // check for activeClass then show srcs if not there as a means of lazy loading
          $activeCards.each(function setImgSources() {
            const $card = $(this);
            const $unsetAsset = $card.find('[data-asset]');
            if ($unsetAsset.length) {
              const asset = $unsetAsset.attr('data-asset');
              if (options.assets === 'bg') {
                $unsetAsset.css('background-image', `url('${asset}')`);
              } else {
                $unsetAsset.attr('src', asset);
              }
              $unsetAsset.removeAttr('data-asset');
            }
          });
        },
        searchTime: null,
        onSearch(e) {
          clearTimeout(methods.searchTime);
          methods.searchTime = setTimeout(() => {
            const input = new RegExp(e.target.value, 'gi');
            const keys = options.searchKeys || [];
            const feed = methods.filteredList || methods.fullList;
            if (e.target.value === '') {
              methods.searchList = false;
              shownList = feed;
            } else {
              shownList = feed.filter((item) => {
                // we need to check all key options to search through
                for (let i = 0; i < keys.length; i++) {
                  const key = keys[i];
                  if (item[key] && item[key].match(input)) {
                    return item;
                  }
                }
                return false;
              });
              methods.searchList = shownList;
            }
            // redraw grid
            methods.drawGrid();
          }, 250);
        },
        tinyId() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return `${s4()}`;
        },
      };
      methods.fullList = shownList;
      methods.paginated = typeof $pagination !== 'boolean';
      $search.on('input', methods.onSearch);
      methods.drawGrid();
      methods.buildFilters();

      $.fn.drzFilterGrid.destroy = ($el) => {
        // reset all method data
        methods.totalPages = 0;
        methods.currentPage = 1;
        methods.fullList = [];
        methods.filteredList = false;
        methods.searchList = false;
        methods.filterElements = {
          $filterBox: null,
          $resetBtn: null,
          $filterBtn: null,
        };
        const $srch = $el.find('.drzFilter-grid-searchInput');
        $srch.val('');
        $srch.off('input');
        $el.find(`.${classes.gridContainer}`).html('');
        const $fltrBtn = $el.find(`.${classes.filterOpen}`);
        const $rstBtn = $el.find(`.${classes.filterReset}`);
        $fltrBtn.off('click');
        $rstBtn.off('click');
        const $fltrBox = $el.find(`.${classes.filterBox}`);
        $fltrBox.remove();
        const $fltrBtns = $el.find(`.${classes.checkFilters}`);
        $fltrBtns.remove();
        $el.find(`.${classes.pagination}`).remove();
        const $emptyMsg = $el.find(`.${classes.empty}`);
        if ($emptyMsg.length) {
          $emptyMsg.remove();
        }
      };
    });

    return $filterGrid;
  };
})(jQuery);
