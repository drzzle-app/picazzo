import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('filter-tool', {
  template,
  name: 'filter-tool',
  mounted() {
    const $filter = $(this.$refs.filter);
    $filter.sortFilter();
  },
});
