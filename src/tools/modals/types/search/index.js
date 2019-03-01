import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('modal-search-tool', {
  template,
  name: 'modal-search-tool',
  mounted() {
    const $modal = $(this.$refs.modals).find('.drzModal-trigger');
    $modal.drzModal();
  },
});
