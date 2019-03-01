/*
============================
 Drzzle Modal Plugin
============================
*/
(($) => {
  $.fn.drzModal = function drzModal() {
    const $modal = $(this);
    $modal.each(function initModal() {
      const $modalTrigger = $(this);
      const $modalOverlay = $modalTrigger.next('.drzModal-overlay');
      const $modalContent = $modalOverlay.find('.drzModal-content');
      const $body = $('body');
      let swapModalClass;
      let addLeaveClasses;
      let resetModal;

      $modalOverlay.addClass('drzModal-overlay-inStart');
      $modalContent.addClass('drzModal-content-inStart');

      function buildModal($thisModal) {
        $thisModal.insertAfter($body);
        $thisModal.show();

        clearTimeout(swapModalClass);
        swapModalClass = setTimeout(() => {
          $thisModal.removeClass('drzModal-overlay-inStart').addClass('drzModal-overlay-inEnd');
          $modalContent.removeClass('drzModal-content-inStart').addClass('drzModal-content-inEnd');
        }, 50);

        if ($thisModal.hasClass('drzModal-announcement')) {
          $modalContent.addClass('drzModal-anMessage');
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
            // move the modal node back inside it's container
            $thisModal.insertAfter($modalTrigger);
            $thisModal.hide();
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
    });
    return this;
  };
})(jQuery);
