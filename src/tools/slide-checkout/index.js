import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('slide-checkout-tool', {
  template,
  name: 'slide-checkout-tool',
  mounted() {
    const $slideCheckoutBox = $(this.$refs.slideCheckoutBox);
    $slideCheckoutBox.drzSlideCheckout({
      siteId: 'picazzo-test-site',
      taxPercent: 8.25,
      currency: {
        type: 'USD',
        symbol: '&#36;',
      },
    });
  },
});
