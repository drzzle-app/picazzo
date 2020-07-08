(($) => {
  $.fn.drzFilterGrid = function filterGrid(options) {
    const $filterGrid = $(this);
    $filterGrid.each(function initPlugin() {
      const $this = $(this);
      const $search = $this.find('.drzFilter-grid-searchInput');
      const $filterBtn = $this.find('.drzFilter-grid-filterBtn');
      const $resetBtn = $this.find('.drzFilter-grid-filterReset');
      const $filterBox = $this.find('.drzFilter-grid-filters');
      const $pagData = $this.attr('data-paginate-items');
      const $pagination = $pagData ? ~~($pagData) : false;
      const $filterAttr = $this.attr('data-filter');
      const $filters = $filterAttr ? $filterAttr.split(',') : false;
      const classes = {
        pagination: 'drzFilter-grid-pagination',
        pageNums: 'drzFilter-grid-paginationNums',
        activeBtn: 'drzFilter-grid-pageBtnActive',
        pageBtn: 'drzFilter-grid-pageBtn',
        prevBtn: 'drzFilter-grid-paginationPrev',
        nextBtn: 'drzFilter-grid-paginationNext',
        disabledBtn: 'drzFilter-grid-pageBtnDisabled',
        empty: 'drzFilter-grid-empty',
        checkbox: 'drzFilter-grid-checkInput',
      };

      const list = options.feed || [];
      // set by newest by default
      let shownList = list.sort((a, b) => new Date(b.created) - new Date(a.created));

      const methods = {
        paginated: false,
        totalPages: 0,
        currentPage: 1,
        fullList: [],
        filteredList: false,
        searchList: false,
        drawGrid() {
          const $cardList = $this.find('.drzFilter-grid-container');
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
                  $el.attr('src', $el.attr('data-asset'))
                    .removeAttr('data-asset');
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
          const checked = $filterBox.find(`.${classes.checkbox}:checked`);
          if (checked.length > 0) {
            checked.each(function buildSelected() {
              $(this).attr('checked', false);
            });
          }
          shownList = methods.fullList;
          methods.drawGrid();
        },
        buildFilters() {
          if ($filters) {
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
          // TODO see if this layout is possible < 1...20 21 22 23 24...99 >
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
            $pageBtn.click(methods.clickPagination);
            $nums.append($pageBtn);
          });
        },
        clickPagination(e) {
          e.preventDefault();
          const $btn = $(e.currentTarget);
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
            $btn.parent().find(`[data-page="${num}"]`).addClass(classes.activeBtn);
          }
          if (attr === 'prev') {
            const prevPageNum = ~~(methods.currentPage) - 1;
            if (prevPageNum < 1) {
              return;
            }
            num = prevPageNum;
            $activeBtn.removeClass(classes.activeBtn);
            $btn.parent().find(`[data-page="${num}"]`).addClass(classes.activeBtn);
          }
          if (attr !== 'prev' && attr !== 'next') {
            $activeBtn.removeClass(classes.activeBtn);
            $btn.addClass(classes.activeBtn);
            num = attr;
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
              $unsetAsset.attr('src', $unsetAsset.attr('data-asset'));
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
                  if (item[key].match(input)) {
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
        onFilterClick(e) {
          e.preventDefault();
          $filterBox.toggle();
          $resetBtn.toggleClass('drzFilter-grid-filterResetShow');
          $filterBtn.toggleClass('drzFilter-grid-filterBtnOpen');
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
      $filterBtn.click(methods.onFilterClick);
      $resetBtn.click(methods.resetFilter);
      methods.drawGrid();
      methods.buildFilters();

      $.fn.drzFilterGrid.destroy = ($el) => {
        const $emptyMsg = $el.find(`.${classes.empty}`);
        if ($emptyMsg.length) {
          $emptyMsg.remove();
        }
        $el.find('.drzFilter-grid-container').html('');
        methods.totalPages = 0;
        // TODO remove pagination stuff
        // TODO remove $search listeners
        // TODO remove filters
      };
    });

    return $filterGrid;
  };
})(jQuery);
