/*
=================================
 Drzzle Audio Player Plugin
=================================
*/
(($) => {
  $.fn.drzAudioPlayer = function drzAudioPlayer() {
    const $document = $(document);
    const $audioContainer = $(this);
    const $id = $audioContainer.attr('data-player-id');
    const episodes = $audioContainer.attr('data-episodes');
    // register local storage
    const drzzleStorage = window.localStorage.getItem('drzzleStorage');
    const storage = drzzleStorage ? JSON.parse(drzzleStorage) : {};
    storage.audioPlayer = storage.audioPlayer || {};
    $audioContainer.each(function initPlayer() {
      const $this = $(this);
      const $audioTag = $this.find('.drzAudio-src');
      const $audio = $audioTag.get(0);
      const $title = $this.find('.drzAudio-titleContainer');
      const $playContainer = $this.find('.playBtnContainer');
      const $playBtn = $this.find('.drzAudio-playBtn');
      const $pauseBtn = $this.find('.drzAudio-pauseBtn');
      const $volToggle = $this.find('.drzAudio-volumeBtn');
      const $volContainer = $this.find('.drzAudio-volumeContainer');
      const $floatingVol = $this.find('.drzAudio-volumeSliderContainer');
      const $volume = $this.find('.drzAudio-volSlider');
      const $mute = $this.find('.drzAudio-muteBtn');
      const $progress = $this.find('.drzAudio-progress');
      const $progressBar = $this.find('.drzAudio-progressBar');
      const $timeElapsed = $this.find('.drzAudio-currentTime');
      const $totalTime = $this.find('.drzAudio-totalTime');
      const $sourceTag = $audioTag.find('source');
      const $initialSource = $sourceTag.attr('src');
      let loading = false;

      // set time elapsed to 0 at first
      $timeElapsed.html('0:00');

      // prepare for any dynamically changed src
      $this.find('.drzAudio-src').load();

      const methods = {
        onDurationChange() {
          // wait for the audio meta data to come in, then show total time
          const totalMinutes = parseInt($audio.duration / 60, 10);
          let totalHours = parseInt(totalMinutes / 60, 10);
          let totalSeconds = parseInt($audio.duration % 60, 10);
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
        },
        onTimeUpdate() {
          // updates time of audio progress
          const minutes = parseInt($audio.currentTime / 60, 10);
          let seconds = parseInt($audio.currentTime % 60, 10);
          let hours = parseInt(minutes / 60, 10);
          const ct = parseInt($audio.currentTime.toFixed(0), 10);
          const st = parseInt(storage.audioPlayer[$id].seconds, 10);
          if (ct !== 0 && ct !== st) {
            storage.audioPlayer[$id].seconds = ct;
            window.localStorage.setItem('drzzleStorage', JSON.stringify(storage));
          }
          let value = 0;
          if ($audio.currentTime > 0) {
            value = Math.floor((100 / $audio.duration) * $audio.currentTime);
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
          $progress.css('width', `${value === 99 ? value + 1 : value}%`);
          $timeElapsed.html(hours + minutes + seconds);
        },
        updateProgress(p) {
          // update progress for dragging on time bar
          const dur = $audio.duration;
          const pos = p - $progressBar.offset().left;
          let perc = 100 * (pos / $progressBar.width());
          if (perc > 100) {
            perc = 100;
          }
          if (perc < 0) {
            perc = 0;
          }
          $audio.currentTime = dur * (perc / 100);
          $progress.css('width', `${perc}%`);
        },
        progressDrag: false,
        playAudio() {
          if ($audio.paused || $audio.ended) {
            $audio.play();
          }
        },
        pauseAudio() {
          $audio.pause();
        },
        setVolume() {
          $audio.volume = $volume.val();
        },
        toggleMute() {
          $audio.muted = !$audio.muted;
          $mute.toggleClass('drzAudio-muteOff');
        },
        togglePlay() {
          if (!$playBtn.hasClass('drzAudio-pauseBtn')) {
            methods.playAudio();
          } else {
            methods.pauseAudio();
          }
        },
        onPlay() {
          $playBtn.addClass('drzAudio-pauseBtn');
          $playBtn.removeClass('drzAudio-replayBtn');
          // we need to store the last source being played in localStorage
          // in case the page crashed, you can start where you left off
          const source = $audioTag.find('source').attr('src');
          storage.audioPlayer[$id].source = source;
          if (episodes) {
            const $liveBtn = methods.$listContainer.find('.drzAudio-episodes-livebtn');
            $liveBtn.parent().addClass('drzAudio-playing');
          }
        },
        onEnd() {
          $playBtn.removeClass('drzAudio-pauseBtn');
          $playBtn.addClass('drzAudio-replayBtn');
          if (episodes) {
            const src = $sourceTag.attr('src');
            const $item = methods.$listContainer.find(`[data-audio-src="${src}"]`);
            $item.find('.drzAudio-episodes-rcol').removeClass('drzAudio-playing');
          }
        },
        onPause() {
          $playBtn.removeClass('drzAudio-pauseBtn');
          $playBtn.removeClass('drzAudio-replayBtn');
          if (episodes) {
            const src = $sourceTag.attr('src');
            const $item = methods.$listContainer.find(`[data-audio-src="${src}"]`);
            $item.find('.drzAudio-episodes-rcol').removeClass('drzAudio-playing');
          }
        },
        setLoading(isLoading) {
          if (isLoading) {
            loading = true;
            $playBtn.hide();
            $pauseBtn.hide();
            methods.$loader.show();
          } else {
            loading = false;
            $playBtn.show();
            $pauseBtn.show();
            methods.$loader.hide();
          }
        },
        hideVolume() {
          $floatingVol.fadeOut('fast');
        },
        toggleVolume() {
          $floatingVol.fadeToggle('fast');
        },
        $listContainer: null,
        showPlaying() {
          const currentSource = $sourceTag.attr('src');
          methods.$listContainer.find('[data-audio-src]').each(function src() {
            const $item = $(this);
            const $col = $item.find('.drzAudio-episodes-rcol');
            $col.removeClass('drzAudio-playing');
            const $btn = $item.find('.drzAudio-episodes-plbtn');
            if ($item.attr('data-audio-src') === currentSource) {
              $btn.addClass('drzAudio-episodes-livebtn');
            } else {
              $btn.removeClass('drzAudio-episodes-livebtn');
            }
          });
        },
        onClickTrack(e) {
          e.preventDefault();
          if (!loading) {
            methods.setLoading(true);
            $audioContainer.drzAudioPlayer.destroy($audioContainer, 'play');
            // remove local storage for this particular audio player
            delete storage.audioPlayer[$id];
            window.localStorage.setItem('drzzleStorage', JSON.stringify(storage));
            // replace audio source
            const $link = $(e.target).closest('[data-audio-src]');
            const $newSource = $link.attr('data-audio-src');
            const trackTitle = $link.find('.drzAudio-episodes-title').text();
            $sourceTag.attr('src', $newSource);
            // once new track is loaded, reinit the audio plugin
            const clickedTrack = new Audio($newSource);
            clickedTrack.onloadeddata = () => {
              // reinit audio plugin and start
              $audioContainer.drzAudioPlayer();
              $title.text(trackTitle);
              methods.showPlaying();
              methods.togglePlay();
              methods.setLoading(false);
            };
          }
        },
        buildEpisodes() {
          const list = JSON.parse(episodes).list;
          const listEl = $audioContainer.next('.drzAudio-episodes-container');
          if (!listEl.length) {
            const $listWrapper = $('<div class="drzAudio-episodes-container"></div>');
            list.forEach((item) => {
              const $link = $(
                `<a class="drzAudio-episodes-item" data-audio-src="${item.source}" href="#">
                  <div class="drzAudio-episodes-data">
                    <span class="drzAudio-episodes-title">${item.title}</span>
                    <span class="drzAudio-episodes-date">Published - ${item.published}</span>
                  </div>
                  <div class="drzAudio-episodes-rcol">
                    <svg class="drzAudio-episodes-eq" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <rect class="drzAudio-episodes-eqbar drzAudio-eq-bar1" x="4" y="4" width="3.7" height="8"/>
                      <rect class="drzAudio-episodes-eqbar drzAudio-eq-bar2" x="10.2" y="4" width="3.7" height="16"/>
                      <rect class="drzAudio-episodes-eqbar drzAudio-eq-bar3" x="16.3" y="4" width="3.7" height="11"/>
                    </svg>
                    <span class="drzAudio-episodes-plbtn"></span>
                  </div>
                </a>`,
              );
              $link.click(methods.onClickTrack);
              $listWrapper.append($link);
              $listWrapper.insertAfter($audioContainer);
            });
            methods.$listContainer = $listWrapper;
          } else {
            methods.$listContainer = listEl;
          }
        },
        onProgressPress(e) {
          methods.progressDrag = true;
          methods.updateProgress(e.pageX);
        },
        onMouseUp(e) {
          if (methods.progressDrag) {
            methods.progressDrag = false;
            methods.updateProgress(e.pageX);
          }
        },
        onMouseMove(e) {
          if (methods.progressDrag) {
            methods.updateProgress(e.pageX);
          }
        },
        $loader: null,
        createLoader() {
          const $loader = $playContainer.find('.drzAudio-loader');
          if (!$loader.length) {
            const $newLoader = $(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" class="drzAudio-loader">
                <g fill="none" fill-rule="evenodd">
                  <g transform="translate(1 1)" stroke-width="2">
                    <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                    <path d="M36 18c0-9.94-8.06-18-18-18" transform="rotate(356.81 18.0001 18.0001)">
                      <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
                    </path>
                  </g>
                </g>
              </svg>
            `);
            $newLoader.insertBefore($playBtn);
            methods.$loader = $newLoader;
          } else {
            methods.$loader = $loader;
          }
        },
      };
      // setup loader
      methods.createLoader();

      // if audio was in progress, set time
      const previousData = storage.audioPlayer[$id];
      if (previousData) {
        // if a there is a single source only and there is a time in storage, only
        // set if the source's are the same. this will prevent new sources from starting
        // in random times from a previous session
        if (!episodes && previousData.source === $initialSource) {
          methods.setLoading(true);
          const initAudio = new Audio(previousData.source);
          initAudio.onloadeddata = () => {
            $audio.currentTime = previousData.seconds;
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
            const initAudio = new Audio(previousData.source);
            initAudio.onloadeddata = () => {
              $audio.currentTime = previousData.seconds;
              const track = sources.find(item => item.source === previousData.source);
              $title.text(track.title);
              methods.setLoading(false);
            };
          }
        }
      } else {
        storage.audioPlayer[$id] = { source: null, seconds: 0 };
      }

      // attach listeners
      $audio.addEventListener('durationchange', methods.onDurationChange, false);
      $audio.addEventListener('timeupdate', methods.onTimeUpdate, false);
      $audio.addEventListener('play', methods.onPlay, false);
      $audio.addEventListener('ended', methods.onEnd, false);
      $audio.addEventListener('pause', methods.onPause, false);
      $this.click(methods.hideVolume);
      $playBtn.click(methods.togglePlay);
      $volToggle.click(methods.toggleVolume);
      $pauseBtn.click(methods.pauseAudio);
      $volContainer.click((e) => {
        e.stopPropagation();
      });
      $volume.change(methods.setVolume);
      $mute.click(methods.toggleMute);
      // enable the dragging events to update / change the audio time
      $progressBar.on('vmousedown', methods.onProgressPress);
      $document.on('vmouseup', methods.onMouseUp);
      $document.on('vmousemove', methods.onMouseMove);

      if (episodes) {
        methods.buildEpisodes();
        methods.showPlaying();
      }

      $.fn.drzAudioPlayer.destroy = ($el, call) => {
        // grab attached selectors and remove attached listeners
        $el.find('.drzAudio-playBtn').off('click').removeClass('drzAudio-pauseBtn drzAudio-replayBtn');
        $el.find('.drzAudio-pauseBtn').off('click');
        $el.find('.drzAudio-volSlider').off('change');
        $el.find('.drzAudio-muteBtn').off('click');
        $el.find('.drzAudio-progressBar').off('vmousedown');
        $el.find('.drzAudio-volumeBtn').off('click');
        $document.off('vmouseup', methods.onMouseUp);
        $document.off('vmousemove', methods.onMouseMove);
        $this.off('click');
        // remove all playlist items if in editor only
        if (window.__editor && !call) {
          $el.next('.drzAudio-episodes-container').remove();
        }
        const audioNode = $el.find('.drzAudio-src').get(0);
        audioNode.removeEventListener('durationchange', methods.onDurationChange, false);
        audioNode.removeEventListener('timeupdate', methods.onTimeUpdate, false);
        audioNode.removeEventListener('play', methods.onPlay, false);
        audioNode.removeEventListener('ended', methods.onEnd, false);
        audioNode.removeEventListener('pause', methods.onPause, false);
      };
    });
    return this;
  };
})(jQuery);
