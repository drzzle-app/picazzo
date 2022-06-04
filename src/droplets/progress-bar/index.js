import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('progress-bar-droplet', {
  template,
  name: 'progress-bar-droplet',
  mounted() {
    $(document).ready(() => {
      setTimeout(() => {
        const $progressBar = $(this.$refs.progressBar);
        $progressBar.drzProgressBar({
          progress: '$50',
          total: '$100',
        });
      }, 1000);
    });
  },
});
