import Vue from 'vue';
import Columns from '@/droplets/columns';
import ColumnsTpl from '@/droplets/columns/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('columns-page', {
  template,
  name: 'columns-page',
  mixins: [cleanDropletTpl],
  components: {
    Columns,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ColumnsTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $row = $('.row');
$row.equalheights.destroy($row);`;
    },
  },
});
