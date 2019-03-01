import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('table-droplet', {
  template,
  name: 'table-droplet',
  mounted() {
    const $table = $(this.$refs.table);
    $table.responsiveTables();
  },
});
