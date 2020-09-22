import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('product-grid-droplet', {
  template,
  name: 'product-grid-droplet',
  mounted() {
    const $productGrid = $(this.$refs.productGrid);
    $productGrid.drzFilterGrid({
      output(data) {
        return `
        <a class="drzProduct-grid-card" href="${data.pageLink}">
          <div class="drzProduct-grid-cardImageWrap">
            <img class="drzProduct-grid-cardImage" data-asset="${data.itemImage}" alt="${data.itemName}" />
          </div>
          <div class="drzProduct-grid-cardInfo">
            <span class="drzProduct-grid-name">${data.itemName}</span>
            <span class="drzProduct-grid-price">
            $12
            <button data-product="${data._id}" class="drzProduct-grid-buyBtn"></button>
            </span>
          </div>
        </a>
        `;
      },
      onRender($card) {
        const $btn = $card.find('.drzProduct-grid-buyBtn');
        $btn.click((e) => {
          e.preventDefault();
        });
      },
      filters: ['mens', 'womens'],
      pagination: 4,
      searchKeys: ['itemName', 'itemDescription'],
      feed: [
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
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
          categories: ['mens'],
        },
        {
          publishedOn: '2020-06-23T19:31:14.835Z',
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
          categories: ['womens'],
        },
        {
          publishedOn: '2020-06-22T19:31:14.835Z',
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
          categories: ['womens'],
          options: [],
        },
        {
          publishedOn: '2020-06-24T19:31:14.835Z',
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
          categories: ['mens'],
        },
        {
          publishedOn: '2020-06-21T19:31:14.835Z',
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
          categories: ['mens'],
        },
        {
          publishedOn: '2020-06-20T19:31:14.835Z',
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
          categories: ['mens'],
        },
        {
          publishedOn: '2020-06-19T19:31:14.835Z',
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
          categories: ['mens'],
        },
        {
          publishedOn: '2020-06-18T19:31:14.835Z',
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
          categories: ['mens'],
        },
      ],
    });
  },
});
