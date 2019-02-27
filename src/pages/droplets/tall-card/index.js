import Vue from 'vue';
import TallCard from '@/droplets/tall-card';
import TallCardTpl from '@/droplets/tall-card/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('tall-card-page', {
  template,
  name: 'tall-card-page',
  mixins: [cleanDropletTpl],
  components: {
    TallCard,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(TallCardTpl),
    };
  },
});
