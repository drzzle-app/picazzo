import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('video-player-droplet', {
  template,
  name: 'video-player-droplet',
  mounted() {
    const $videoPlayer = $(this.$refs.videoPlayer);
    $videoPlayer.drzVideoPlayer({
      thumbnail: true,
    });
  },
});
