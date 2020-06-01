/* Back To Top Scrolling
* ======================= */
(($) => {
  $.fn.drzTopScroll = function topScroll() {
    const $this = $(this);
    drzzle.window.scroll(() => {
      const passedCheck = $this.offset().top > 500;
      if (passedCheck && !$this.is(':visible')) {
        $this.fadeIn();
      } else if (!passedCheck && $this.is(':visible')) {
        $this.fadeOut();
      }
    });
    $this.click((e) => {
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
      if (this.hash !== '#/cart') {
        const name = $(this.hash).selector.split('#')[1];
        const $el = $(`[data-anchor-scroll="${name}"]`);
        if (typeof $el.offset() !== typeof undefined && $el.offset() !== false) {
          e.preventDefault();
          $('html, body').animate({ scrollTop: $el.offset().top }, 500);
        }
      }
    };
    $this.find('a').click(scrollTo);
    $.fn.drzAnchorScroll.destroy = ($el) => {
      $el.find('a').off('click', scrollTo);
    };
    return this;
  };
})(jQuery);
