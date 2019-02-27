import Vue from 'vue';
import YouTube from '@/droplets/youtube-player';
import YouTubeTpl from '@/droplets/youtube-player/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('youtube-player-page', {
  template,
  name: 'youtube-player-page',
  mixins: [cleanDropletTpl],
  components: {
    YouTube,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(YouTubeTpl),
    };
  },
});
