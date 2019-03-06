/*
============================
 Drzzle Pagination Plugin
============================
*/
(($) => {
  $.fn.drzPagination = function drzPagination() {
    const $pagination = $(this);
    $pagination.each(function initPlugin() {
      const $this = $(this);
      const $pageItems = $this.children();
      const totalItems = $pageItems.length;
      let itemLimit = $this.attr('data-paginate-items');

      // insert pagination markup
      let paginationUl;
      let isTable = false;
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

      if (typeof itemLimit !== typeof undefined && itemLimit !== false) {
        if (itemLimit === '') {
          itemLimit = 9;
        } else {
          itemLimit = ~~(itemLimit);
        }
      } else {
        // set default item limit
        itemLimit = 9;
      }
      let item = 0;
      for (let i = 0; i < totalItems; i += itemLimit) {
        item += 1;
        if (isTable === true) {
          $pageItems.slice(i, i + itemLimit).addClass(`drzPg-page-${item}`);
        } else {
          $pageItems.slice(i, i + itemLimit).wrapAll(`<div class="drzPg-page-${item}"></div>`);
        }
        paginationUl.append(`<li class="drzPaginate-li"><a href="#" class="drzPg-link-${item} drzPaginate-link">${item}</a></li>`);
      }

      const pgLink = paginationUl.find('[class^="drzPg-link-"]');
      const pages = pgLink.length;
      let elpFirst;
      let elpLast;

      if (pages < 2) {
        if (isTable === true) {
          elpFirst = $this.parent().next('.drzPagination').hide();
        } else {
          elpFirst = $this.next('.drzPagination').hide();
        }
      }

      $this.find('[class^="drzPg-page-"]').each(function hide() {
        const i = $(this).index() + 1;
        if (pages > 11) {
          if (i > 5) {
            paginationUl.find(`.drzPg-link-${i}`).parent().hide();
          }
        }
      });
      paginationUl.find(`.drzPg-link-${pages}`).parent().show();

      // insert ellipses
      paginationUl.find('li:first-child').addClass('active');
      $('<li class="drzPagination-ellipsis-last" style="display:none;">&hellip;</li>')
        .insertBefore(paginationUl.find('li:last-child'));
      $('<li class="drzPagination-ellipsis-first" style="display:none;">&hellip;</li>')
        .insertAfter(paginationUl.find('li:first-child'));

      let index = 1;
      let thisPage;
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

      const backBtn = paginationUl.parent().find('.drzPaginate-back');
      const nextBtn = paginationUl.parent().find('.drzPaginate-next');

      // start the back button as disabled
      backBtn.attr('disabled', 'disabled');

      // update callback
      function updatePagination(inx, btn) {
        let newIndex = inx + 2;
        let oldIndex = inx - 3;
        // when clicking on page number links
        if (!btn.match(/drzPaginate-next/gi) && !btn.match(/back/gi)) {
          if (inx > 5 && inx < (pages - 4)) {
            paginationUl.find(`.drzPg-link-${inx}`).parent().siblings().hide();
            elpLast.show(); elpFirst.show();
            // basicaly create this layout: < 1... 5 6 [7] 8 9...20 >
            paginationUl.find(`.drzPg-link-1, .drzPg-link-${(inx + 1)}, .drzPg-link-${(inx + 2)},
            .drzPg-link-${(inx - 1)}, .drzPg-link-${(inx - 2)}, .drzPg-link-${pages}`).parent().show();
          }
          // to control the last group of page links: < 1...12 14 [15] 16 17 18 >
          if (inx > (pages - 5) && inx <= (pages - 2)) {
            elpLast.hide();
            paginationUl.find(`.drzPg-link-${(inx - 3)}`).parent().hide();
            paginationUl.find(`.drzPg-link-${(inx - 2)}, .drzPg-link-${(pages - 1)}, .drzPg-link-${(pages - 2)}`).parent().show();
            if (inx === (pages - 4) || inx === (pages - 3)) {
              paginationUl.find(`.drzPg-link-${(inx - 3)}, .drzPg-link-${(inx - 4)}`).parent().hide();
              paginationUl.find(`.drzPg-link-${(inx + 1)}, .drzPg-link-${(inx - 1)}`).parent().show();
            }
          }
          if (inx > (pages - 3)) {
            elpLast.hide();
            elpFirst.show();
            pgLink.parent().hide(); // hide all page links
            paginationUl.find(`.drzPg-link-1, .drzPg-link-${(pages - 4)}, .drzPg-link-${(pages - 3)},
            .drzPg-link-${(pages - 2)}, .drzPg-link-${(pages - 1)}, .drzPg-link-${pages}`).parent().show();
          }
          // if clicking very last page link
          if (inx === pages) {
            elpLast.hide();
            elpFirst.show();
            pgLink.parent().hide(); // hide all page links
            // then show last 5
            paginationUl.find(`.drzPg-link-1, .drzPg-link-${pages}, .drzPg-link-${(pages - 1)}, .drzPg-link-${(pages - 2)},
            .drzPg-link-${(pages - 3)}, .drzPg-link-${(pages - 4)}`).parent().show();
          }
          // to control first group of page links: < 1 2 3 5 [5] 6 7...18 >
          if (inx > 2 && inx < 6) { // 3-5
            elpFirst.hide();
            paginationUl.find(`.drzPg-link-${(inx + 3)}`).parent().hide();
            paginationUl.find(`.drzPg-link-${(inx + 1)}, .drzPg-link-${(inx - 1)},
            .drzPg-link-${(inx - 2)}, .drzPg-link-2`).parent().show();
            if (inx === 4 || inx === 5) {
              paginationUl.find(`.drzPg-link-${(inx + 2)}`).parent().show();
              paginationUl.find(`.drzPg-link-${(inx + 4)}`).parent().hide();
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
            paginationUl.find(`.drzPg-link-1, .drzPg-link-2, .drzPg-link-3, .drzPg-link-4, .drzPg-link-5, .drzPg-link-${pages}`)
              .parent().show();
          }
        }
        if (btn.match(/drzPaginate-next/gi)) {
          // update newer buttons
          if (inx >= 4 && inx < (pages - 2)) {
            paginationUl.find(`.drzPg-link-${newIndex}`).parent().show();
            if (inx >= (pages - 4)) {
              elpLast.hide();
              paginationUl.find(`.drzPg-link-${(pages - 1)}`).parent().show();
            }
          }
          // update older buttons
          if (inx > 5 && inx < (pages - 1)) {
            elpFirst.show();
            paginationUl.find(`.drzPg-link-${oldIndex}`).parent().hide();
            paginationUl.find(`.drzPg-link-${2}`).parent().hide();
          }
        }
        if (btn.match(/back/gi)) {
          if (inx > 5 && inx < (pages - 2)) {
            newIndex += 1;
            oldIndex += 1;
            paginationUl.find(`.drzPg-link-${oldIndex}`).parent().show();
            paginationUl.find(`.drzPg-link-${newIndex}`).parent().hide();
            paginationUl.find(`.drzPg-link-${pages}`).parent().show(); // always show last page btn
            if (inx === (pages - 4)) {
              paginationUl.find(`.drzPg-link-${(pages - 1)}`).parent().show();
            }
            if (inx === (pages - 5)) {
              paginationUl.find(`.drzPg-link-${(pages - 1)}`).parent().hide();
              elpLast.show();
            }
          } else if (inx <= 5) { // when you navigate back into the lower numbers again
            paginationUl.find(`.drzPg-link-${2}, .drzPg-link-${3}`).parent().show();
            elpFirst.hide();
            if (inx <= 5 && inx >= 3) {
              paginationUl.find(`.drzPg-link-${(newIndex + 1)}`).parent().hide();
            }
          }
        }
      }

      pgLink.click(function clickLink(e) {
        e.preventDefault();
        const el = $(this);
        el.parent().addClass('active').siblings().removeClass('active');
        index = ~~(el.attr('class').split('-')[2]);
        if (pages > 11) {
          updatePagination(index, el.attr('class'));
        }
        // make the clicked page link page visible
        thisPage = $this.find(`.drzPg-page-${index}`);
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
        const el = $(this);
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
        thisPage = $this.find(`.drzPg-page-${index}`);
        if (isTable === true) {
          thisPage.siblings().removeClass('show-tr').addClass('hide');
          thisPage.removeClass('hide').addClass('show-tr');
        } else if (!thisPage.is(':visible')) {
          thisPage.show().siblings().hide();
        }
        paginationUl.find(`.drzPg-link-${index}`)
          .parent()
          .addClass('active')
          .siblings()
          .removeClass('active');

        if (nextBtn.is('[disabled]')) {
          nextBtn.removeAttr('disabled');
        }
      });
      nextBtn.click(function nextClick(e) {
        e.preventDefault();
        const el = $(this);
        index += 1;
        if (pages > 11) {
          updatePagination(index, el.attr('class'));
        }
        if (index > pages) {
          index = pages;
        } else if (index === pages) {
          el.attr('disabled', 'disabled');
        }
        paginationUl.find(`.drzPg-link-${index}`)
          .parent()
          .addClass('active')
          .siblings()
          .removeClass('active');

        // make the next page visible
        thisPage = $this.find(`.drzPg-page-${index}`);
        if (isTable === true) {
          thisPage.siblings()
            .removeClass('show-tr')
            .addClass('hide');
          thisPage.removeClass('hide')
            .addClass('show-tr');
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
