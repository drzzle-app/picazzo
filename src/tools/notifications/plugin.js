/*
===============================
 Drzzle Notifications Plugin
===============================
*/
(($) => {
  $.fn.drzNotify = function drzNotify() {
    const $notification = $(this);
    $notification.each(function initNotify() {
      const $this = $(this);
      const $dismissBtn = $this.find('.drzNotification-close');
      let shown = false;

      // callback to check if notification is in view of user
      function inView($el) {
        const $docViewTop = drzzle.window.scrollTop();
        const $docViewBottom = $docViewTop + drzzle.window.height();
        const $elTop = $el.offset().top;
        const $elBottom = $elTop + $el.height();

        if (($elBottom <= $docViewBottom) && ($elTop >= $docViewTop) && !shown) {
          shown = true;
          $this.animate({
            opacity: 1,
            marginLeft: 0,
          }, 600);
        }
      }

      drzzle.window.on('scroll', () => {
        inView($this);
      });

      inView($this);

      $dismissBtn.click((e) => {
        e.preventDefault();
        $this.animate({
          opacity: 0,
        }, 200);

        setTimeout(() => {
          $this.remove();
        }, 200);
      });
    });
    return this;
  };
})(jQuery);
