import Vue from 'vue';
import BlogList from '@/droplets/blog-list';
import BlogListTpl from '@/droplets/blog-list/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('blog-list-page', {
  template,
  name: 'blog-list-page',
  mixins: [cleanDropletTpl],
  components: {
    BlogList,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(BlogListTpl),
    };
  },
  methods: {
    destroyMarkup() {
      return `const $blogList = $('.drzBlog-list');
$blogList.drzLoadMore.destroy();`;
    },
  },
});
