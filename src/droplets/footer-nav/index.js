import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('footer-nav-droplet', {
  template,
  name: 'footer-nav-droplet',
  mounted() {
    const $footerNav = $(this.$refs.footerNav);
    $footerNav.drzFooterNav();
  },
});
