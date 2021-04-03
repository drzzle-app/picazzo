import Vue from 'vue';
import PlaceFeed from '@/droplets/place-feed';
import PlaceFeedTpl from '@/droplets/place-feed/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('place-feed-page', {
  template,
  name: 'place-feed-page',
  mixins: [cleanDropletTpl],
  components: {
    PlaceFeed,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(PlaceFeedTpl),
    };
  },
});
