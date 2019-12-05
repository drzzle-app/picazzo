import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('audio-episodes-droplet', {
  template,
  name: 'audio-episodes-droplet',
  mounted() {
    const $audioEpisodes = $(this.$refs.audioEpisodes);
    $audioEpisodes.drzAudioPlayer();
  },
});
