import Vue from 'vue';
import PlaceGrid from '@/droplets/place-grid';
import PlaceGridTpl from '@/droplets/place-grid/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('place-grid-page', {
  template,
  name: 'place-grid-page',
  mixins: [cleanDropletTpl],
  components: {
    PlaceGrid,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(PlaceGridTpl),
    };
  },
});
