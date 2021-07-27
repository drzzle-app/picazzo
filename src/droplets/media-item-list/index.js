import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('media-item-list-droplet', {
  template,
  name: 'media-item-list-droplet',
  mounted() {
    const $mediaItemList = $(this.$refs.mediaItemList);
    $mediaItemList.drzLoadMore({
      visible: 2,
      assets: 'src',
      classes: {
        show: 'drzMediaItem-item-show',
        img: 'drzMediaItem-item-img',
        footer: 'drzMediaItem-list-footer',
        footerHidden: 'drzMediaItem-list-footerHidden',
        item: 'drzMediaItem-item',
        loadMore: 'drzMediaItem-list-more',
      },
    });
  },
});
