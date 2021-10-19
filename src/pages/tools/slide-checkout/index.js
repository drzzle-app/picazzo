import Vue from 'vue';
import SlideCheckout from '@/tools/slide-checkout';
import SlideCheckoutTpl from '@/tools/slide-checkout/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('slide-checkout-page', {
  template,
  name: 'slide-checkout-page',
  mixins: [cleanDropletTpl],
  components: {
    SlideCheckout,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(SlideCheckoutTpl),
    };
  },
});
