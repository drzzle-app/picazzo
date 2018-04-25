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
    // finish plugin here
    console.log(options);
    return $;
  };
})(jQuery);