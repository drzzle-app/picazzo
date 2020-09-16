import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('blog-list-droplet', {
  template,
  name: 'blog-list-droplet',
  mounted() {
    const $blogList = $(this.$refs.blogList);
    $blogList.drzLoadMore({
      visible: 2,
      assets: 'src',
      classes: {
        show: 'drzBlog-item-show',
        img: 'drzBlog-item-img',
        footer: 'drzBlog-list-footer',
        footerHidden: 'drzBlog-list-footerHidden',
        item: 'drzBlog-item',
        loadMore: 'drzBlog-list-more',
      },
    });
  },
});
