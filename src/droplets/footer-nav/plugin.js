/*
============================
 Drzzle Footer Nav Plugin
============================
*/
(($) => {
  $.fn.drzFooterNav = function drzFooterNav() {
    const $topLink = $(this).find('.drzFooterNav-list-topLink');

    $topLink.click((e) => {
      const $this = $(e.currentTarget);
      if (window.matchMedia(drzzle.viewports.mobile).matches) {
        e.preventDefault();
        // if there us even a dropdown menu
        if ($this.next('ul').length) {
          $this.next('ul').slideToggle(200);
          $this.parent().siblings().find('.drzFooterNav-list-subList').slideUp(200);
        }
      }
    });

    // show links callback
    function linkDisplays() {
      if (window.matchMedia(drzzle.viewports.desktop).matches ||
          window.matchMedia(drzzle.viewports.tablet).matches) {
        $topLink.next('ul').show();
      } else if (window.matchMedia(drzzle.viewports.mobile).matches) {
        $topLink.next('ul').hide();
      }
    }

    let resizeTimer;
    drzzle.window.resize(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(linkDisplays, 250);
    });

    $.fn.drzFooterNav.destroy = ($el) => {
      // grab attached selectors and remove attached listeners
      $el.find('.drzFooterNav-list-topLink').off('click');
    };

    return this;
  };
})(jQuery);
