import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('tabs-left-droplet', {
  template,
  name: 'tabs-left-droplet',
  mounted() {
    setTimeout(() => {
      const $tabs = $(this.$refs.tabs);
      $tabs.drzTabs();
    }, 1000);
  },
});
