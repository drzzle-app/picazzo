/*
================================
 Drzzle Content Slider Plugin
================================
*/
(($) => {
  $.fn.drzContentSlider = function contentSlider() {
    const $contentSlider = $(this);
    $contentSlider.each(function initSlider() {
      // slider options
      let $slideDelay = $(this).attr('data-slider-delay');
      if (typeof $slideDelay !== typeof undefined && $slideDelay !== false) {
        if ($slideDelay === '') {
          $slideDelay = 4000;
        }
        if ($slideDelay.match(/none/gi)) {
          $slideDelay = false;
        } else {
          $slideDelay = ~~($slideDelay) * 1000;
        }
      } else {
        $slideDelay = 4000;
      }

      const $this = $(this);
      const totalImages = $this.find('.drzContentSlider-item').length;
      const animation = {
        complete: true,
      };
      let interval;

      $this.append('<div class="drzContentSlider-bullets"></div>');

      $this.find('.drzContentSlider-item').each(function makeLegend() {
        const $img = $(this);
        $img.addClass(`item-${$img.index()}`);
        $img.parent().find('.drzContentSlider-bullets')
          .append(`<a href="#" class="drzContentSlider-bullet b-${$img.index()}"></a>`);
      });

      // set next / back buttons if no bullets
      $this.append('<a class="drzContentSlider-next-btn"></a>');
      $this.append('<a class="drzContentSlider-back-btn"></a>');

      // show / hide controls according to options;
      const $controlOption = $this.attr('data-slider-controls');
      if (typeof $controlOption !== typeof undefined && $controlOption !== false) {
        if ($controlOption.match(/hide/gi)) {
          $this.find('.drzContentSlider-next-btn, .drzContentSlider-back-btn').hide();
        }
      }

      // set both 1st bullet and 1st image active
      $this.find('.drzContentSlider-item:first-child').show().css('opacity', '1');
      $this.find('.drzContentSlider-bullet:first-child').addClass('active');

      // style bullets according to options
      const $bullets = $this.find('.drzContentSlider-bullets');
      const $bulletOption = $this.attr('data-slider-bullets');
      if (typeof $bulletOption !== typeof undefined && $bulletOption !== false) {
        if ($bulletOption.match(/right/gi) || $bulletOption.match(/left/gi)) {
          if ($bulletOption.match(/right/gi)) {
            $bullets.addClass('drzContentSlider-bullets-right');
          }
          if ($bulletOption.match(/left/gi)) {
            $bullets.addClass('drzContentSlider-bullets-left');
          }
          // if bullets are left or right, vertically center them
          $bullets.css('marginTop', -($bullets.outerHeight() / 2));
        }
        if ($bulletOption.match(/bottom/gi)) {
          $bullets.addClass('drzContentSlider-bullets-bottom');
        }
        if ($bulletOption.match(/hide/gi)) {
          $bullets.addClass('drzContentSlider-bullets-hide');
        }
      } else {
        // default bullets position
        $bullets.addClass('drzContentSlider-bullets-bottom');
      }

      let effect;
      let $effectOption = $this.attr('data-slider-effect');
      if (typeof $effectOption !== typeof undefined && $effectOption !== false) {
        if ($effectOption === '') {
          $effectOption = 'slide';
        }
      } else {
        $effectOption = 'slide';
      }

      const isSlide = $effectOption.match(/slide/gi);
      const isFade = $effectOption.match(/fade/gi);

      let $sliderWidth = ~~($this.outerWidth());
      if (isSlide) {
        effect = { marginLeft: -($sliderWidth) };
        $this.find('.drzContentSlider-item').each(function setOpacity() {
          $(this).css('opacity', 1);
        });
      } else if (isFade) {
        effect = { opacity: 0 };
      }

      const animateSpeed = 400;
      const fadeBack = { opacity: 1 };
      let imgNum = 0;

      let hideTO;
      function hideDelay(e) {
        hideTO = setTimeout(() => {
          e.hide();
          if (isFade) {
            e.css('opacity', 0);
          }
        }, animateSpeed * 2);
      }

      function showDelay(e) {
        e.show();
        if (isFade) {
          e.animate(fadeBack, animateSpeed, () => {
            animation.complete = true;
          });
        }
      }

      // call back for resizing slider
      let resizeTimer;
      const resizeContentSlider = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          $sliderWidth = ~~($this.outerWidth());
          effect = { marginLeft: -($sliderWidth) };
        }, 250);
      };

      function next($element) {
        if (!animation.complete) {
          return;
        }
        animation.complete = false;
        // if slide option, recalculate container width on resize
        const $currentSlide = $element.find(`.drzContentSlider-item.item-${imgNum}`);
        if (isSlide) {
          drzzle.window.resize(resizeContentSlider);
          $currentSlide.animate(effect, animateSpeed);
        }
        hideDelay($currentSlide);
        imgNum += 1;
        if (imgNum > totalImages - (1)) {
          imgNum = 0;
          const $lastSlide = $element.find(`.drzContentSlider-item.item-${totalImages - (1)}`);
          if (isSlide) {
            $element.find(`.drzContentSlider-item.item-${imgNum}`)
              .show()
              .css('margin-left', $sliderWidth);
            $element.find(`.drzContentSlider-item.item-${imgNum}`)
              .animate({ marginLeft: 0 }, animateSpeed);
          }
          const speed = isFade ? animateSpeed * 2 : animateSpeed;
          $lastSlide.animate(effect, speed);
          hideDelay($lastSlide);
        }
        const $nextSlide = $element.find(`.drzContentSlider-item.item-${imgNum}`);
        if (isSlide) {
          $nextSlide.show()
            .css('margin-left', $sliderWidth)
            .animate({ marginLeft: 0 }, animateSpeed, () => {
              animation.complete = true;
            });
        } else if (isFade) {
          showDelay($nextSlide);
        }
        $element.find(`.drzContentSlider-bullet.b-${imgNum}`)
          .addClass('active')
          .siblings()
          .removeClass('active');
      }

      function back($element) {
        if (!animation.complete) {
          return;
        }
        animation.complete = false;
        const $currentSlide = $element.find(`.drzContentSlider-item.item-${imgNum}`);
        if (isSlide) {
          $currentSlide.animate({ marginLeft: $sliderWidth }, animateSpeed);
        } else if (isFade) {
          $currentSlide.animate(effect, animateSpeed * 2);
        }
        hideDelay($currentSlide);
        imgNum -= 1;
        // if at the beginning reset to last slide
        if (imgNum < 0) {
          imgNum = totalImages - (1);
        }
        // If at the end reset to 1st slide
        if (imgNum > totalImages - (1)) {
          imgNum = 0;
          const $lastSlide = $element.find(`.drzContentSlider-item.item-${totalImages - (1)}`);
          if (isSlide) {
            $lastSlide.css('margin-left', -($sliderWidth));
            $lastSlide.animate({ marginLeft: 0 }, animateSpeed);
          } else if (isFade) {
            $lastSlide.animate(effect, animateSpeed * 2);
          }
          hideDelay($lastSlide);
        }
        const $previousSlide = $element.find(`.drzContentSlider-item.item-${imgNum}`);
        if (isSlide) {
          $previousSlide.show()
            .css('margin-left', -($sliderWidth))
            .animate({ marginLeft: 0 }, animateSpeed, () => {
              animation.complete = true;
            });
        } else if (isFade) {
          showDelay($previousSlide);
        }
        $element.find(`.drzContentSlider-bullet.b-${imgNum}`)
          .addClass('active')
          .siblings()
          .removeClass('active');
      }

      function moveNext(el) {
        clearInterval(interval);
        if ($.isNumeric($slideDelay)) {
          interval = setInterval(() => {
            next(el);
          }, $slideDelay);
        }
      }

      // change slide via next button
      $this.find('.drzContentSlider-next-btn').click(() => {
        next($this);
      });

      // change slide via back button
      $this.find('.drzContentSlider-back-btn').click(() => {
        back($this);
      });

      // for touch swiping
      $this.on('swipeleft', () => {
        next($this);
      });

      $this.on('swiperight', () => {
        back($this);
      });

      // change slide via bullets then reset interval
      $this.find('.drzContentSlider-bullet').click(function clickBullet(e) {
        e.preventDefault();
        const $el = $(this);
        const $bulletNum = $el.index();
        $el.addClass('active').siblings().removeClass('active');
        if (isSlide) {
          $this.find(`.drzContentSlider-item.item-${$bulletNum}`)
            .show()
            .css('margin-left', 0).siblings('.drzContentSlider-item')
            .hide();
        } else if (isFade) {
          $this.find(`.drzContentSlider-item.item-${$bulletNum}`)
            .show()
            .css('opacity', 1).siblings('.drzContentSlider-item')
            .hide()
            .css('opacity', 0);
        }
        imgNum = $bulletNum;
        moveNext($this);
      });

      // pause slider if hovered over slider
      $this.mouseover(() => {
        clearInterval(interval);
      });
      // continue slider if hovered off
      $this.mouseleave(() => {
        moveNext($this);
      });

      // init the auto sliding
      moveNext($this);

      // Destroy plugin method
      $.fn.drzContentSlider.destroy = ($el) => {
        $el.find('.drzContentSlider-bullets').remove();
        $el.find('.drzContentSlider-next-btn').remove();
        $el.find('.drzContentSlider-back-btn').remove();
        $el.off('swipeleft');
        $el.off('swiperight');
        $el.off('mouseover');
        $el.off('mouseleave');
        $el.find('.drzContentSlider-item').each(function destroyAnimations() {
          $(this).stop()
            .removeAttr('style')
            .removeClass((index, className) => {
              let cls = className.match(/(^|\s)item-\S+/g);
              if (cls) {
                cls = cls.join(' ');
              } else {
                cls = '';
              }
              return cls;
            });
        });
        drzzle.window.off('resize', resizeContentSlider);
        clearInterval(interval);
        clearTimeout(hideTO);
      };
    });
    return this;
  };
})(jQuery);
