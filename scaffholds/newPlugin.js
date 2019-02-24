/* global jQuery */
(($) => {
  $.fn.picazzo.dropletName = function dropletName(opts) {
    const defaults = { el: null };
    const options = $.extend({}, defaults, opts);
    const $dropletName = options.el;

    // your code here

    return $dropletName;
  };
})(jQuery);
