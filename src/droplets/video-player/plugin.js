/*
============================
 Drzzle Video Plugin
============================
*/
(($) => {
  $.fn.drzVideoPlayer = function drzVideoPlayer() {
    const $videoContainer = $(this);
    $videoContainer.each(function initPlayer() {
      const $this = $(this);
      const $video = $this.find('.drzVideo-src').get(0);
      const thisNode = $this.get(0);
      const $controlsContainer = $this.find('.drzVideo-controls');
      const $playBtn = $this.find('.drzVideo-playBtn');
      const $pauseBtn = $this.find('.drzVideo-pauseBtn');
      const $volume = $this.find('.drzVideo-volSlider');
      const $mute = $this.find('.drzVideo-muteBtn');
      const $progress = $this.find('.drzVideo-progress');
      const $progressBar = $this.find('.drzVideo-progressBar');
      const $fullScreenBtn = $this.find('.drzVideo-fullScreenBtn');
      const $timeElapsed = $this.find('.drzVideo-currentTime');
      const $totalTime = $this.find('.drzVideo-totalTime');
      const $timeContainer = $this.find('.drzVideo-videoTime');
      const $sliderContainer = $this.find('.drzVideo-volSliderContainer');
      const $overlay = $this.find('.drzVideo-overlay');
      const $initialOverlayBg = $overlay.css('background-color');
      const $overlayPlayBtn = $overlay.find('.drzVideo-playBtn-lrg');

      // set timeElapsed to 0 at first
      $timeElapsed.html('0:00');

      // prepare for any dynamically changed src
      $this.find('.drzVideo-src').load();

      // callback for triggering video play on overlay click
      const oPlay = function oPlay() {
        if ($video.paused || $video.ended) {
          $video.play();
          $overlay.css('background-color', 'transparent');
          if ($overlayPlayBtn.is(':visible')) {
            $overlayPlayBtn.fadeOut();
          }
        } else {
          $video.pause();
          $overlay.css('background-color', $initialOverlayBg);
          if (!$overlayPlayBtn.is(':visible')) {
            $overlayPlayBtn.fadeIn();
          }
        }
      };

      // wait for the video meta data to come in, then show total time
      const getTotalTime = function getTotalTime() {
        const totalMinutes = parseInt($video.duration / 60, 10);
        let totalSeconds = parseInt($video.duration % 60, 10);
        let totalHours = parseInt(totalMinutes / 60, 10);
        if (totalSeconds < 10) {
          totalSeconds = `:0${totalSeconds}`;
        } else {
          totalSeconds = `:${totalSeconds}`;
        }
        if (totalHours > 0) {
          totalHours = `${totalHours}:`;
        } else {
          totalHours = '';
        }
        $totalTime.html(totalHours + totalMinutes + totalSeconds);
        const $parent = $this.parent();
        if ($parent.hasClass('drzVideo-feature')) {
          $parent.find('.drzVideo-featureDuration').html('0:00');
          $parent.find('.drzVideo-featureTotalTime').html(totalHours + totalMinutes + totalSeconds);
        }
      };

      // update time of video for progress callback
      const updateTime = function updateTime() {
        let value = 0;
        const minutes = parseInt($video.currentTime / 60, 10);
        let seconds = parseInt($video.currentTime % 60, 10);
        let hours = parseInt(minutes / 60, 10);
        if ($video.currentTime > 0) {
          value = Math.floor((100 / $video.duration) * $video.currentTime);
        }
        if (seconds < 10) {
          seconds = `:0${seconds}`;
        } else {
          seconds = `:${seconds}`;
        }
        if (hours > 0) {
          hours = `${hours}:`;
        } else {
          hours = '';
        }
        $progress.css('width', `${value}%`);
        $timeElapsed.html(hours + minutes + seconds);
        const $parent = $this.parent();
        if ($parent.hasClass('drzVideo-feature')) {
          $parent.find('.drzVideo-featureDuration').html(hours + minutes + seconds);
        }
      };

      // when video is over, show the overlay and play button again
      const setOverlay = function setOverlay() {
        $overlay.css('background-color', $initialOverlayBg);
        if (!$overlayPlayBtn.is(':visible')) {
          $overlayPlayBtn.fadeIn();
        }
      };

      // enable the dragging events to update/change the video time
      let progressDrag = false;
      const doc = $(document);

      // update progress for dragging on time bar
      const updateProgress = function updateProgress(p) {
        const dur = $video.duration;
        const pos = p - $progressBar.offset().left;
        let perc = 100 * (pos / $progressBar.width());
        if (perc > 100) {
          perc = 100;
        }
        if (perc < 0) {
          perc = 0;
        }
        $video.currentTime = dur * (perc / 100);
        $progress.css('width', `${perc}%`);
      };

      const setProgress = function setProgress(e) {
        progressDrag = true;
        updateProgress(e.pageX);
      };

      doc.on('vmouseup', (e) => {
        if (progressDrag) {
          progressDrag = false;
          updateProgress(e.pageX);
        }
      });

      doc.on('vmousemove', (e) => {
        if (progressDrag) {
          updateProgress(e.pageX);
        }
      });

      const toggleControls = function toggleControls() {
        let hideControls;
        function slideControlsUp() {
          if ($controlsContainer.hasClass('drzVide-slideDown')) {
            $controlsContainer.removeClass('drzVide-slideDown');
            $progress.removeClass('drzVideo-soloProgress');
            $progressBar.removeClass('drzVideo-soloProgress');
            clearTimeout(hideControls);
            hideControls = setTimeout(() => {
              if (!$controlsContainer.hasClass('drzVide-slideDown')) {
                $controlsContainer.addClass('drzVide-slideDown');
                $progress.addClass('drzVideo-soloProgress');
                $progressBar.addClass('drzVideo-soloProgress');
              }
            }, 3000);
          }
        }

        function clearTime() {
          return clearTimeout(hideControls);
        }

        function slideControlsDown() {
          clearTimeout(hideControls);
          hideControls = setTimeout(() => {
            if (!$controlsContainer.hasClass('drzVide-slideDown')) {
              $controlsContainer.addClass('drzVide-slideDown');
              $progress.addClass('drzVideo-soloProgress');
              $progressBar.addClass('drzVideo-soloProgress');
            }
          }, 3000);
        }

        function offHover() {
          clearTimeout(hideControls);
          if (!$controlsContainer.hasClass('drzVide-slideDown')) {
            $controlsContainer.addClass('drzVide-slideDown');
            $progress.addClass('drzVideo-soloProgress');
            $progressBar.addClass('drzVideo-soloProgress');
          }
        }

        $this.on('vmousemove', slideControlsUp);
        $this.find('.drzVideo-controlBar').on('vmouseover', clearTime);
        $this.find('.drzVideo-controlBar').on('mouseleave', slideControlsDown);
        $this.mouseleave(offHover);
      };

      function playVideo() {
        if ($video.paused || $video.ended) {
          $video.play();
          $overlay.css('background-color', 'transparent');
          if ($overlayPlayBtn.is(':visible')) {
            $overlayPlayBtn.fadeOut();
          }
        }
      }

      function pauseVideo(e) {
        e.stopPropagation();
        $video.pause();
        $overlay.css('background-color', $initialOverlayBg);
        if (!$overlayPlayBtn.is(':visible')) {
          $overlayPlayBtn.fadeIn();
        }
      }

      function setVolume() {
        $video.volume = $volume.val();
      }

      function toggleMute(e) {
        e.stopPropagation();
        $video.muted = !$video.muted;
        $mute.toggleClass('drzVideo-muteOff');
      }

      const toggleFullScreen = function toggleFullScreen(e) {
        e.stopPropagation();
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) ||
            (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) ||
            (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
            (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
          if (thisNode.requestFullScreen) {
            thisNode.requestFullScreen();
          } else if (thisNode.mozRequestFullScreen) {
            thisNode.mozRequestFullScreen();
          } else if (thisNode.webkitRequestFullScreen) {
            thisNode.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
          } else if (thisNode.msRequestFullscreen) {
            thisNode.msRequestFullscreen();
          }
        } else if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      };

      // bind the control toggling only once after clicking on video
      $this.one('click', toggleControls);

      // need to stop propagation on the following
      $timeContainer.click(e => e.stopPropagation());
      $sliderContainer.click(e => e.stopPropagation());

      // attach callbacks on listeners
      $overlay.click(oPlay);
      $video.addEventListener('durationchange', getTotalTime, false);
      $video.addEventListener('timeupdate', updateTime, false);
      $video.addEventListener('ended', setOverlay, false);
      $progressBar.on('vmousedown', setProgress);

      $playBtn.click(playVideo);
      $pauseBtn.click(pauseVideo);
      $volume.change(setVolume);
      $mute.click(toggleMute);
      $fullScreenBtn.click(toggleFullScreen);

      $.fn.drzVideoPlayer.destroy = ($el) => {
        // grab attached selectors and remove attached listeners
        $el.off('click');
        $el.off('mouseleave');
        $el.off('vmousemove');
        $el.find('.drzVideo-videoTime').off('click');
        $el.find('.drzVideo-volSliderContainer').off('click');
        $el.find('.drzVideo-overlay').off('click');
        $el.find('.drzVideo-progressBar').off('vmousedown');
        $el.find('.drzVideo-playBtn').off('click');
        $el.find('.drzVideo-pauseBtn').off('click');
        $el.find('.drzVideo-volSlider').off('change');
        $el.find('.drzVideo-muteBtn').off('click');
        $el.find('.drzVideo-fullScreenBtn').off('click');
        const vidNode = $el.find('.drzVideo-src').get(0);
        vidNode.removeEventListener('durationchange', getTotalTime, false);
        vidNode.removeEventListener('timeupdate', updateTime, false);
        vidNode.removeEventListener('ended', setOverlay, false);
        const $ctrlBar = $el.find('.drzVideo-controlBar');
        $ctrlBar.off('vmouseover');
        $ctrlBar.off('mouseleave');
      };
    });
    return this;
  };
})(jQuery);
