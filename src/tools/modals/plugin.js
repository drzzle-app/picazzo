/*
============================
 Drzzle Modal Plugin
============================
*/
(($) => {
  $.fn.drzModal = function drzModal(opts) {
    const $modal = $(this);
    const defaults = {
      blue: false,
      pageLoad: false,
      trigger: false, // if binding overlay
    };
    const options = $.extend({}, defaults, opts);
    $modal.each(function initModal() {
      // the default assumes the plugin is bound to the trigger with the overlay next to it
      const $modalTrigger = options.trigger ? $(`[href="${options.trigger}"]`) : $(this);
      const $modalOverlay = options.trigger ? $(this) : $modalTrigger.next('.drzModal-overlay');
      const overlayNodeIndex = $modalOverlay.index();
      const $overlayParent = $modalOverlay.parent().get(0);

      const $modalContent = $modalOverlay.find('.drzModal-content');
      const $body = $('body');
      let swapModalClass;
      let addLeaveClasses;
      let resetModal;

      $modalOverlay.addClass('drzModal-overlay-inStart');
      $modalContent.addClass('drzModal-content-inStart');

      function buildModal($thisModal) {
        $thisModal.insertAfter($body);
        $thisModal.css({ display: 'block' });

        clearTimeout(swapModalClass);
        swapModalClass = setTimeout(() => {
          $thisModal.removeClass('drzModal-overlay-inStart').addClass('drzModal-overlay-inEnd');
          $modalContent.removeClass('drzModal-content-inStart').addClass('drzModal-content-inEnd');
        }, 50);

        if ($thisModal.hasClass('drzModal-announcement')) {
          $modalContent.addClass('drzModal-anMessage');
          $body.addClass('blur');
        }

        if (options.blur) {
          $body.addClass('blur');
        }

        // focus on input if a search modal
        if ($modalContent.find('.drzModal-search-bar').length) {
          $modalContent.find('.drzModal-search-bar').focus();
        }

        function closeModal(e) {
          $thisModal.removeClass('drzModal-overlay-inEnd').addClass('drzModal-overlay-leaveStart');
          $modalContent
            .removeClass('drzModal-content-inEnd')
            .addClass('drzModal-content-leaveStart');

          clearTimeout(addLeaveClasses);
          addLeaveClasses = setTimeout(() => {
            $thisModal
              .removeClass('drzModal-overlay-leaveStart')
              .addClass('drzModal-overlay-leaveEnd');
            $modalContent
              .removeClass('drzModal-content-leaveStart')
              .addClass('drzModal-content-leaveEnd');
          }, 50);

          if ($body.hasClass('blur')) {
            $body.removeClass('blur');
          }

          clearTimeout(resetModal);
          resetModal = setTimeout(() => {
            // move the modal node back where it was
            $overlayParent.insertBefore(
              $thisModal.get(0), $overlayParent.children[overlayNodeIndex],
            );
            $thisModal.css({ display: '' });
            $thisModal
              .removeClass('drzModal-overlay-leaveEnd')
              .addClass('drzModal-overlay-inStart');
            $modalContent
              .removeClass('drzModal-content-leaveEnd')
              .addClass('drzModal-content-inStart');
          }, 600);
          e.preventDefault();
        }

        $thisModal.find('.drzModal-closeLink').click(closeModal);
        $thisModal.click(closeModal);
        $thisModal.find('.drzModal-content').click((e) => {
          e.stopPropagation();
        });

        // close modal on escape key
        $(document).keyup((e) => {
          if (e.key === 'Escape') {
            closeModal(e);
          }
        });
      }

      $modalTrigger.click((e) => {
        e.preventDefault();
        if (!$modalOverlay.hasClass('drzModal-overlay-leaveEnd')) {
          buildModal($modalOverlay);
        }
      });

      // Auto show announcement modal
      if ($modalOverlay.hasClass('drzModal-announcement')) {
        /* disabled for demo */
        // buildModal($modalOverlay);
      }

      if (options.pageLoad) {
        setTimeout(() => {
          buildModal($modalOverlay);
        }, 500);
      }
    });
    return this;
  };
})(jQuery);
