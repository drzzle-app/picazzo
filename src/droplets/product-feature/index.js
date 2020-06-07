import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('product-feature-droplet', {
  template,
  name: 'product-feature-droplet',
  mounted() {
    const $productFeature = $(this.$refs.productFeature);
    $productFeature.drzProductFeature();
  },
});
