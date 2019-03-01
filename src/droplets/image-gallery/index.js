import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('image-gallery-droplet', {
  template,
  name: 'image-gallery-droplet',
  mounted() {
    const $imageGallery = $(this.$refs.imageGallery);
    $imageGallery.drzImageGallery();
  },
});
