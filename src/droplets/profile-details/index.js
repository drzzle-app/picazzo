import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('profile-details-droplet', {
  template,
  name: 'profile-details-droplet',
  mounted() {
    const $droplet = $(this.$refs.imgGallery);
    $droplet.drzImageGallery();
  },
});
