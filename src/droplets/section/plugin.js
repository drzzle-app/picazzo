/* Section Bg Videos
* ======================= */
(($) => {
  $.fn.drzSectionVideo = function drzAccordion() {
    const $video = $(this);
    $video.each(function initVideo() {
      const $v = $(this);
      let $attrs = $v.attr('data-videos');
      let resizeTimer;
      let start = true;
      let startingViewport;
      let endingViewport;
      const methods = {
        init($vid, resize) {
          $attrs = $vid.attr('data-videos');
          $attrs = $attrs.desktop ? $attrs : JSON.parse($attrs);
          // we only want to redraw on resize if there is a change
          if (resize && $attrs[resize.startingViewport].src !== $attrs[resize.endingViewport].src) {
            $vid.find('video.drzSection-video').remove();
            methods.drawVideo($vid);
          }
          if (!resize) {
            $vid.find('video.drzSection-video').remove();
            methods.drawVideo($vid);
          }
        },
        drawVideo($vid) {
          // draw new video
          const data = methods.getSource($attrs);
          const $newVideo = $(`
            <video class="drzSection-video" muted loop playsinline autoplay>
              <source src="${data.src}" type="video/${data.type}" />
              <p class="warning">Your browser does not support HTML5 video.</p>
            </video>`);
          // prepend to container
          $vid.prepend($newVideo);
          // auto play video if it hasn't started on it's own
          const domV = $vid.find('.drzSection-video').get(0);
          domV.addEventListener('loadeddata', () => {
            let count = 0;
            const tryToPlay = () => {
              if (domV.paused && count < 31) {
                count += 1;
                domV.play().catch(() => { tryToPlay(); });
              }
            };
            tryToPlay();
          });
        },
        getSource(data) {
          let src = '';
          let type = '';
          if (window.matchMedia(drzzle.viewports.desktop).matches) {
            src = data.desktop.src;
            type = data.desktop.type;
          }
          if (window.matchMedia(drzzle.viewports.tablet).matches) {
            src = data.tablet.src;
            type = data.tablet.type;
          }
          if (window.matchMedia(drzzle.viewports.mobile).matches) {
            src = data.mobile.src;
            type = data.mobile.type;
          }
          return { src, type };
        },
        get() {
          let viewport = '';
          if (window.matchMedia(drzzle.viewports.desktop).matches) {
            viewport = 'desktop';
          }
          if (window.matchMedia(drzzle.viewports.tablet).matches) {
            viewport = 'tablet';
          }
          if (window.matchMedia(drzzle.viewports.mobile).matches) {
            viewport = 'mobile';
          }
          return { viewport };
        },
        resize() {
          if (start) {
            startingViewport = methods.get().viewport;
            start = false;
          }
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            endingViewport = methods.get().viewport;
            methods.init($v, { startingViewport, endingViewport });
            start = true;
          }, 250);
        },
      };

      if ($attrs) {
        // init the plugin on load
        methods.init($v);
        // redraw on screen resize
        drzzle.window.resize(methods.resize);
      }
      // destroy plugin
      $.fn.drzSectionVideo.destroy = ($el) => {
        $el.find('video.drzSection-video').remove();
        drzzle.window.off('resize', methods.resize);
      };
    });
    return this;
  };
})(jQuery);
