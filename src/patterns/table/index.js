import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('flux-table', {
  template,
  name: 'flux-pattern',
  mounted() {
    $.fn.flux.responsiveTable({
      el: $(this.$refs.table),
    });
  },
});
