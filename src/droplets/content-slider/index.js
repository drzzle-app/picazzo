import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('content-slider-droplet', {
  template,
  name: 'content-slider-droplet',
  mounted() {
    setTimeout(() => {
      const $contentSlider = $(this.$refs.contentSlider);
      $contentSlider.drzContentSlider();
    }, 1000);
  },
});
