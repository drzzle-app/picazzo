import Vue from 'vue';
import MediaItemFeed from '@/droplets/media-item-feed';
import MediaItemFeedTpl from '@/droplets/media-item-feed/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('media-item-feed-page', {
  template,
  name: 'media-item-feed-page',
  mixins: [cleanDropletTpl],
  components: {
    MediaItemFeed,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(MediaItemFeedTpl),
    };
  },
});
