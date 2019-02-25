import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('google-map-droplet', {
  template,
  name: 'google-map-droplet',
  mounted() {
    setTimeout(() => {
      const $googleMap = $(this.$refs.googleMap);
      $googleMap.drzMap();
    }, 1000);
  },
});
