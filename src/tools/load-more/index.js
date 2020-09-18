import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('load-more-tool', {
  template,
  name: 'load-more-tool',
  mounted() {
    const $loadMore = $(this.$refs.loadMore);
    $loadMore.drzLoadMore({
      visible: 2,
      assets: 'src',
      classes: {
        show: 'drzLoadMore-item-show',
        img: 'drzLoadMore-item-img',
        footer: 'drzLoadMore-list-footer',
        footerHidden: 'drzLoadMore-list-footerHidden',
        item: 'drzLoadMore-item',
        loadMore: 'drzLoadMore-list-more',
      },
    });
  },
});
