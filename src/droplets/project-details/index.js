import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('project-details-droplet', {
  template,
  name: 'project-details-droplet',
  mounted() {
    const $droplet = $(this.$refs.imgGallery);
    $droplet.drzImageGallery();
  },
});
