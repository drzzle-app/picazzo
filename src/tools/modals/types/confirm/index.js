import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('modal-confirm-tool', {
  template,
  name: 'modal-confirm-tool',
  mounted() {
    const $modal = $(this.$refs.modals).find('.drzModal-trigger');
    $modal.drzModal();
  },
});
