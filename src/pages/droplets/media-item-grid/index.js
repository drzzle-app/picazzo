import Vue from 'vue';
import MediaItemGrid from '@/droplets/media-item-grid';
import MediaItemGridTpl from '@/droplets/media-item-grid/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('media-item-grid-page', {
  template,
  name: 'media-item-grid-page',
  mixins: [cleanDropletTpl],
  components: {
    MediaItemGrid,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(MediaItemGridTpl),
    };
  },
});
