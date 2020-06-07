/* global jQuery */
(($) => {
  $.fn.drzProductFeature = function productFeature(params) {
    const $productFeature = $(this);
    const options = params || {};
    $productFeature.each(function initProductFeature() {
      const $this = $(this);
      const $featuredImgContainer = $this.find('.drzProduct-feature-imageContainer');
      const $featuredImg = $featuredImgContainer.find('.drzProduct-feature-image');
      const $thumb = $this.find('.drzProduct-feature-thumb');
      const $nextBtn = $featuredImgContainer.find('.drzProduct-feature-imageNext');
      const $backBtn = $featuredImgContainer.find('.drzProduct-feature-imageBack');
      const $buyBtn = $this.find('.drzProduct-feature-buyBtn');
      const $options = $this.find('.drzProduct-feature-optionsWrap select');
      const $removeBtn = $this.find('.drzProduct-feature-remove');
      const $addBtn = $this.find('.drzProduct-feature-add');
      const $count = $this.find('.drzProduct-feature-count');
      const shouldZoom = $this.attr('data-image-zoom');
      const methods = {
        activeImage: null,
        quantity: 1,
        step: 1,
        max: false,
        $options,
        clickThumb(e) {
          e.preventDefault();
          const $link = $(e.currentTarget);
          const $img = $link.find('.drzProduct-feature-thumbImg').attr('src');
          methods.activeImage = $img;
          $featuredImg.attr('src', $img);
          // fall back in case user does not hover off next / right button
          $featuredImgContainer.css('background-image', `url(${$img})`);
          $featuredImgContainer.attr('data-active-image', $link.index());
          $link.parent().find('.drzProduct-feature-thumbImg').removeClass('drzProduct-feature-thumbActive');
          $link.find('.drzProduct-feature-thumbImg').addClass('drzProduct-feature-thumbActive');
        },
        moveNext(e) {
          e.preventDefault();
          const $activeIndex = parseInt($featuredImgContainer.attr('data-active-image'), 10);
          const $lastImgIndex = $thumb.length - 1;
          if ($activeIndex < $lastImgIndex) {
            $thumb.eq($activeIndex + 1).trigger('click');
          }
        },
        moveBack(e) {
          e.preventDefault();
          const $activeIndex = parseInt($featuredImgContainer.attr('data-active-image'), 10);
          if ($activeIndex > 0) {
            $thumb.eq($activeIndex - 1).trigger('click');
          }
        },
        zoomMove(e) {
          const zoomer = $(e.currentTarget);
          if (e.target.tagName === 'A') {
            zoomer.css('background-position', '');
            return;
          }
          if (e.type !== 'mousemove') {
            return;
          }
          const x = (e.offsetX / zoomer.outerWidth()) * 100;
          const y = (e.offsetY / zoomer.outerHeight()) * 100;
          zoomer.css('background-position', `${x}% ${y}%`);
        },
        updateQuantity(e) {
          const $btn = $(e.currentTarget);
          if ($btn.hasClass('drzProduct-feature-add')) {
            const max = methods.max;
            if (max && (methods.quantity + methods.step) > methods.max) {
              methods.quantity = methods.max;
            } else {
              methods.quantity += methods.step;
            }
          }
          if ($btn.hasClass('drzProduct-feature-remove') && methods.quantity > 1) {
            methods.quantity -= methods.step;
            if (methods.quantity < 0) {
              methods.quantity = 0;
            }
          }
          $count.text(methods.quantity);
        },
        buyClick(e) {
          e.preventDefault();
          if (options.onCartAdd) {
            options.onCartAdd(methods);
          }
        },
      };

      methods.activeImage = $featuredImg.attr('src');
      $count.text(methods.quantity);

      $thumb.click(methods.clickThumb);
      $nextBtn.click(methods.moveNext).hover(() => {
        $featuredImg.css('opacity', 1);
      }, () => { $featuredImg.css('opacity', ''); });
      $backBtn.click(methods.moveBack).hover(() => {
        $featuredImg.css('opacity', 1);
      }, () => { $featuredImg.css('opacity', ''); });
      // mobile swipe events for next/back methods
      $featuredImgContainer.on('swipeleft', methods.moveNext);
      $featuredImgContainer.on('swiperight', methods.moveBack);
      // quantity button events
      $addBtn.click(methods.updateQuantity);
      $removeBtn.click(methods.updateQuantity);
      // optional zoom events
      if (shouldZoom === 'true') {
        $featuredImgContainer.mouseenter(() => {
          $featuredImgContainer.css('background-image', `url(${methods.activeImage})`);
        }).mouseleave(() => {
          $featuredImgContainer.css('background-image', '');
        }).mousemove(methods.zoomMove);
      } else {
        $featuredImgContainer.addClass('drzProduct-feature-noHover');
      }
      // buy button events
      if (!window.__editor) {
        $buyBtn.click(methods.buyClick);
      }
      // overrides for the step and max quantity step amounts
      if (options.overrides && options.overrides.quantity.step) {
        methods.step = options.overrides.quantity.step;
      }
      if (options.overrides && options.overrides.quantity.max) {
        methods.max = options.overrides.quantity.max;
      }
      // destroy plugin
      $.fn.drzProductFeature.destroy = ($el) => {
        $el.find('.drzProduct-feature-thumbImg').removeClass('drzProduct-feature-thumbActive');
        $featuredImgContainer.removeClass('drzProduct-feature-noHover');
        $featuredImgContainer.css('background-image', '');
        $featuredImgContainer.attr('data-active-image', 0);
        $featuredImgContainer.off('swipeleft');
        $featuredImgContainer.off('swiperight');
        methods.activeImage = null;
        methods.quantity = 1;
        methods.step = 1;
        methods.max = false;
        $thumb.off('click');
        $nextBtn.off('click');
        $nextBtn.off('hover');
        $backBtn.off('click');
        $backBtn.off('hover');
        $addBtn.off('click');
        $removeBtn.off('click');
        $buyBtn.off('click');
        if (shouldZoom === 'true') {
          $featuredImgContainer.off('mouseenter');
          $featuredImgContainer.off('mouseleave');
          $featuredImgContainer.off('mousemove');
        }
      };
    });
    return this;
  };
})(jQuery);
