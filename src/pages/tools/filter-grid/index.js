import Vue from 'vue';
import FilterGrid from '@/tools/filter-grid';
import FilterTpl from '@/tools/filter-grid/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('filter-grid-page', {
  template,
  name: 'filter-grid-page',
  mixins: [cleanDropletTpl],
  components: {
    FilterGrid,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(FilterTpl),
    };
  },
});
