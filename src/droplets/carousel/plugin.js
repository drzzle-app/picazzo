/*
============================
 Drzzle Carousel Plugin
============================
*/
(($) => {
  $.fn.drzCarousel = function drzCarousel() {
    const $carousel = $(this);
    $carousel.each(function initCarousel() {
      const $this = $(this);
      const $fullSlider = $this.find('.drzCarousel-content');
      const totalImages = $fullSlider.find('.drzCarousel-content-item').length;
      const $visibleOption = $this.attr('data-carousel-visible');
      let $delayOption = $this.attr('data-carousel-delay');
      let $controlsOption = $this.attr('data-carousel-controls');
      let newContainerWidth = 0;
      let thisImg = 0;
      let newMargin = 0;
      let visibleNum;
      let interval;
      let viewContainerWidth;
      let fullSliderWidth;
      let currentMargin;

      if (typeof $delayOption !== typeof undefined && $delayOption !== false) {
        if ($delayOption === '') {
          $delayOption = 2 * 1000;
        } else {
          $delayOption = ~~($delayOption) * 1000;
        }
      } else {
      // set default delay
        $delayOption = 2 * 1000;
      }

      if (typeof $controlsOption !== typeof undefined && $controlsOption !== false) {
        if ($controlsOption === '') {
          $controlsOption = 'show';
        }
      } else {
      // set default controls option
        $controlsOption = 'show';
      }

      if ($controlsOption.match(/hide/gi)) {
        $this.find('.drzCarousel-left-button').hide();
        $this.find('.drzCarousel-right-button').hide();
        $this.find('.drzCarousel-image-container').css('width', '100%');
      }

      function setWidths() {
        if (window.matchMedia(drzzle.viewports.mobile).matches) {
          visibleNum = 1;
        } else if (typeof $visibleOption !== typeof undefined && $visibleOption !== false) {
          if ($visibleOption === '') {
            visibleNum = 4;
          } else {
            visibleNum = ~~($visibleOption);
          }
        } else {
          visibleNum = 4;
        }
        viewContainerWidth = $this.find('.drzCarousel-image-container').outerWidth();
        newContainerWidth = 0;
        $this.find('.drzCarousel-content .drzCarousel-content-item').each(function setWidth() {
          const w = (viewContainerWidth / visibleNum).toFixed(0);
          $(this).find('img').css('width', w);
          newContainerWidth += ~~($(this).outerWidth());
        });
        $fullSlider.css('width', newContainerWidth);
        thisImg = 0;
        newMargin = 0;
        fullSliderWidth = $fullSlider.outerWidth();
        currentMargin = $this.find('.drzCarousel-content .drzCarousel-content-item').eq(thisImg).outerWidth();
        $fullSlider.css({ marginLeft: newMargin });
      }

      let backMargin;
      let forwardMargin;
      // next and back animation speeds slightly faster
      const nbSpeed = 150;

      function moveNext() {
        clearInterval(interval);
        forwardMargin = newMargin += viewContainerWidth;
        // if you reach the end of slider
        if (forwardMargin >= (fullSliderWidth - viewContainerWidth)) {
          forwardMargin = (fullSliderWidth - viewContainerWidth);
          thisImg = totalImages - (visibleNum);
          $fullSlider.animate({ marginLeft: -(forwardMargin) }, nbSpeed);
        } else {
          // if not at end of slider
          // add to the img index number
          thisImg = thisImg += (visibleNum);
          $fullSlider.animate({ marginLeft: -(forwardMargin) }, nbSpeed);
        }
        newMargin = forwardMargin;
      }

      function moveBack() {
        clearInterval(interval);
        backMargin = newMargin -= viewContainerWidth;
        if (backMargin <= 0 || backMargin < ~~(currentMargin)) {
          backMargin = 0;
          thisImg = 0;
          $fullSlider.animate({ marginLeft: -(backMargin) }, nbSpeed);
        } else {
          // reset img index number
          thisImg -= visibleNum;
          $fullSlider.animate({ marginLeft: -(backMargin) }, nbSpeed);
        }
        newMargin = backMargin;
      }

      function pushLeft() {
        clearInterval(interval);
        interval = setInterval(() => {
          newMargin += currentMargin;
          if (newMargin > newContainerWidth) {
            newMargin = 0;
          }
          if (thisImg === totalImages - (visibleNum)) {
            newMargin = 0;
          }
          $fullSlider.animate({ marginLeft: -(newMargin) });
          thisImg += 1;
          if (thisImg > totalImages - (visibleNum)) {
            thisImg = 0;
          }
        }, $delayOption);
      }

      // init functions
      $this.find('.drzCarousel-left-button').click(moveBack);
      $this.find('.drzCarousel-right-button').click(moveNext);

      // for touch swiping (leaving available for all Viewports)
      $this.on('swipeleft', moveNext);
      $this.on('swiperight', moveBack);

      let resizeTimer;
      const resizeCarousel = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setWidths, 250);
      };
      drzzle.window.resize(resizeCarousel);
      setWidths();
      pushLeft();
      $this.mouseover(() => {
        clearInterval(interval);
      }).mouseout(pushLeft);

      // destroy plugin
      $.fn.drzCarousel.destroy = ($el) => {
        clearInterval(interval);
        $el.off('swipeleft, swiperight, mouseover, mouseout');
        // off resize
        drzzle.window.off('resize', resizeCarousel);
        $el.find('.drzCarousel-left-button').removeAttr('style').off('click');
        $el.find('.drzCarousel-right-button').removeAttr('style').off('click');
        $el.find('.drzCarousel-image-container').removeAttr('style');
        // remove added inline styling
        $el.find('.drzCarousel-content').stop().removeAttr('style');
        $el.find('.drzCarousel-content-item').each(function rmvInlines() {
          $(this).find('img').removeAttr('style');
        });
      };
    });
    return this;
  };
})(jQuery);
