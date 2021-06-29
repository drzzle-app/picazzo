import Vue from 'vue';
import MediaItem from '@/droplets/media-item';
import MediaItemTpl from '@/droplets/media-item/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('media-item-page', {
  template,
  name: 'media-item-page',
  mixins: [cleanDropletTpl],
  components: {
    MediaItem,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(MediaItemTpl),
    };
  },
});
