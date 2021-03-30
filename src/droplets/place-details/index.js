import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('place-details-droplet', {
  template,
  name: 'place-details-droplet',
  mounted() {
    const $droplet = $(this.$refs.imgGallery);
    $droplet.drzImageGallery();
  },
});
