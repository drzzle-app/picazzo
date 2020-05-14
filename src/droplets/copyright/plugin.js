(($) => {
  $.fn.drzCopyright = function drzCopyright() {
    const $droplet = $(this);
    const $year = $droplet.find('.drzCopyright-year');
    $year.html(new Date().getFullYear());
    return this;
  };
})(jQuery);
