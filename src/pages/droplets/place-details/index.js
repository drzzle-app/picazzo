import Vue from 'vue';
import PlaceDetails from '@/droplets/place-details';
import PlaceDetailsTpl from '@/droplets/place-details/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('place-details-page', {
  template,
  name: 'place-details-page',
  mixins: [cleanDropletTpl],
  components: {
    PlaceDetails,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(PlaceDetailsTpl),
    };
  },
});
