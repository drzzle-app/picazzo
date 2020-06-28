import Vue from 'vue';
import ProductFeed from '@/droplets/product-feed';
import ProductFeedTpl from '@/droplets/product-feed/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('product-feed-page', {
  template,
  name: 'product-feed-page',
  mixins: [cleanDropletTpl],
  components: {
    ProductFeed,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProductFeedTpl),
    };
  },
  methods: {
    groupHtml() {
      return `<div class="row">
${this.dropletHtml}${this.dropletHtml}</div>`;
    },
    destroyMarkup() {
      return `const $productFeed = $('.drzProduct-feed');
$productFeed.drzProductFeed.destroy();`;
    },
  },
});
