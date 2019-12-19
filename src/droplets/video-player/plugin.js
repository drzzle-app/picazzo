/*
============================
 Drzzle Video Plugin
============================
*/
(($) => {
  $.fn.drzVideoPlayer = function drzVideoPlayer() {
    const $videoContainer = $(this);
    const $document = $(document);
    const $id = $videoContainer.attr('data-player-id');
    const episodes = $videoContainer.attr('data-episodes');
    // register local storage
    const drzzleStorage = window.localStorage.getItem('drzzleStorage');
    const storage = drzzleStorage ? JSON.parse(drzzleStorage) : {};
    storage.videoPlayer = storage.videoPlayer || {};
    $videoContainer.each(function initPlayer() {
      const $this = $(this);
      const $videoTag = $this.find('.drzVideo-src');
      const $video = $videoTag.get(0);
      const $sourceTag = $videoTag.find('source');
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
      const $initialSource = $sourceTag.attr('src');
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
          methods.$errorEl.hide();
          if (loading) {
            $overlay.addClass('drzVideo-loading');
            $overlayPlayBtn.hide();
            // fallback errors for issues when video can't load
            methods.loadTimeout = setTimeout(methods.onLoadTimeout, 20000);
          } else {
            $overlay.removeClass('drzVideo-loading');
            $overlayPlayBtn.show();
            if (methods.loadTimeout) {
              clearTimeout(methods.loadTimeout);
            }
          }
        },
        loadTimeout: null,
        onLoadTimeout() {
          methods.$errorEl.text('There was an issue loading video.');
          methods.$errorEl.show();
          // kill loader
          $overlayPlayBtn.hide();
          $overlay.removeClass('drzVideo-loading');
          methods.loading = false;
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
        onTimeUpdate() {
          const minutes = parseInt($video.currentTime / 60, 10);
          let seconds = parseInt($video.currentTime % 60, 10);
          let hours = parseInt(minutes / 60, 10);
          // update local storage with new location
          const ct = parseInt($video.currentTime.toFixed(0), 10);
          const st = parseInt(storage.videoPlayer[$id].seconds, 10);
          if (ct !== 0 && ct !== st) {
            storage.videoPlayer[$id].seconds = ct;
            window.localStorage.setItem('drzzleStorage', JSON.stringify(storage));
          }
          let value = 0;
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
        onEnded() {
          $overlay.css('opacity', 1);
          if (!$overlayPlayBtn.is(':visible')) {
            $overlayPlayBtn.show();
          }
          $overlayPlayBtn.addClass('drzVideo-replayBtn');
          $playBtn.find('.drzVideo-playBtn-inner')
            .removeClass('drzVideo-play-icon drzVideo-pause-icon')
            .addClass('drzVideo-replayBtn');
          $playBtn.find('.drzVideo-btn-tooltip').text('Replay (p)');
          if (episodes) {
            const src = $sourceTag.attr('src');
            const $item = methods.$listContainer.find(`[data-video-src="${src}"]`);
            $item.find('.drzVideo-episodes-rcol').removeClass('drzVideo-playing');
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
          if (!methods.isIOS() && $controlsContainer.hasClass('drzVide-slideDown')) {
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
          if (!methods.isIOS()) {
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
        offHover() {
          if (!methods.isIOS()) {
            clearTimeout(methods.hideControls);
            if (!$controlsContainer.hasClass('drzVide-slideDown')) {
              $controlsContainer.addClass('drzVide-slideDown');
              $progress.addClass('drzVideo-soloProgress');
              $progressBar.addClass('drzVideo-soloProgress');
            }
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
          $overlayPlayBtn.removeClass('drzVideo-replayBtn');
          if ($overlayPlayBtn.is(':visible')) {
            $overlayPlayBtn.hide();
          }
          $playBtn.find('.drzVideo-playBtn-inner')
            .removeClass('drzVideo-play-icon drzVideo-replayBtn')
            .addClass('drzVideo-pause-icon');
          $playBtn.find('.drzVideo-btn-tooltip').text('Pause (p)');

          // we need to store the last source being played in localStorage
          // in case the page crashed, you can start where you left off
          const source = $videoTag.find('source').attr('src');
          storage.videoPlayer[$id].source = source;
          if (episodes) {
            const $liveBtn = methods.$listContainer.find('.drzVideo-episodes-livebtn');
            $liveBtn.parent().addClass('drzVideo-playing');
          }
        },
        onPause() {
          $playBtn.find('.drzVideo-playBtn-inner')
            .removeClass('drzVideo-pause-icon drzVideo-replayBtn')
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
          if (episodes) {
            const src = $sourceTag.attr('src');
            const $item = methods.$listContainer.find(`[data-video-src="${src}"]`);
            $item.find('.drzVideo-episodes-rcol').removeClass('drzVideo-playing');
          }
        },
        togglePlay(e) {
          if (!methods.loading) {
            if ($playBtn.find('.drzVideo-playBtn-inner').hasClass('drzVideo-play-icon') ||
                $playBtn.find('.drzVideo-playBtn-inner').hasClass('drzVideo-replayBtn')) {
              methods.playVideo(e);
            } else {
              methods.pauseVideo(e);
            }
          }
          if (methods.$errorEl) {
            methods.$errorEl.hide();
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
        fastForward(seconds) {
          $video.currentTime += seconds;
        },
        rewind(seconds) {
          $video.currentTime -= seconds;
        },
        onKeydown(e) {
          const bodyPress = e.target.tagName === 'BODY';
          const code = e.key || e.which;
          // play
          if (bodyPress && code === 'p') {
            methods.togglePlay();
          }
          // mute
          if (bodyPress && code === 'm') {
            methods.toggleMute();
          }
          // fullscreen
          if (bodyPress && code === 'f') {
            methods.toggleFullScreen();
          }
          // ff seconds
          if (bodyPress && code === 'ArrowRight') {
            methods.fastForward(5);
          }
          // rewind totalSeconds
          if (bodyPress && code === 'ArrowLeft') {
            methods.rewind(5);
          }
        },
        isFullScreen: false,
        toggleFullScreen(e) {
          methods.isFullScreen = !methods.isFullScreen;
          if (e) {
            e.stopPropagation();
          }
          // iphone / IOS
          if (methods.isIOS()) {
            $video.webkitEnterFullscreen();
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
        $listContainer: null,
        showPlaying() {
          const currentSource = $sourceTag.attr('src');
          methods.$listContainer.find('[data-video-src]').each(function src() {
            const $item = $(this);
            const $col = $item.find('.drzVideo-episodes-rcol');
            $col.removeClass('drzVideo-playing');
            const $btn = $item.find('.drzVideo-episodes-plbtn');
            if ($item.attr('data-video-src') === currentSource) {
              $btn.addClass('drzVideo-episodes-livebtn');
            } else {
              $btn.removeClass('drzVideo-episodes-livebtn');
            }
          });
        },
        onClickTrack(e) {
          e.preventDefault();
          if (!methods.loading) {
            methods.setLoading(true);
            $videoContainer.drzVideoPlayer.destroy($videoContainer, 'play');
            // remove local storage for this particular video player
            delete storage.videoPlayer[$id];
            window.localStorage.setItem('drzzleStorage', JSON.stringify(storage));
            // replace video source
            const $link = $(e.target).closest('[data-video-src]');
            const $newSource = $link.attr('data-video-src');
            $sourceTag.attr('src', $newSource);
            const newVideo = document.createElement('video');
            newVideo.src = $newSource;
            if (methods.isIOS()) {
              newVideo.autoplay = true;
            }
            // once new track is loaded, reinit the video plugin
            newVideo.onloadeddata = () => {
              newVideo.pause();
              newVideo.remove();
              // reinit video plugin and start
              $videoContainer.drzVideoPlayer();
              methods.setLoading(false);
              methods.showPlaying();
              if (!methods.isIOS()) {
                $this.trigger('click');
                methods.togglePlay();
              }
            };
          }
        },
        buildEpisodes() {
          const list = JSON.parse(episodes).list;
          const listEl = $videoContainer.next('.drzVideo-episodes-container');
          if (!listEl.length) {
            const $listWrapper = $('<div class="drzVideo-episodes-container"></div>');
            list.forEach((item) => {
              const $link = $(
                `<a class="drzVideo-episodes-item" data-video-src="${item.source}" href="#">
                  <div class="drzVideo-episodes-data">
                    <span class="drzVideo-episodes-title">${item.title}</span>
                    <span class="drzVideo-episodes-date">Published - ${item.published}</span>
                  </div>
                  <div class="drzVideo-episodes-rcol">
                    <span class="drzVideo-episode-playing"></span>
                    <span class="drzVideo-episodes-plbtn"></span>
                  </div>
                </a>`,
              );
              $link.click(methods.onClickTrack);
              $listWrapper.append($link);
              $listWrapper.insertAfter($videoContainer);
            });
            methods.$listContainer = $listWrapper;
          } else {
            methods.$listContainer = listEl;
          }
        },
        isIOS() {
          return /iPad|iPhone|iPod/.test(navigator.userAgent);
        },
        iosChecks() {
          if (methods.isIOS()) {
            $mute.hide();
            $sliderContainer.hide();
          }
        },
        $errorEl: null,
        addErrorMessage() {
          const $msg = $overlay.find('.drzVideo-error-message');
          if (!$msg.length) {
            const $newMsg = $('<div class="drzVideo-error-message"></div>');
            $overlay.append($newMsg);
            methods.$errorEl = $newMsg;
          } else {
            methods.$errorEl = $msg;
          }
        },
      };

      if (methods.isIOS()) {
        // this is needed to disable the auto
        // full screen IOS fires on default
        $videoTag.attr('playsinline', true);
        // we can patentially add the default controls
        // for ios video if this player becomes to
        // difficult to do
      }

      methods.addErrorMessage();
      $playBtn.find('.drzVideo-playBtn-inner').addClass('drzVideo-play-icon');
      // methods.setLoading(true);
      // $video.addEventListener('loadeddata', methods.onVideoLoad);
      // if audio was in progress, set time
      const previousData = storage.videoPlayer[$id];
      if (previousData) {
        // if a there is a single source only and there is a time in storage, only
        // set if the source's are the same. this will prevent new sources from starting
        // in random times from a previous session
        if (!episodes && previousData.source === $initialSource) {
          methods.setLoading(true);
          const newVideo = document.createElement('video');
          newVideo.src = $initialSource;
          if (methods.isIOS()) {
            newVideo.autoplay = true;
          }
          newVideo.onloadeddata = () => {
            newVideo.pause();
            newVideo.remove();
            $video.currentTime = previousData.seconds;
            methods.setLoading(false);
          };
        }

        if (episodes) {
          // here we can switch between source files if there are multiple sources and the last
          // one being listened to is still in the list
          const sources = JSON.parse(episodes).list;
          const list = sources.map(item => item.source);
          if (list.includes(previousData.source)) {
            methods.setLoading(true);
            $sourceTag.attr('src', previousData.source);
            const newVideo = document.createElement('video');
            newVideo.src = previousData.source;
            if (methods.isIOS()) {
              newVideo.autoplay = true;
            }
            newVideo.onloadeddata = () => {
              newVideo.pause();
              newVideo.remove();
              $video.currentTime = previousData.seconds;
              methods.setLoading(false);
            };
          }
        }
      } else {
        storage.videoPlayer[$id] = { source: null, seconds: 0 };
      }

      methods.iosChecks();
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
      $video.addEventListener('timeupdate', methods.onTimeUpdate, false);
      $video.addEventListener('ended', methods.onEnded, false);
      $video.addEventListener('play', methods.onPlay, false);
      $video.addEventListener('pause', methods.onPause, false);
      $progressBar.on('vmousemove', methods.onProgressHover);
      $progressBar.on('vmouseout', methods.onProgressLeave);
      $progressBar.on('vmousedown', methods.setProgress);
      $controlBtn.on('vmouseover', methods.onButtonHover);
      $controlBtn.on('vmouseout', methods.onButtoneLeave);
      document.addEventListener('keydown', methods.onKeydown);
      $playBtn.on('click', methods.togglePlay);
      $volume.change(methods.setVolume);
      $volume.on('vmouseup', methods.volMouseUp);
      $mute.click(methods.toggleMute);
      $fullScreenBtn.click(methods.toggleFullScreen);
      methods.setVolumeIcon();

      if (episodes) {
        methods.buildEpisodes();
        methods.showPlaying();
      }

      // grab attached selectors and remove attached listeners
      $.fn.drzVideoPlayer.destroy = ($el, call) => {
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
        $el.find('.drzVideo-playBtn-inner').off('click').removeClass('drzVideo-pause-icon drzVideo-play-icon');
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
        vidNode.removeEventListener('timeupdate', methods.onTimeUpdate, false);
        vidNode.removeEventListener('ended', methods.onEnded, false);
        vidNode.removeEventListener('play', methods.onPlay, false);
        vidNode.removeEventListener('pause', methods.onPause, false);
        const $ctrlBar = $el.find('.drzVideo-controlBar');
        $ctrlBar.off('vmouseover');
        $ctrlBar.off('mouseleave');
        methods.destroyFullScreenEvents();
        // remove all playlist items if in editor only
        if (window.__editor && !call) {
          $el.next('.drzVideo-episodes-container').remove();
        }
      };
    });
    return this;
  };
})(jQuery);
