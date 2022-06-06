(($) => {
  $.fn.drzProgressBar = function drzProgressBar(opts = {}) {
    const defaults = { progress: 0, total: 0 };
    const options = $.extend({}, defaults, opts);
    const $progressBar = $(this);
    const barClass = 'drzProgressBar-bar';
    const amountText = 'drzProgressBar-amount';
    const percentShown = 'drzProgressBar-percentage';
    const totalShown = 'drzProgressBar-total';

    const getNum = (val) => {
      const num = $.isNumeric(val) ? val : val.replace(/\D/g, '');
      return parseInt(num === '' ? 0 : num, 10);
    };

    $progressBar.each(function initProgressBar() {
      const $el = $(this);
      const $bar = $el.find(`.${barClass}`);
      const $amount = $el.find(`.${amountText}`);
      const $percentShown = $el.find(`.${percentShown}`);
      const $totalShown = $el.find(`.${totalShown}`);
      const progress = getNum(options.progress);
      const total = getNum(options.total);
      const methods = {
        init() {
          if (methods.initiated) {
            return;
          }
          if (methods.inView($el)) {
            const percentage = parseInt((progress * 100) / total, 10);
            $totalShown.text(options.total);
            methods.increment(0, percentage);
            methods.initiated = true;
          }
        },
        initiated: false,
        increment(start, end) {
          if (start <= end) {
            $amount.text(start);
            $percentShown.text(`${start}%`);
            setTimeout(() => {
              // always cap at 100%
              if (start <= 100) {
                $bar.css('width', `${start}%`);
              }
              methods.increment(start + 1, end);
            }, 10);
          }
          if (start === end) {
            $amount.text(options.progress);
          }
        },
        inView($droplet) {
          const $docViewTop = drzzle.window.scrollTop();
          const $docViewBottom = $docViewTop + drzzle.window.height();
          const $elTop = $droplet.offset().top;
          const $elBottom = $elTop + $droplet.height();
          return ($elBottom <= $docViewBottom) && ($elTop >= $docViewTop) && !methods.initiated;
        },
      };
      methods.init();
      drzzle.window.on('scroll', methods.init);
      $.fn.drzProgressBar.destroy = ($droplet, callback = () => {}) => {
        drzzle.window.off('scroll', methods.init);
        $bar.css('width', '');
        $amount.text('');
        $percentShown.text('');
        $totalShown.text('');
        methods.initiated = false;
        return callback();
      };
    });
    return this;
  };
})(jQuery);
