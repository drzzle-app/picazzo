import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('video-episodes-droplet', {
  template,
  name: 'video-episodes-droplet',
  mounted() {
    const $videoPlayer = $(this.$refs.videoPlayer);
    $videoPlayer.drzVideoPlayer();
  },
});
