'use strict';

/* global $ */
$.fn.flux = {
  viewports: {
    xs: '',
    sm: '',
    md: '',
    lrg: '',
    xl: ''
  }
};

/* global jQuery */
(function ($) {
  $.fn.flux.responsiveTable = function responsiveTable(opts) {
    var defaults = { el: null };
    var options = $.extend({}, defaults, opts);
    var $table = options.el;

    $table.each(function eachTable() {
      var $el = $(this);
      var $cellTitle = $el.find('.productTable-name');
      // place table head titles into each cell as labels
      $el.find('tbody tr td').each(function eachTd() {
        var $index = $(this).index();
        $(this).prepend('<strong class="productTable-mobileTitle">' + $cellTitle.eq($index).html() + '</strong>');
      });
    });

    return $table;
  };
})(jQuery);