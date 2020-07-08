import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('product-grid-droplet', {
  template,
  name: 'product-grid-droplet',
  mounted() {
    const $productGrid = $(this.$refs.productGrid);
    $productGrid.drzFilterGrid({
      output(data) {
        // TODO need to pass this in also? this should be with the config
        const $currency = { type: 'usd', symbol: '&#36;' };
        // if ($curData) {
        //   $currency = JSON.parse($curData);
        // }
        // TODO maybe this should be optional and this can be a "filterGrid" plugin
        // we'd just need to set click events in here
        return `
        <a class="drzProduct-grid-card" href="${data.pageLink}">
          <div class="drzProduct-grid-cardImageWrap">
            <img class="drzProduct-grid-cardImage" data-asset="${data.itemImage}" src="unset" alt="${data.itemName}" />
          </div>
          <div class="drzProduct-grid-cardInfo">
            <span class="drzProduct-grid-name">${data.itemName}</span>
            <span class="drzProduct-grid-price">
            ${$currency.symbol}${data.prices[$currency.type]}
            <button data-product="${data._id}" class="drzProduct-grid-buyBtn"></button>
            </span>
          </div>
        </a>
        `;
      },
      onRender($card) {
        // console.log('$card: ', $card);
      },
      searchKeys: ['itemName', 'itemDescription'],
      feed: [
        {
          created: '2020-06-25T19:31:14.835Z',
          prices: {
            usd: '1',
            eur: '0.89',
            cad: '1.35',
          },
          itemDescription: 'Barf Product description here.',
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
          itemName: 'Dark Gray Shirt',
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
          itemName: 'Blue Shirt',
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
          itemName: 'Red Shirt',
          pageLink: '#',
          customLink: '#',
          categories: ['shirt'],
        },
        {
          created: '2020-06-21T19:31:14.835Z',
          prices: {
            usd: '1',
            eur: '0.89',
            cad: '1.35',
          },
          itemDescription: 'Product description here.',
          itemImage: '/static/images/product-feature/t-shirt-mock-pink.svg',
          itemName: 'Pink Shirt',
          pageLink: '#',
          customLink: '#',
          categories: ['shirt'],
        },
        {
          created: '2020-06-20T19:31:14.835Z',
          prices: {
            usd: '1',
            eur: '0.89',
            cad: '1.35',
          },
          itemDescription: 'Product description here.',
          itemImage: '/static/images/product-feature/t-shirt-mock-purple.svg',
          itemName: 'Purple Shirt',
          pageLink: '#',
          customLink: '#',
          categories: ['shirt'],
        },
        {
          created: '2020-06-19T19:31:14.835Z',
          prices: {
            usd: '1',
            eur: '0.89',
            cad: '1.35',
          },
          itemDescription: 'Product description here.',
          itemImage: '/static/images/product-feature/t-shirt-mock-teal.svg',
          itemName: 'Teal Shirt',
          pageLink: '#',
          customLink: '#',
          categories: ['shirt'],
        },
        {
          created: '2020-06-18T19:31:14.835Z',
          prices: {
            usd: '1',
            eur: '0.89',
            cad: '1.35',
          },
          itemDescription: 'Product description here.',
          itemImage: '/static/images/product-feature/t-shirt-mock-darkgreen.svg',
          itemName: 'Dark Green Shirt',
          pageLink: '#',
          customLink: '#',
          categories: ['shirt'],
        },
      ],
    });
  },
});
