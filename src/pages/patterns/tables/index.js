import Vue from 'vue';
import Table from '@/patterns/table';
import TableTpl from '@/patterns/table/template.html';
import PatternControls from '@/layout/components/pattern-controls';

const template = require('./template.html');

export default Vue.component('tables', {
  template,
  name: 'tables',
  components: {
    Table,
    PatternControls,
  },
  data() {
    return {
      code: TableTpl,
    };
  },
});
