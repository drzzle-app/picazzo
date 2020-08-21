import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('blog-list-droplet', {
  template,
  name: 'blog-list-droplet',
  mounted() {
    const $blogList = $(this.$refs.blogList);
    $blogList.drzBlogList({
      visible: 2,
    });
  },
});
