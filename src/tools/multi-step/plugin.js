/*
============================
 Drzzle Multi-Step Plugin
============================
*/
(($) => {
  $.fn.drzMultiStep = function multiStep() {
    const $multiStep = $(this);
    $multiStep.find('.drzMultiStep-step').each(function initStep() {
      const $this = $(this);
      const indexNum = $this.index() + 1;
      const $stepLabel = $this.attr('data-step-label');

      $this.parent().prev('.drzMultiStep-progress')
        .append(`
          <span class="drzMultiStep-progressStep drzMultiStep-progressStep${indexNum}">
            <div class="drzMultiStep-progressStep-num"></div>
          </span>`);
      $this.parent().prev('.drzMultiStep-progress')
        .find(`.drzMultiStep-progressStep${indexNum}`)
        .append($stepLabel);
      $this.parent().prev('.drzMultiStep-progress')
        .find(`.drzMultiStep-progressStep${indexNum}`)
        .find('.drzMultiStep-progressStep-num')
        .html(indexNum);

      const $nextBtn = $('<button class="drzMultiStep-nextBtn">Next</button>');
      const $backBtn = $('<button class="drzMultiStep-backBtn">Back</button>');
      const $msRow = $this.find('.drzMultiStep-btnRow');
      const $msProgress = $this.parent().prev('.drzMultiStep-progress');

      if ($this.is(':first-child')) {
        $this.addClass('drzMultiStep-stepActive');
        $msProgress.find(`.drzMultiStep-progressStep${indexNum} .drzMultiStep-progressStep-num`)
          .addClass('drzMultiStep-progressStep-numActive');
        $msRow.prepend($nextBtn);
      }

      if ($this.is(':last-child')) {
        $msRow.prepend($backBtn);
      }

      if ($this.is(':not(:first-child)') && $this.is(':not(:last-child)')) {
        $msRow.prepend($nextBtn);
        $msRow.prepend($backBtn);
      }

      // next click event
      $this.find('.drzMultiStep-nextBtn').click((e) => {
        if (!$this.is(':animated')) {
          e.preventDefault();
          $this.css('height', $this.outerHeight());
          $this.css('width', $this.outerWidth());
          $this.addClass('position-absolute');
          $this.animate({
            marginLeft: '-200px',
            opacity: 0,
          }, 300);
          $this.next().addClass('drzMultiStep-stepActive');
          setTimeout(() => {
            $this.removeClass('drzMultiStep-stepActive');
          }, 300);
          $msProgress.find(`.drzMultiStep-progressStep${indexNum}`)
            .next().find('.drzMultiStep-progressStep-num')
            .addClass('drzMultiStep-progressStep-numActive');
        }
      });

      // back click event
      $this.find('.drzMultiStep-backBtn').click((e) => {
        if (!$this.prev().is(':animated')) {
          e.preventDefault();
          $this.removeClass('drzMultiStep-stepActive');
          $this.prev().removeClass('position-absolute');
          $this.prev().addClass('drzMultiStep-stepActive');
          $this.prev().animate({
            marginLeft: '0px',
            opacity: 1,
          }, 300);
          setTimeout(() => {
            $this.prev().css('height', '');
            $this.prev().css('width', '');
          }, 300);
          $msProgress.find(`.drzMultiStep-progressStep${indexNum} .drzMultiStep-progressStep-num`)
            .removeClass('drzMultiStep-progressStep-numActive');
        }
      });
    });
    return this;
  };
})(jQuery);
