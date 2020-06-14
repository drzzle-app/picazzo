import Vue from 'vue';
import ProductFeature from '@/droplets/product-feature';
import ProductFeatureTpl from '@/droplets/product-feature/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('product-feature-page', {
  template,
  name: 'product-feature-page',
  mixins: [cleanDropletTpl],
  components: {
    ProductFeature,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProductFeatureTpl),
    };
  },
  methods: {
    groupHtml() {
      return `<div class="row">
${this.dropletHtml}${this.dropletHtml}</div>`;
    },
    destroyMarkup() {
      return `const $productFeature = $('.drzProduct-feature');
$productFeature.drzProductFeature.destroy($productFeature);`;
    },
  },
});
