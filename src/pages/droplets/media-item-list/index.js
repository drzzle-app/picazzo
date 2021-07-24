import Vue from 'vue';
import MediaItemList from '@/droplets/media-item-list';
import MediaItemListTpl from '@/droplets/media-item-list/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('media-item-list-page', {
  template,
  name: 'media-item-list-page',
  mixins: [cleanDropletTpl],
  components: {
    MediaItemList,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(MediaItemListTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $mediaItemList = $('.drzMediaItem-list');
$mediaItemList.drzLoadMore.destroy();`;
    },
  },
});
