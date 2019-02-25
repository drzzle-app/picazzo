import Vue from 'vue';
import GoogleMap from '@/droplets/google-map';
import GoogleMapTpl from '@/droplets/google-map/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('google-map-page', {
  template,
  name: 'google-map-page',
  mixins: [cleanDropletTpl],
  components: {
    GoogleMap,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(GoogleMapTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $map = $('.drzMap');
$map.drzMap.destroy($map);`;
    },
  },
});
