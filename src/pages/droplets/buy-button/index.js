import Vue from 'vue';
import BuyButton from '@/droplets/buy-button';
import BuyButtonTpl from '@/droplets/buy-button/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('buy-button-page', {
  template,
  name: 'buy-button-page',
  mixins: [cleanDropletTpl],
  components: {
    BuyButton,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(BuyButtonTpl),
    };
  },
  methods: {
    groupHtml() {
      return `<div class="row">
${this.dropletHtml}${this.dropletHtml}</div>`;
    },
  },
});
