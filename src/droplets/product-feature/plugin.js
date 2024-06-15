/*
================================
 Drzzle Product Feature Plugin
================================
*/
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
      const step = options.overrides ? options.overrides.quantity.step : 1;
      const methods = {
        activeImage: null,
        quantity: step,
        step,
        max: false,
        directionClick: false,
        $options,
        clickThumb(e) {
          e.preventDefault();
          const $link = $(e.currentTarget);
          const $thumbImg = $link.find('.drzProduct-feature-thumbImg');
          const $img = $thumbImg.attr('src');
          methods.activeImage = $img;
          $featuredImg.attr('src', $img);
          $featuredImg.attr('alt', $thumbImg.attr('alt'));
          // fall back in case user does not hover off next / right button
          // $featuredImgContainer.css('background-image', `url(${$img})`);
          $featuredImgContainer.attr('data-active-image', $link.index());
          $link.parent().find('.drzProduct-feature-thumbImg').removeClass('drzProduct-feature-thumbActive');
          $link.find('.drzProduct-feature-thumbImg').addClass('drzProduct-feature-thumbActive');
        },
        moveNext(e) {
          e.preventDefault();
          methods.directionClick = 'next';
          const $activeIndex = parseInt($featuredImgContainer.attr('data-active-image'), 10);
          const $lastImgIndex = $thumb.length - 1;
          if ($activeIndex < $lastImgIndex) {
            $thumb.eq($activeIndex + 1).trigger('click');
          }
          methods.directionClick = false;
        },
        moveBack(e) {
          e.preventDefault();
          methods.directionClick = 'back';
          const $activeIndex = parseInt($featuredImgContainer.attr('data-active-image'), 10);
          if ($activeIndex > 0) {
            $thumb.eq($activeIndex - 1).trigger('click');
          }
          methods.directionClick = false;
        },
        zoomMove(e) {
          if (!window.matchMedia(drzzle.viewports.mobile).matches) {
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
          }
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
            if (methods.quantity <= 0) {
              methods.quantity = methods.step;
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
      // we need to disable the featured full image bg in case there are transparent images used
      $nextBtn.hover(() => {
        $featuredImgContainer.css('background-image', '');
      }, () => {
        $featuredImgContainer.css('background-image', `url(${methods.activeImage})`);
      });
      $backBtn.hover(() => {
        $featuredImgContainer.css('background-image', '');
      }, () => {
        $featuredImgContainer.css('background-image', `url(${methods.activeImage})`);
      });
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
          if (!window.matchMedia(drzzle.viewports.mobile).matches) {
            $featuredImgContainer.css('background-image', `url(${methods.activeImage})`);
          }
        }).mouseleave(() => {
          $featuredImgContainer.css('background-image', '');
        }).mousemove(methods.zoomMove);
      } else {
        $featuredImgContainer.addClass('drzProduct-feature-noHover');
      }
      // buy button events
      $buyBtn.click(methods.buyClick);
      // overrides for the step and max quantity step amounts
      if (options.overrides && options.overrides.quantity.step) {
        methods.step = options.overrides.quantity.step;
      }
      if (options.overrides && options.overrides.quantity.max) {
        methods.max = options.overrides.quantity.max;
      }
      $this.drzProductOptions();
      // destroy plugin
      $.fn.drzProductFeature.destroy = ($el) => {
        const $thumbs = $el.find('.drzProduct-feature-thumbImg');
        $thumbs.removeClass('drzProduct-feature-thumbActive');
        $featuredImg.attr('alt', '');
        $el.find('.drzProduct-feature-thumb')
          .eq(0).find('.drzProduct-feature-thumbImg')
          .addClass('drzProduct-feature-thumbActive');
        $featuredImgContainer.removeClass('drzProduct-feature-noHover');
        $featuredImgContainer.css('background-image', '');
        $featuredImgContainer.attr('data-active-image', 0);
        $featuredImgContainer.off('swipeleft');
        $featuredImgContainer.off('swiperight');
        methods.activeImage = null;
        methods.quantity = step;
        methods.step = step;
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
