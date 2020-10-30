/*
================================
 Drzzle Image Gallery Plugin
================================
*/
(($) => {
  $.fn.drzImageGallery = function imageGallery(options) {
    let index;
    let totalImages;
    let displayNum;
    let isGalleryModal;
    let escClose;
    let $thisImg;
    let $legend;
    let $backBtn;
    let $nextBtn;
    let $closeBtn;
    const $body = $('body');
    const $doc = $(document);
    const $imageGallery = $(this);

    // callbacks
    function moveBack(e) {
      e.preventDefault();
      if (index > 0) {
        $thisImg.eq(index).removeClass('block');
        index -= 1;
        displayNum = index + 1;
        $thisImg.eq(index).addClass('block');
        $legend.html(`${displayNum} / ${totalImages}`);
        if (index === 0) {
          $backBtn.css('visibility', 'hidden');
        }
        if (index < totalImages - 1) {
          $nextBtn.css('visibility', 'visible');
        }
      }
    }

    function moveNext(e) {
      e.preventDefault();
      if (index <= totalImages - 2) {
        $thisImg.eq(index).removeClass('block');
        index += 1;
        displayNum = index + 1;
        $thisImg.eq(index).addClass('block');
        $legend.html(`${displayNum} / ${totalImages}`);
        if (index === totalImages - 1) {
          $nextBtn.css('visibility', 'hidden');
        }
        if (index > 0) {
          $backBtn.css('visibility', 'visible');
        }
      }
    }
    // for keyboard controls
    const galleryKeys = (e) => {
      if (isGalleryModal) {
        if (e.keyCode === 39) {
          moveNext(e);
        }
        if (e.keyCode === 37) {
          moveBack(e);
        }
      }
    };
    $doc.keydown(galleryKeys);

    $imageGallery.each(function initGallery() {
      const $this = $(this);
      isGalleryModal = false;

      $this.find('.drzImageGallery-img').click((e) => {
        e.preventDefault();
        const $newBuild = $this.html();
        const $el = $(e.currentTarget);
        totalImages = ~~$this.find('.drzImageGallery-img').length;
        isGalleryModal = true;
        if (
          $el
            .parent()
            .attr('class')
            .match(/pg-page-/gi)
        ) {
          index = ~~$el
            .closest('.drzImageGallery')
            .find('.drzImageGallery-img')
            .index(this);
        } else {
          index = ~~$el.index();
        }
        displayNum = index + 1;
        const dataId = options && options.id ? ` data-droplet-id="${options.id}" ` : '';
        const modal = `<div class="drzModal-overlay drzImageGallery-modal"${dataId}>
          <div class="drzModal-closeRow">
            <a class="drzModal-closeLink" href="#"></a>
          </div>
          <div class="drzModal-content drzImageGallery-content">
            <div class="drzImageGallery-controls">
              <span class="drzImageGallery-legend">${displayNum} / ${totalImages}</span>
              <button class="drzBtn drzImageGallery-btn drzImageGallery-btnBack"></button>
              <button class="drzBtn drzImageGallery-btn drzImageGallery-btnNext"></button>
            </div>
            ${$newBuild}
          </div>
        </div>`;

        $(modal).insertAfter($body);
        const $overlay = $body.next('.drzModal-overlay');
        const $content = $overlay.find('.drzModal-content');
        $overlay.fadeIn();

        $thisImg = $body.next('.drzImageGallery-modal').find('.drzImageGallery-img');
        $backBtn = $body.next('.drzImageGallery-modal').find('.drzImageGallery-btnBack');
        $nextBtn = $body.next('.drzImageGallery-modal').find('.drzImageGallery-btnNext');
        $legend = $body.next('.drzImageGallery-modal').find('.drzImageGallery-legend');
        $closeBtn = $body.next('.drzImageGallery-modal').find('.drzModal-closeLink');

        if (index === 0) {
          $backBtn.css('visibility', 'hidden');
        }
        if (index === totalImages - 1) {
          $nextBtn.css('visibility', 'hidden');
        }
        // if paginated, remove page wrappers in modal
        if (
          $thisImg
            .parent()
            .attr('class')
            .match(/pg-page-/gi)
        ) {
          $thisImg.unwrap();
          // reset variable
          $thisImg = $body.next('.drzImageGallery-modal').find('.drzImageGallery-img');
        }
        // show clicked image
        $thisImg.siblings().removeClass('block');
        $thisImg.eq(index).addClass('block');

        $nextBtn.click(moveNext);
        $backBtn.click(moveBack);
        $thisImg.on('swipeleft', moveNext);
        $thisImg.on('swiperight', moveBack);

        function closeGallery(evt) {
          evt.preventDefault();
          isGalleryModal = false;
          $overlay.fadeOut(300);
          setTimeout(() => {
            $overlay.remove();
          }, 300);
        }

        escClose = (evt) => {
          if (isGalleryModal && evt.key === 'Escape') {
            closeGallery(evt);
          }
        };

        $closeBtn.click(evt => closeGallery(evt));
        $overlay.click(evt => closeGallery(evt));
        $content.click(evt => evt.stopPropagation());
        $doc.keyup(evt => escClose(evt));
      });
      // destroy function
      $.fn.drzImageGallery.destroy = ($el) => {
        $el.find('.drzImageGallery-img').off('click');
        $doc.off('keydown', galleryKeys);
        $doc.off('keydown', escClose);
      };
    });
    return this;
  };
})(jQuery);
