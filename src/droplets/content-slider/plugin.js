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

      let $sliderWidth = ~~($this.outerWidth());
      if ($effectOption.match(/slide/gi)) {
        effect = { marginLeft: -($sliderWidth) };
        $this.find('.drzContentSlider-item').each(function setOpacity() {
          $(this).css('opacity', 1);
        });
      } else if ($effectOption.match(/fade/gi)) {
        effect = { opacity: 0 };
      }

      const animateSpeed = 400;
      const fadeBack = { opacity: 1 };
      let imgNum = 0;

      let hideTO;
      function hideDelay(e) {
        hideTO = setTimeout(() => {
          e.hide();
        }, animateSpeed);
      }

      let showTO;
      function showDelay(e) {
        showTO = setTimeout(() => {
          e.show();
          if ($effectOption.match(/fade/gi)) {
            e.animate(fadeBack, animateSpeed);
          }
        }, animateSpeed);
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
        // if slide option, recalculate container width on resize
        if ($effectOption.match(/slide/gi)) {
          window.drzzle.window.resize(resizeContentSlider);
        }
        const $currentSlide = $element.find(`.drzContentSlider-item.item-${imgNum}`);
        $currentSlide.animate(effect, animateSpeed);
        hideDelay($currentSlide);
        imgNum += 1;
        if (imgNum > totalImages - (1)) {
          imgNum = 0;
          const $lastSlide = $element.find(`.drzContentSlider-item.item-${totalImages - (1)}`);
          if ($effectOption.match(/slide/gi)) {
            $element.find(`.drzContentSlider-item.item-${imgNum}`)
              .show()
              .css('margin-left', $sliderWidth);
            $element.find(`.drzContentSlider-item.item-${imgNum}`)
              .animate({ marginLeft: 0 }, animateSpeed);
          }
          $lastSlide.animate(effect, animateSpeed);
          hideDelay($lastSlide);
        }
        const $nextSlide = $element.find(`.drzContentSlider-item.item-${imgNum}`);
        if ($effectOption.match(/slide/gi)) {
          $nextSlide.show()
            .css('margin-left', $sliderWidth)
            .animate({ marginLeft: 0 }, animateSpeed);
        } else if ($effectOption.match(/fade/gi)) {
          showDelay($nextSlide);
        }
        $element.find(`.drzContentSlider-bullet.b-${imgNum}`)
          .addClass('active')
          .siblings()
          .removeClass('active');
      }

      function back($element) {
        const $currentSlide = $element.find(`.drzContentSlider-item.item-${imgNum}`);
        if ($effectOption.match(/slide/gi)) {
          $currentSlide.animate({ marginLeft: $sliderWidth }, animateSpeed);
        } else if ($effectOption.match(/fade/gi)) {
          $currentSlide.animate(effect, animateSpeed);
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
          if ($effectOption.match(/slide/gi)) {
            $lastSlide.css('margin-left', -($sliderWidth));
            $lastSlide.animate({ marginLeft: 0 }, animateSpeed);
          } else if ($effectOption.match(/fade/gi)) {
            $lastSlide.animate(effect, animateSpeed);
          }
          hideDelay($lastSlide);
        }
        const $previousSlide = $element.find(`.drzContentSlider-item.item-${imgNum}`);
        if ($effectOption.match(/slide/gi)) {
          $previousSlide.show().css('margin-left', -($sliderWidth)).animate({ marginLeft: 0 }, animateSpeed);
        } else if ($effectOption.match(/fade/gi)) {
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
        if ($effectOption.match(/slide/gi)) {
          $this.find(`.drzContentSlider-item.item-${$bulletNum}`)
            .show()
            .css('margin-left', 0).siblings('.drzContentSlider-item')
            .hide();
        } else if ($effectOption.match(/fade/gi)) {
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
        window.drzzle.window.off('resize', resizeContentSlider);
        clearInterval(interval);
        clearTimeout(hideTO);
        clearTimeout(showTO);
      };
    });
    return this;
  };
})(jQuery);
