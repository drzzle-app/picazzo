import Vue from 'vue';
import Table from '@/droplets/table';
import TableTpl from '@/droplets/table/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('table-page', {
  template,
  name: 'table-page',
  mixins: [cleanDropletTpl],
  components: {
    Table,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(TableTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $table = $('.drzTable');
$table.responsiveTables.destroy($table);`;
    },
  },
});
