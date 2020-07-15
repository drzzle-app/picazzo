import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('product-feed-droplet', {
  template,
  name: 'product-feed-droplet',
  mounted() {
    const $productFeed = $(this.$refs.productFeed);
    $productFeed.drzProductFeed({
      feed: [
        {
          created: '2020-06-25T19:31:14.835Z',
          prices: {
            usd: '1',
            eur: '0.89',
            cad: '1.35',
          },
          itemDescription: 'Product description here.',
          itemImage: '/static/images/product-feature/t-shirt-mock-green.svg',
          itemName: 'Green Shirt',
          pageLink: '#',
          customLink: '#',
          categories: ['shirt'],
        },
        {
          created: '2020-06-23T19:31:14.835Z',
          prices: {
            usd: '1',
            eur: '0.89',
            cad: '1.35',
          },
          itemDescription: 'Product description here.',
          itemImage: '/static/images/product-feature/t-shirt-mock-darkgray.svg',
          itemName: 'Green Shirt',
          pageLink: '#',
          customLink: '#',
          categories: ['shoes', 'shirt'],
        },
        {
          created: '2020-06-22T19:31:14.835Z',
          prices: {
            usd: '1',
            eur: '0.89',
            cad: '1.35',
          },
          itemDescription: 'Product description here.',
          itemImage: '/static/images/product-feature/t-shirt-mock-blue.svg',
          itemName: 'Green Shirt',
          pageLink: '#',
          customLink: '#',
          categories: ['shoes', 'shirt'],
          options: [],
        },
        {
          created: '2020-06-24T19:31:14.835Z',
          prices: {
            usd: '1',
            eur: '0.89',
            cad: '1.35',
          },
          itemDescription: 'Product description here.',
          itemImage: '/static/images/product-feature/t-shirt-mock-red.svg',
          itemName: 'Green Shirt',
          pageLink: '#',
          customLink: '#',
          categories: ['shirt'],
        },
      ],
    });
  },
});
