import Vue from 'vue';
import ProductGrid from '@/droplets/product-grid';
import ProductGridTpl from '@/droplets/product-grid/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('product-grid-page', {
  template,
  name: 'product-grid-page',
  mixins: [cleanDropletTpl],
  components: {
    ProductGrid,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProductGridTpl),
    };
  },
  methods: {
    groupHtml() {
      return `<div class="row">
${this.dropletHtml}${this.dropletHtml}</div>`;
    },
  },
});
