import Vue from 'vue';
import VideoPlayer from '@/droplets/video-player';
import VideoPlayerTpl from '@/droplets/video-player/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('video-player-page', {
  template,
  name: 'video-player-page',
  mixins: [cleanDropletTpl],
  components: {
    VideoPlayer,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(VideoPlayerTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $videoPlayer = $('.drzVideo');
$videoPlayer.drzVideoPlayer.destroy($videoPlayer);`;
    },
  },
});
