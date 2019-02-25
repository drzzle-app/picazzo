import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('carousel-droplet', {
  template,
  name: 'carousel-droplet',
  mounted() {
    // TODO listen for updated style
    setTimeout(() => {
      const $carousel = $(this.$refs.carousel);
      $carousel.drzCarousel();
    }, 1000);
  },
});
