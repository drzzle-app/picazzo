/* global jQuery */
(($) => {
  $.fn.flux.patternName = function patternName(opts) {
    const defaults = { el: null };
    const options = $.extend({}, defaults, opts);
    const $patternName = options.el;

    // your code here

    return $patternName;
  };
})(jQuery);
