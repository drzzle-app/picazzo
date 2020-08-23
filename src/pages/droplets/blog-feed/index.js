import Vue from 'vue';
import BlogFeed from '@/droplets/blog-feed';
import BlogFeedTpl from '@/droplets/blog-feed/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('blog-feed-page', {
  template,
  name: 'blog-feed-page',
  mixins: [cleanDropletTpl],
  components: {
    BlogFeed,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(BlogFeedTpl),
    };
  },
});
