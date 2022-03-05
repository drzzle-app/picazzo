import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('group-list-droplet', {
  template,
  name: 'group-list-droplet',
  mounted() {
    const $groupList = $(this.$refs.groupList);
    $groupList.drzLoadMore({
      visible: 2,
      assets: 'src',
      classes: {
        show: 'drzGroupList-item-show',
        img: 'drzGroupList-item-img',
        footer: 'drzGroupList-footer',
        footerHidden: 'drzGroupList-footerHidden',
        item: 'drzGroupList-item',
        loadMore: 'drzGroupList-more',
      },
    });
  },
});
