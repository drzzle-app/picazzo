import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('picazzo-table', {
  template,
  name: 'picazzo-table',
  mounted() {
    $.fn.picazzo.responsiveTable({
      el: $(this.$refs.table),
    });
  },
});
