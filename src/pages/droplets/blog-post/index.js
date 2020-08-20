import Vue from 'vue';
import BlogPost from '@/droplets/blog-post';
import BlogPostTpl from '@/droplets/blog-post/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('blog-post-page', {
  template,
  name: 'blog-post-page',
  mixins: [cleanDropletTpl],
  components: {
    BlogPost,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(BlogPostTpl),
    };
  },
});
