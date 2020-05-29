import Vue from 'vue';
import ProductCard from '@/droplets/product-card';
import ProductCardTpl from '@/droplets/product-card/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('product-card-page', {
  template,
  name: 'product-card-page',
  mixins: [cleanDropletTpl],
  components: {
    ProductCard,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ProductCardTpl),
    };
  },
  methods: {
    groupHtml() {
      return `<div class="row">
${this.dropletHtml}${this.dropletHtml}</div>`;
    },
  },
});
