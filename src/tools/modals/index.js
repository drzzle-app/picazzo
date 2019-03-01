import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('modal-default-tool', {
  template,
  name: 'modal-default-tool',
  mounted() {
    const $modal = $(this.$refs.modals).find('.drzModal-trigger');
    $modal.drzModal();
  },
});
