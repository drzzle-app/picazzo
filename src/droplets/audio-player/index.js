import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('audio-player-droplet', {
  template,
  name: 'audio-player-droplet',
  mounted() {
    const $audioPlayer = $(this.$refs.audioPlayer);
    $audioPlayer.drzAudioPlayer();
  },
});
