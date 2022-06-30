/* global jQuery */
(($) => {
  $.fn.drzTextSwapper = function drzTextSwapper() {
    const $swapper = $(this);
    $swapper.each(function initTextSwapper() {
      const $el = $(this);
      const methods = {
        init() {
          const $groups = $el.find('.drzText-swapper-group');
          $groups.each(function initSwapgroup() {
            const $group = $(this);
            const effect = methods.attr({ attr: $group.attr('data-swapper-effect') });
            if (effect) {
              methods.attachAnimations({ $group, effect });
            }
          });
        },
        intervals: {},
        actives: {},
        attachAnimations({ $group, effect }) {
          const speed = methods.attr({ attr: $group.attr('data-swapper-pause'), fallback: 3000 });
          const dur = methods.attr({ attr: $group.attr('data-swapper-duration'), fallback: 500 });
          const center = methods.attr({ attr: $group.attr('data-swapper-center') });
          if (center) {
            $group.addClass('drzText-swapper-center');
          }
          const index = $group.index();
          methods.actives[index] = 0;
          const $first = $group.children(':first');
          $first.addClass(`drzTextSwapper-${effect}`);
          $first.siblings().each(function setSiblings() {
            if (!center) {
              $(this).css({ position: 'absolute' });
            }
          });
          $group.children().css({
            transition: `opacity ${dur}ms, transform ${dur}ms`,
          });
          const lines = $group.children().length;
          methods.intervals[index] = setInterval(() => {
            const next = methods.actives[index] + 1;
            if (next > lines - 1) {
              methods.actives[index] = 0;
            } else {
              methods.actives[index] = next;
            }
            const $target = $group.children().eq(methods.actives[index]);
            $target.addClass(`drzTextSwapper-${effect}`).css({ position: '' });
            const $siblings = $target.siblings();
            $siblings.removeClass(`drzTextSwapper-${effect}`);
            if (!center) {
              $siblings.css({ position: 'absolute' });
            }
          }, parseInt(speed, 10));
        },
        attr({ attr, fallback }) {
          return (typeof attr !== 'undefined' && attr !== false) ? attr : fallback;
        },
      };
      methods.init();
      $.fn.drzTextSwapper.destroy = ($droplet, callback = () => {}) => {
        $.each(methods.intervals, (i, item) => {
          clearTimeout(item);
        });
        const $groups = $droplet.find('.drzText-swapper-group');
        $groups.each(function destroySwapgroup() {
          const $group = $(this);
          $group.removeClass('drzText-swapper-center');
          const effect = methods.attr({ attr: $group.attr('data-swapper-effect') });
          if (effect) {
            $group.children().each(function destroyGroupItem() {
              const $child = $(this);
              $child.attr('style', '').removeClass(`drzTextSwapper-${effect}`);
            });
          }
        });
        return callback();
      };
    });
    return this;
  };
})(jQuery);
