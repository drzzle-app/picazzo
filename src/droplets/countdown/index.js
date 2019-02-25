import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('countdown-droplet', {
  template,
  name: 'countdown-droplet',
  mounted() {
    const $countdown = $(this.$refs.countdown);
    $countdown.drzCountDown();
  },
});
