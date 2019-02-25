/*
=================================
 Drzzle Audio Player Plugin
=================================
*/
(($) => {
  $.fn.drzAudioPlayer = function drzAudioPlayer() {
    const $audioContainer = $(this);
    $audioContainer.each(function initPlayer() {
      const $this = $(this);
      const $audio = $this.find('.drzAudio-src').get(0);
      const $playBtn = $this.find('.drzAudio-playBtn');
      const $pauseBtn = $this.find('.drzAudio-pauseBtn');
      const $volume = $this.find('.drzAudio-volSlider');
      const $mute = $this.find('.drzAudio-muteBtn');
      const $progress = $this.find('.drzAudio-progress');
      const $progressBar = $this.find('.drzAudio-progressBar');
      const $timeElapsed = $this.find('.drzAudio-currentTime');
      const $totalTime = $this.find('.drzAudio-totalTime');

      // set time elapsed to 0 at first
      $timeElapsed.html('0:00');

      // prepare for any dynamically changed src
      $this.find('.drzAudio-src').load();

      // wait for the audio meta data to come in, then show total time
      const durChange = function durChange() {
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
      };

      // updates time of audio progress
      const timeUpdate = function timeUpdate() {
        const minutes = parseInt($audio.currentTime / 60, 10);
        let seconds = parseInt($audio.currentTime % 60, 10);
        let hours = parseInt(minutes / 60, 10);
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
        $progress.css('width', `${value}%`);
        $timeElapsed.html(hours + minutes + seconds);
      };

      // update progress for dragging on time bar
      function updateProgress(p) {
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
      }

      // enable the dragging events to update/change the audio time
      let progressDrag = false;
      const doc = $(document);
      $progressBar.on('vmousedown', (e) => {
        progressDrag = true;
        updateProgress(e.pageX);
      });

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

      function playAudio() {
        if ($audio.paused || $audio.ended) {
          $audio.play();
        }
      }

      function pauseAudio() {
        $audio.pause();
      }

      function setVolume() {
        $audio.volume = $volume.val();
      }

      function toggleMute() {
        $audio.muted = !$audio.muted;
        $mute.toggleClass('drzAudio-muteOff');
      }

      // attach listeners
      $audio.addEventListener('durationchange', durChange, false);
      $audio.addEventListener('timeupdate', timeUpdate, false);
      $playBtn.click(playAudio);
      $pauseBtn.click(pauseAudio);
      $volume.change(setVolume);
      $mute.click(toggleMute);

      $.fn.drzAudioPlayer.destroy = ($el) => {
        // grab attached selectors and remove attached listeners
        $el.find('.drzAudio-playBtn').off('click');
        $el.find('.drzAudio-pauseBtn').off('click');
        $el.find('.drzAudio-volSlider').off('change');
        $el.find('.drzAudio-muteBtn').off('click');
        $el.find('.drzAudio-progressBar').off('vmousedown');
        const audioNode = $el.find('.drzAudio-src').get(0);
        audioNode.removeEventListener('durationchange', durChange, false);
        audioNode.removeEventListener('timeupdate', timeUpdate, false);
      };
    });
    return this;
  };
})(jQuery);
