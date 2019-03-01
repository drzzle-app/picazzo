import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('navigation-droplet', {
  template,
  name: 'navigation-droplet',
  mounted() {
    setTimeout(() => {
      // init nav plugin
      const $navigation = $(this.$refs.navigation);
      $navigation.drzNav();
      // init search plugin (optional)
      $navigation.find('.drzNav-search-btn').drzModal();
      $navigation.find('.drzModal-search-bar').drzSiteSearch();
    }, 1000);
  },
});
