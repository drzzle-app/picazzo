import Vue from 'vue';
import Grid from '@/droplets/grid';
import GridTpl from '@/droplets/grid/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('grid', {
  template,
  name: 'grid',
  mixins: [cleanDropletTpl],
  components: {
    Grid,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(GridTpl),
    };
  },
});
