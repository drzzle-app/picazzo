import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('load-more-tool', {
  template,
  name: 'load-more-tool',
  mounted() {
    const $loadMore = $(this.$refs.loadMore);
    $loadMore.initPlugin();
  },
});
