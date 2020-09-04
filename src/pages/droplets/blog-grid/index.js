import Vue from 'vue';
import BlogGrid from '@/droplets/blog-grid';
import BlogGridTpl from '@/droplets/blog-grid/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('blog-grid-page', {
  template,
  name: 'blog-grid-page',
  mixins: [cleanDropletTpl],
  components: {
    BlogGrid,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(BlogGridTpl),
    };
  },
});
