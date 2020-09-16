/* global jQuery */
(($) => {
  $.fn.drzLoadMore = function drzLoadMore(opts) {
    const defaults = {
      visible: 6,
      assets: 'src',
      classes: {},
    };
    const options = $.extend({}, defaults, opts);
    const $items = $(this);
    $items.each(function init() {
      const $el = $(this);
      const $itemList = $el.find(`.${options.classes.item}`);
      const $loadMore = $el.find(`.${options.classes.loadMore}`);
      const $footer = $el.find(`.${options.classes.footer}`);
      const methods = {
        shown: options.visible,
        total: $itemList.length,
        scanItems() {
          $itemList.each(function setItem() {
            const $item = $(this);
            const $itemNum = $item.index() + 1;
            if (!$item.hasClass(options.classes.show) && $itemNum <= methods.shown) {
              $item.addClass(options.classes.show);
              const $img = $item.find(`.${options.classes.img}`);
              const src = $img.attr('data-src');
              if (options.assets === 'src') {
                $img.attr('src', src);
              }
              if (options.assets === 'bg') {
                $img.css('background-image', `url('${src}')`);
              }
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
            $footer.addClass(options.classes.footerHidden);
          } else {
            methods.shown += options.visible;
            if (methods.shown >= methods.total) {
              $loadMore.hide();
              $footer.addClass(options.classes.footerHidden);
            }
          }
          methods.scanItems();
        },
      };
      methods.scanItems();
      $loadMore.click(methods.loadMore);
      $.fn.drzLoadMore.destroy = () => {
        methods.shown = options.visible;
        $loadMore.off('click', methods.loadMore);
        $footer.removeClass(options.classes.footerHidden);
        $itemList.each(function setItem() {
          const $item = $(this);
          $item.removeClass(options.classes.show);
          const $img = $item.find(`.${options.classes.img}`);
          $img.attr('src', '');
        });
      };
    });
    return this;
  };
})(jQuery);
