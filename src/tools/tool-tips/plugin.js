/*
============================
 Drzzle Tooltips Plugin
============================
*/
(($) => {
  $.fn.drzTooltip = function initTooltips() {
    const $tooltip = $(this);
    const $body = $('body');
    $tooltip.each(function tip() {
      const $this = $(this);
      let ttContent = $this.attr('data-tooltip-content');
      let $ttPos = $this.attr('data-tooltip-position');
      let toolTip;
      let liveTip;
      let liveTipWidth;
      let liveTipHeight;
      let liveTipArrow;
      let liveArrowHeight;
      let liveArrowWidth;
      let triggerHeight;
      let triggerWidth;
      let triggerOffsetLeft;
      let triggerOffsetTop;

      // attribute options
      if (typeof $ttPos !== typeof undefined && $ttPos !== false) {
        if ($ttPos === '') {
          $ttPos = 'top';
        }
      } else {
        $ttPos = 'top';
      }

      if (typeof ttContent !== typeof undefined && ttContent !== false) {
        if (ttContent === '') {
          ttContent = 'Content Here';
        }
      } else {
        ttContent = 'Content Here';
      }

      const actions = {
        buildTip() {
          triggerHeight = ~~($this.outerHeight());
          triggerWidth = ~~($this.outerWidth());
          triggerOffsetLeft = ~~($this.offset().left);
          triggerOffsetTop = ~~($this.offset().top);

          toolTip = $(`<span class="drzTooltip-tip">${ttContent}<div class="drzTooltip-arrow"></div></span>`);
          if (!$body.siblings('.drzTooltip-tip').length) {
            toolTip.insertAfter($body);
          }

          liveTip = $body.siblings('.drzTooltip-tip');
          liveTipArrow = liveTip.find('.drzTooltip-arrow');
          liveTipWidth = ~~(liveTip.outerWidth());
          liveTipHeight = ~~(liveTip.outerHeight());

          // set arrow class here based on position
          if ($ttPos.match(/top/gi)) {
            liveTipArrow.addClass('drzTooltip-tip-arrowTop');
          } else if ($ttPos.match(/bottom/gi)) {
            liveTipArrow.addClass('drzTooltip-tip-arrowBottom');
          } else if ($ttPos.match(/right/gi)) {
            liveTipArrow.addClass('drzTooltip-tip-arrowRight');
          } else if ($ttPos.match(/left/gi)) {
            liveTipArrow.addClass('drzTooltip-tip-arrowLeft');
          }

          liveArrowHeight = ~~(liveTip.find('.drzTooltip-arrow').outerHeight());
          liveArrowWidth = ~~(liveTip.find('.drzTooltip-arrow').outerWidth());

          if ($ttPos.match(/top/gi) || $ttPos.match(/bottom/gi)) {
            if (liveTipWidth <= triggerWidth) {
              liveTip.css('left', (triggerOffsetLeft) + ((triggerWidth - liveTipWidth) / 2));
            } else if (liveTipWidth > triggerWidth) {
              liveTip.css('left', (triggerOffsetLeft) - ((liveTipWidth - triggerWidth) / 2));
            }
            if ($ttPos.match(/top/gi)) {
              liveTip.css('top', (triggerOffsetTop - liveTipHeight) - (liveArrowHeight));
            } else if ($ttPos.match(/bottom/gi)) {
              liveTip.css('top', (triggerOffsetTop + triggerHeight) + (liveArrowHeight));
            }
          }
          if ($ttPos.match(/right/gi) || $ttPos.match(/left/gi)) {
            if (triggerHeight >= liveTipHeight) {
              liveTip.css('top', (triggerOffsetTop) + ((triggerHeight - liveTipHeight) / 2));
            } else if (triggerHeight < liveTipHeight) {
              liveTip.css('top', (triggerOffsetTop) - ((liveTipHeight - triggerHeight) / 2));
            }
            if ($ttPos.match(/right/gi)) {
              liveTip.css('left', (triggerOffsetLeft + triggerWidth) + liveArrowWidth);
            } else if ($ttPos.match(/left/gi)) {
              liveTip.css('left', (triggerOffsetLeft) - (liveTipWidth + liveArrowWidth));
            }
            // vertically center arrows for left/right positioned tips
            liveTipArrow.css('top', (liveTipHeight / 2) - (liveArrowHeight / 2));
          }
          liveTip.addClass('drzTooltip-activeTip');
        },
        removeTip() {
          if ($body.siblings('.drzTooltip-tip').length) {
            $body.siblings('.drzTooltip-tip')
              .removeClass('drzTooltip-activeTip')
              .remove();
          }
        },
        resizeTimer: null,
        resizeTip() {
          clearTimeout(this.resizeTimer);
          this.resizeTimer = setTimeout(() => {
            actions.removeTip();
          }, 200);
        },
      };

      // attach all listeners
      drzzle.window.resize(actions.resizeTip);

      $this.mouseover(() => {
        if (window.matchMedia(drzzle.viewports.desktop).matches) {
          actions.buildTip();
        }
      });
      $this.mouseleave(() => {
        if (window.matchMedia(drzzle.viewports.desktop).matches) {
          actions.removeTip();
        }
      });
      $this.click(() => {
        if (
          window.matchMedia(drzzle.viewports.tablet).matches ||
          window.matchMedia(drzzle.viewports.mobile).matches) {
          if (!$body.siblings('.drzTooltip-tip').length) {
            actions.buildTip();
          } else {
            actions.removeTip();
          }
        }
      });

      // Destroy method
      $.fn.drzTooltip.destroy = ($el) => {
        drzzle.window.off('resize', actions.resizeTip);
        actions.removeTip();
        $el.each(function removeListeners() {
          const $tip = $(this);
          $tip.off('mouseover');
          $tip.off('mouseleave');
          $tip.off('click');
        });
      };
    });
    return this;
  };
})(jQuery);
