/* global jQuery */
(($) => {
  $.fn.flux.responsiveTable = function responsiveTable(opts) {
    const defaults = { el: null };
    const options = $.extend({}, defaults, opts);
    // finish plugin here
    console.log(options);
    return $;
  };
})(jQuery);
