import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('modal-announcement-tool', {
  template,
  name: 'modal-announcement-tool',
  mounted() {
    const $modal = $(this.$refs.modals).find('.drzModal-trigger');
    $modal.drzModal();
  },
});
