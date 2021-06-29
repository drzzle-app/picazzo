import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('youtube-player-droplet', {
  template,
  name: 'youtube-player-droplet',
  props: {
    height: {
      type: String,
      default: '315',
    },
    width: {
      type: String,
      default: '420',
    },
  },
});
