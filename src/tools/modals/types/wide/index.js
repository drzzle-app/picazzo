import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('modal-wide-tool', {
  template,
  name: 'modal-wide-tool',
  mounted() {
    const $modal = $(this.$refs.modals).find('.drzModal-trigger');
    $modal.drzModal();
  },
});
