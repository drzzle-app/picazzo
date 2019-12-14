import Vue from 'vue';
import VideoEpisodes from '@/droplets/video-episodes';
import VideoEpisodesTpl from '@/droplets/video-episodes/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('video-episodes-page', {
  template,
  name: 'video-episodes-page',
  mixins: [cleanDropletTpl],
  components: {
    VideoEpisodes,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(VideoEpisodesTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $videoPlayer = $('.drzVideo');
$videoPlayer.drzVideoPlayer.destroy($videoPlayer);`;
    },
  },
});
