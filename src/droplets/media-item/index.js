import Vue from 'vue';
import AudioPlayer from '../audio-player';
import VideoPlayer from '../video-player';
import YouTubePlayer from '../youtube-player';
import Divider from '../divider';

const template = require('./template.html');

export default Vue.component('media-item-droplet', {
  template,
  name: 'media-item-droplet',
  components: {
    AudioPlayer,
    VideoPlayer,
    YouTubePlayer,
    Divider,
  },
  mounted() {
    const $audioPlayer = $(this.$refs.audioPlayer);
    $audioPlayer.drzAudioPlayer();
  },
});
