import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('text-swapper-droplet', {
  template,
  name: 'text-swapper-droplet',
  mounted() {
    const $textSwapper = $(this.$refs.textSwapper);
    $(document).ready(() => {
      setTimeout(() => {
        $textSwapper.drzTextSwapper();
      }, 1000);
    });
  },
});
