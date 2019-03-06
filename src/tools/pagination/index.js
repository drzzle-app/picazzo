import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('pagination-tool', {
  template,
  name: 'pagination-tool',
  mounted() {
    $(this.$refs.paginate).drzPagination();
  },
});
