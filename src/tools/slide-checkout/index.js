import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('slide-checkout-tool', {
  template,
  name: 'slide-checkout-tool',
  mounted() {
    const $slideCheckout = $(this.$refs.slideCheckout);
    const $slideCheckoutBox = $(this.$refs.slideCheckoutBox);
    $slideCheckout.drzSlideCheckout({
      box: $slideCheckoutBox,
      siteId: 'picazzo-test-site',
    });
  },
});
