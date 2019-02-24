/*
============================
 Drzzle Accordian Plugin
============================
*/
(($) => {
  $.fn.drzAccordion = function drzAccordion() {
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

    $.fn.drzAccordion.killEvents = ($el) => {
      // grab attached selectors and remove attached listeners
      $el.find(titleClass).off('click');
    };
    return this;
  };
})(jQuery);
