/* global jQuery */
(($) => {
  $.fn.drzBlogList = function drzBlogList(opts) {
    const defaults = {
      visible: 6,
    };
    const options = $.extend({}, defaults, opts);
    const $blogList = $(this);
    $blogList.each(function init() {
      const $el = $(this);
      const $blogItems = $el.find('.drzBlog-item');
      const $loadMore = $el.find('.drzBlog-list-more');
      const $footer = $el.find('.drzBlog-list-footer');
      const methods = {
        shown: options.visible,
        total: $blogItems.length,
        scanBlogs() {
          $blogItems.each(function setItem() {
            const $item = $(this);
            const $itemNum = $item.index() + 1;
            if (!$item.hasClass('drzBlog-item-show') && $itemNum <= methods.shown) {
              $item.addClass('drzBlog-item-show');
              const $img = $item.find('.drzBlog-item-img');
              const src = $img.attr('data-src');
              $img.attr('src', src);
            }
          });
        },
        loadMore(e) {
          e.preventDefault();
          if (methods.shown >= methods.total) {
            return;
          }
          if (methods.shown + options.visible > methods.total) {
            methods.shown = methods.total;
            $loadMore.hide();
            $footer.addClass('drzBlog-list-footerHidden');
          } else {
            methods.shown += options.visible;
            if (methods.shown >= methods.total) {
              $loadMore.hide();
              $footer.addClass('drzBlog-list-footerHidden');
            }
          }
          methods.scanBlogs();
        },
      };
      methods.scanBlogs();
      $loadMore.click(methods.loadMore);
      $.fn.drzBlogList.destroy = () => {
        methods.shown = options.visible;
        $loadMore.off('click', methods.loadMore);
        $footer.removeClass('drzBlog-list-footerHidden');
        $blogItems.each(function setItem() {
          const $item = $(this);
          $item.removeClass('drzBlog-item-show');
          const $img = $item.find('.drzBlog-item-img');
          $img.attr('src', '');
        });
      };
    });
    return this;
  };
})(jQuery);
