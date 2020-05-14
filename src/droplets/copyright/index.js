import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('copyright-droplet', {
  template,
  name: 'copyright-droplet',
  mounted() {
    const $copyright = $(this.$refs.copyright);
    $copyright.drzCopyright();
  },
});
