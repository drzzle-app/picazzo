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
  $.fn.flux.responsiveTable = function responsiveTable() {
    console.log(this);
    return $;
  };
})(jQuery);