/* global jQuery */
(($) => {
  $.fn.flux.responsiveTable = function responsiveTable(opts) {
    const defaults = { el: null };
    const options = $.extend({}, defaults, opts);
    const $table = options.el;

    $table.each(function eachTable() {
      const $el = $(this);
      const $cellTitle = $el.find('.productTable-name');
      // place table head titles into each cell as labels
      $el.find('tbody tr td').each(function eachTd() {
        const $index = $(this).index();
        $(this).prepend(`<strong class="productTable-mobileTitle">${$cellTitle.eq($index).html()}</strong>`);
      });
    });

    return $table;
  };
})(jQuery);
