/*
============================
 Drzzle Accordian Plugin
============================
*/
(($) => {
  $.fn.drzAccordion = function drzAccordion(params) {
    const $accordion = $(this);
    const titleClass = '.drzAccordion-section-title';
    const activeClass = 'active-accordion';
    const contentClass = '.drzAccordion-section-content';
    function collapseSection() {
      const $active = $accordion.find(`.${activeClass}`);
      $active.removeClass(activeClass);
      $active.next(contentClass).slideUp(150);
    }
    $accordion.find(titleClass).click(function setActive(e) {
      e.preventDefault();
      const $this = $(this);
      const $acc = $this.parent().parent();
      if ($this.is(`.${activeClass}`)) {
        collapseSection($acc);
      } else {
        collapseSection($acc);
        $this.addClass(activeClass);
        $this.next(contentClass).slideDown(150);
      }
    });

    if (params && params.search) {
      const searchBar = $accordion.find('.drzAccordion-bar');
      if (!searchBar.length) {
        const $bar = $(`<div class="drzFilter-grid-bar">
            <form role="search" class="drzFilter-grid-searchBox">
              <input class="drzFilter-grid-searchInput" name="search accordion" type="text" placeholder="Search..." />
            </form>
          </div>`);
        const $empty = $('<span class="drzFilter-grid-empty">No Items Found</span>');
        $accordion.prepend($bar);
        $accordion.append($empty);
        const $input = $bar.find('.drzFilter-grid-searchInput');
        const $sections = $accordion.find('.drzAccordion-section');
        let resizeTimer;
        $input.on('input', (e) => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            const text = new RegExp(e.target.value, 'gi');
            $sections.each(function search() {
              const $section = $(this);
              const $content = $section.text();
              if ($content.match(text)) {
                $section.show();
              } else {
                $section.hide();
              }
            });
            const empties = $accordion.find('.drzAccordion-section[style="display: none;"]');
            if (empties.length === $sections.length) {
              $accordion.addClass('drzAccordion-none');
            } else {
              $accordion.removeClass('drzAccordion-none');
            }
          }, 350);
        });
      }
    }

    $.fn.drzAccordion.killEvents = ($el) => {
      // grab attached selectors and remove attached listeners
      $el.find(titleClass).off('click');
    };
    return this;
  };
})(jQuery);
