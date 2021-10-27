import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('slide-checkout-tool', {
  template,
  name: 'slide-checkout-tool',
  mounted() {
    const $slideCheckoutBox = $(this.$refs.slideCheckoutBox);
    $slideCheckoutBox.drzSlideCheckout({
      siteId: 'a60a1516-f6c3-3c88-586e-9a5d64fe8e94',
      taxPercent: 8.25,
      api: 'https://staging-api.drzzle.app',
      currency: {
        type: 'USD',
        symbol: '&#36;',
      },
    });
  },
});
