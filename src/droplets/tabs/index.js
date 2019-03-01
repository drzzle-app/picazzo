import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('tabs-droplet', {
  template,
  name: 'tabs-droplet',
  mounted() {
    setTimeout(() => {
      const $tabs = $(this.$refs.tabs);
      $tabs.drzTabs();
    }, 1000);
  },
});
