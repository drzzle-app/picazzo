/*
============================
 Drzzle Video Plugin
============================
*/
(($) => {
  $.fn.drzVideoPlayer = function drzVideoPlayer() {
    const $videoContainer = $(this);
    const $document = $(document);
    $videoContainer.each(function initPlayer() {
      const $this = $(this);
      const $video = $this.find('.drzVideo-src').get(0);
      const thisNode = $this.get(0);
      const $controlsContainer = $this.find('.drzVideo-controls');
      const $controlBtn = $controlsContainer.find('button');
      const $playBtn = $this.find('.drzVideo-playBtn');
      const $volume = $this.find('.drzVideo-volSlider');
      const $mute = $this.find('.drzVideo-volBtn');
      const $muteTooltip = $mute.find('.drzVideo-btn-tooltip');
      const $progress = $this.find('.drzVideo-progress');
      const $progressBar = $this.find('.drzVideo-progressBar');
      const $bufferBar = $this.find('.drzVideo-buffer');
      const $tooltip = $this.find('.drzVideo-timeline-tooltip');
      const $fullScreenBtn = $this.find('.drzVideo-fullScreenBtn');
      const $timeElapsed = $this.find('.drzVideo-currentTime');
      const $totalTime = $this.find('.drzVideo-totalTime');
      const $timeContainer = $this.find('.drzVideo-videoTime');
      const $sliderContainer = $this.find('.drzVideo-volSliderContainer');
      const $overlay = $this.find('.drzVideo-overlay');
      const $overlayPlayBtn = $overlay.find('.drzVideo-playBtn-lrg');
      // set timeElapsed to 0 at first
      $timeElapsed.html('0:00');

      // prepare for any dynamically changed src
      $this.find('.drzVideo-src').load();

      const methods = {
        onVideoLoad() {
          methods.setLoading(false);
        },
        loading: false,
        setLoading(loading) {
          methods.loading = loading;
          if (loading) {
            $overlay.addClass('drzVideo-loading');
          } else {
            $overlay.removeClass('drzVideo-loading');
          }
        },
        getTotalTime() {
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
        },
        updateTime() {
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
        },
        setOverlay() {
          $overlay.css('opacity', 1);
          if (!$overlayPlayBtn.is(':visible')) {
            $overlayPlayBtn.show();
          }
        },
        updateProgress(p) {
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
        },
        displayTime(seconds) {
          const hrs = ~~(seconds / 3600);
          const mins = ~~((seconds % 3600) / 60);
          const secs = ~~seconds % 60;

          let timeString = '';

          if (hrs > 0) {
            timeString += `${hrs}:${(mins < 10 ? '0' : '')}`;
          }

          timeString += `${mins}:${(secs < 10 ? '0' : '')}`;
          timeString += `${secs}`;

          return timeString;
        },
        progressDrag: false,
        onProgressHover(e) {
          $tooltip.show();
          const dur = $video.duration;
          const pos = e.pageX - $progressBar.offset().left;
          let perc = 100 * (pos / $progressBar.width());
          if (perc > 100) {
            perc = 100;
          }
          if (perc < 0) {
            perc = 0;
          }
          const $barWidth = $progressBar.width();
          const seconds = Math.round(dur * (perc / 100));
          const displayTime = methods.displayTime(seconds);

          $tooltip.text(displayTime);
          // center tip
          const halfTip = $tooltip.outerWidth() / 2;
          if (pos >= 0 && pos <= $barWidth) {
            $tooltip.css('left', `${pos - halfTip}px`);
            // check if tip bleeds off player so we can keep it inbounds
            const posCheck = methods.posCheck($progressBar, $tooltip);
            if (posCheck.bleeding) {
              $tooltip.css('left', `${(pos - halfTip) - posCheck.diff}px`);
            }
          }
        },
        posCheck(parent, child) {
          const parentRect = parent.get(0).getBoundingClientRect();
          const childRect = child.get(0).getBoundingClientRect();
          const bleedingLeft = childRect.left <= parentRect.left;
          const bleedingRight = childRect.right >= parentRect.right;
          const bleeding = bleedingLeft || bleedingRight;
          let bleedDir;
          let diff = 0;
          if (bleedingLeft) {
            diff = childRect.left - parentRect.left;
            bleedDir = 'left';
          }
          if (bleedingRight) {
            diff = childRect.right - parentRect.right;
            bleedDir = 'right';
          }
          return {
            bleeding,
            diff,
            bleedDir,
          };
        },
        onProgressLeave() {
          // hide tooltip
          $tooltip.hide();
        },
        setProgress(e) {
          methods.progressDrag = true;
          methods.updateProgress(e.pageX);
        },
        onMouseUp(e) {
          $document.find('body').removeClass('drz-mousedown');
          if (methods.progressDrag) {
            methods.progressDrag = false;
            methods.updateProgress(e.pageX);
          }
        },
        onMouseDown() {
          $document.find('body').addClass('drz-mousedown');
        },
        onMouseMove(e) {
          if (methods.progressDrag) {
            methods.updateProgress(e.pageX);
          }
        },
        hideControls: null,
        slideControlsUp() {
          if ($controlsContainer.hasClass('drzVide-slideDown')) {
            $controlsContainer.removeClass('drzVide-slideDown');
            $progress.removeClass('drzVideo-soloProgress');
            $progressBar.removeClass('drzVideo-soloProgress');
            clearTimeout(methods.hideControls);
            methods.hideControls = setTimeout(() => {
              if (!$controlsContainer.hasClass('drzVide-slideDown')) {
                $controlsContainer.addClass('drzVide-slideDown');
                $progress.addClass('drzVideo-soloProgress');
                $progressBar.addClass('drzVideo-soloProgress');
              }
            }, 3000);
          }
        },
        clearTime() {
          return clearTimeout(methods.hideControls);
        },
        slideControlsDown() {
          clearTimeout(methods.hideControls);
          methods.hideControls = setTimeout(() => {
            if (!$controlsContainer.hasClass('drzVide-slideDown')) {
              $controlsContainer.addClass('drzVide-slideDown');
              $progress.addClass('drzVideo-soloProgress');
              $progressBar.addClass('drzVideo-soloProgress');
            }
          }, 3000);
        },
        offHover() {
          clearTimeout(methods.hideControls);
          if (!$controlsContainer.hasClass('drzVide-slideDown')) {
            $controlsContainer.addClass('drzVide-slideDown');
            $progress.addClass('drzVideo-soloProgress');
            $progressBar.addClass('drzVideo-soloProgress');
          }
        },
        toggleControls() {
          $this.on('vmousemove', methods.slideControlsUp);
          $this.find('.drzVideo-controlBar').on('vmouseover', methods.clearTime);
          $this.find('.drzVideo-controlBar').on('mouseleave', methods.slideControlsDown);
          $this.mouseleave(methods.offHover);
          methods.slideControlsDown();
        },
        onPlay() {
          $overlay.css('opacity', 0);
          if ($overlayPlayBtn.is(':visible')) {
            $overlayPlayBtn.hide();
          }
          $playBtn.find('.drzVideo-playBtn-inner')
            .removeClass('drzVideo-play-icon')
            .addClass('drzVideo-pause-icon');
          $playBtn.find('.drzVideo-btn-tooltip').text('Pause (p)');
        },
        onPause() {
          $playBtn.find('.drzVideo-playBtn-inner')
            .removeClass('drzVideo-pause-icon')
            .addClass('drzVideo-play-icon');
          $overlay.css('opacity', 1);
          if (!$overlayPlayBtn.is(':visible')) {
            $overlayPlayBtn.show();
          }
          $playBtn.find('.drzVideo-btn-tooltip').text('Play (p)');
          // on mobile for better UX, we need to reshow the controls
          // if user clicks on the video overlay
          if (window.matchMedia(drzzle.viewports.mobile).matches) {
            methods.slideControlsUp();
          }
        },
        togglePlay(e) {
          if (!methods.loading) {
            if ($playBtn.find('.drzVideo-playBtn-inner').hasClass('drzVideo-play-icon')) {
              methods.playVideo(e);
            } else {
              methods.pauseVideo(e);
            }
          }
        },
        playVideo() {
          if ($video.paused || $video.ended) {
            $video.play();
          }
        },
        pauseVideo() {
          $video.pause();
        },
        setVolume(e) {
          const val = $volume.val();
          $video.volume = val;
          if (val === 0) {
            methods.toggleMute(e, true);
          }
          methods.setVolumeIcon();
        },
        volMouseUp() {
          $volume.blur();
        },
        setVolumeIcon() {
          const $muteInner = $mute.find('.drzVideo-volBtn-inner');
          const max = ~~($volume.attr('max'));
          const percent = (($volume.val() / max) * 100).toFixed(0);
          $muteInner.removeClass('drzVideo-vol-mute drzVideo-vol-min drzVideo-vol-med drzVideo-vol-max');
          let volClass = '';
          if (~~percent === 0) {
            // mute
            volClass = 'drzVideo-vol-mute';
            $muteTooltip.text('Unmute (m)');
          } else {
            $muteTooltip.text('Mute (m)');
          }
          if (percent > 0 && percent <= 30) {
            // min
            volClass = 'drzVideo-vol-min';
          }
          if (percent > 30 && percent <= 70) {
            // med
            volClass = 'drzVideo-vol-med';
          }
          if (percent > 70 && percent <= 100) {
            // max
            volClass = 'drzVideo-vol-max';
          }
          $muteInner.addClass(volClass);
        },
        lastVolume: null,
        isMuted: false,
        toggleMute(e, skipIcon) {
          if (e) {
            e.stopPropagation();
          }
          if (methods.isMuted) {
            $video.volume = methods.lastVolume;
            $volume.val(methods.lastVolume);
            $muteTooltip.text('Mute (m)');
            methods.isMuted = false;
          } else {
            methods.lastVolume = $volume.val();
            $video.volume = 0;
            $volume.val(0);
            $muteTooltip.text('Unmute (m)');
            methods.isMuted = true;
          }
          if (!skipIcon) {
            methods.setVolumeIcon();
          }
        },
        onButtonHover(e) {
          const $btn = $(e.target);
          const $btnTip = $btn.parent().prev('.drzVideo-btn-tooltip');
          if ($btnTip.length > 0) {
            const posCheck = methods.posCheck($progressBar, $btnTip);
            if (posCheck.bleeding) {
              $btnTip.css({
                left: `${50 - posCheck.diff}%`,
                transform: `translateX(${-50 - posCheck.diff}%)`,
              });
            }
          }
        },
        onButtoneLeave(e) {
          const $btn = $(e.target);
          const $btnTip = $btn.parent().prev('.drzVideo-btn-tooltip');
          if ($btnTip.length > 0) {
            $btnTip.css({
              left: '',
              transform: '',
            });
          }
        },
        toggleFullScreen(e) {
          if (e) {
            e.stopPropagation();
          }
          if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) ||
              (document.msFullscreenElement !== undefined &&
               document.msFullscreenElement === null) ||
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
        },
        fastForward(seconds) {
          $video.currentTime += seconds;
        },
        rewind(seconds) {
          $video.currentTime -= seconds;
        },
        onKeydown(e) {
          const code = e.key || e.which;
          // play
          if (code === 'p') {
            methods.togglePlay();
          }
          // mute
          if (code === 'm') {
            methods.toggleMute();
          }
          // fullscreen
          if (code === 'f') {
            methods.toggleFullScreen();
          }
          // ff seconds
          if (code === 'ArrowRight') {
            methods.fastForward(5);
          }
          // rewind totalSeconds
          if (code === 'ArrowLeft') {
            methods.rewind(5);
          }
        },
        fullscreenChecks() {
          const $tip = $fullScreenBtn.find('.drzVideo-btn-tooltip');
          const def = document.fullscreenElement;
          const ms = document.msFullscreenElement;
          const moz = document.mozFullScreen;
          const webkit = document.webkitIsFullScreen;
          if (def || ms || moz || webkit) {
            $tip.text('Exit full screen (f)');
          } else {
            $tip.text('Full screen (f)');
          }
        },
        bindFullScreenEvents() {
          document.addEventListener('fullscreenchange', methods.fullscreenChecks);
          document.addEventListener('mozfullscreenchange', methods.fullscreenChecks);
          document.addEventListener('webkitfullscreenchange', methods.fullscreenChecks);
          document.addEventListener('msfullscreenchange', methods.fullscreenChecks);
        },
        destroyFullScreenEvents() {
          document.removeEventListener('fullscreenchange', methods.fullscreenChecks);
          document.removeEventListener('mozfullscreenchange', methods.fullscreenChecks);
          document.removeEventListener('webkitfullscreenchange', methods.fullscreenChecks);
          document.removeEventListener('msfullscreenchange', methods.fullscreenChecks);
        },
        buildToolTips() {
          $playBtn.find('.drzVideo-btn-tooltip').text('Play (p)');
          $mute.find('.drzVideo-btn-tooltip').text('Mute (m)');
          $fullScreenBtn.find('.drzVideo-btn-tooltip').text('Full screen (f)');
        },
        onBuffer() {
          // here we can calculate and display the video buffer ghost
          // progress behind the timeline progress for better UX
          const duration = $video.duration;
          if (duration > 0) {
            for (let i = 0; i < $video.buffered.length; i++) {
              if ($video.buffered.start($video.buffered.length - 1 - i) < $video.currentTime) {
                const p = ($video.buffered.end($video.buffered.length - 1 - i) / duration) * 100;
                $bufferBar.css({ width: `${Math.floor(p)}%` });
                break;
              }
            }
          }
        },
      };

      // TODO storage and episodes
      // TODO test full screen on mobile
      // TODO test control toggle in mobile UX

      methods.setLoading(true);
      $video.addEventListener('loadeddata', methods.onVideoLoad);
      // bind the control toggling only once after clicking on video
      $video.addEventListener('progress', methods.onBuffer);
      $this.one('click', methods.toggleControls);
      methods.bindFullScreenEvents();
      methods.buildToolTips();
      $document.on('vmousedown', methods.onMouseDown);
      $document.on('vmouseup', methods.onMouseUp);
      $document.on('vmousemove', methods.onMouseMove);
      // need to stop propagation on the following
      $timeContainer.click(e => e.stopPropagation());
      $sliderContainer.click(e => e.stopPropagation());
      // attach callbacks on listeners
      $overlay.click(methods.togglePlay);
      $video.addEventListener('durationchange', methods.getTotalTime, false);
      $video.addEventListener('timeupdate', methods.updateTime, false);
      $video.addEventListener('ended', methods.setOverlay, false);
      $video.addEventListener('play', methods.onPlay, false);
      $video.addEventListener('pause', methods.onPause, false);
      $progressBar.on('vmousemove', methods.onProgressHover);
      $progressBar.on('vmouseout', methods.onProgressLeave);
      $progressBar.on('vmousedown', methods.setProgress);
      $controlBtn.on('vmouseover', methods.onButtonHover);
      $controlBtn.on('vmouseout', methods.onButtoneLeave);
      document.addEventListener('keydown', methods.onKeydown);
      $playBtn.click(methods.togglePlay);
      $volume.change(methods.setVolume);
      $volume.on('vmouseup', methods.volMouseUp);
      $mute.click(methods.toggleMute);
      $fullScreenBtn.click(methods.toggleFullScreen);
      methods.setVolumeIcon();

      // grab attached selectors and remove attached listeners
      $.fn.drzVideoPlayer.destroy = ($el) => {
        $el.off('click');
        $el.off('mouseleave');
        $el.off('vmousemove');
        $el.find('.drzVideo-videoTime').off('click');
        $el.find('.drzVideo-volSliderContainer').off('click');
        $el.find('.drzVideo-overlay').off('click');
        $el.find('.drzVideo-progressBar').off('vmousedown', methods.setProgress);
        $el.find('.drzVideo-progressBar').off('vmousemove', methods.onProgressHover);
        $el.find('.drzVideo-progressBar').off('vmouseout', methods.onProgressLeave);
        $el.find('.drzVideo-controls button').on('vmouseover', methods.onButtonHover);
        $el.find('.drzVideo-playBtn-inner').off('click');
        $el.find('.drzVideo-volSlider').off('change');
        $el.find('.drzVideo-volSlider').off('vmouseup', methods.volMouseUp);
        $el.find('.drzVideo-volBtn-inner').off('click');
        $el.find('.drzVideo-fullScreenBtn-inner').off('click');
        document.removeEventListener('keydown', methods.onKeydown);
        $document.off('vmousedown', methods.onMouseDown);
        $document.off('vmouseup', methods.onMouseUp);
        $document.off('vmousemove', methods.onMouseMove);
        const vidNode = $el.find('.drzVideo-src').get(0);
        vidNode.removeEventListener('loadeddata', methods.onVideoLoad);
        vidNode.removeEventListener('progress', methods.onBuffer);
        vidNode.removeEventListener('durationchange', methods.getTotalTime, false);
        vidNode.removeEventListener('timeupdate', methods.updateTime, false);
        vidNode.removeEventListener('ended', methods.setOverlay, false);
        vidNode.removeEventListener('play', methods.onPlay, false);
        vidNode.removeEventListener('pause', methods.onPause, false);
        const $ctrlBar = $el.find('.drzVideo-controlBar');
        $ctrlBar.off('vmouseover');
        $ctrlBar.off('mouseleave');
        methods.destroyFullScreenEvents();
      };
    });
    return this;
  };
})(jQuery);
