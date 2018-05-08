import Vue from 'vue';
import Table from '@/patterns/table';

const template = require('./template.html');

export default Vue.component('tables', {
  template,
  name: 'tables',
  components: {
    Table,
  },
});
