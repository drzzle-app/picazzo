import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('menu-grid-droplet', {
  template,
  name: 'menu-grid-droplet',
  mounted() {
    const $menuGrid = $(this.$refs.menuGrid);
    $menuGrid.drzFilterGrid({
      output(data) {
        return `
        <div class="drzMenu-grid-card">
          <a class="drzMenu-grid-inner" href="${data.pageLink}">
            <div class="drzMenu-grid-cardImageWrap">
              <img class="drzMenu-grid-cardImage" data-asset="${data.image}" alt="${data.name}" />
            </div>
            <div class="drzMenu-grid-cardInfo">
              <div class="drzMenu-grid-infoColLeft">
                <span class="drzMenu-grid-name">${data.name}</span>
                <span class="drzMenu-grid-calories">${data.calories} calories</span>
              </div>
              <div class="drzMenu-grid-infoColRight">
                ${data.categories.join(', ')}
              </div>
            </div>
          </a>
        </div>
        `;
      },
      filters: ['breakfast', 'lunch'],
      pagination: 4,
      searchKeys: ['name', 'description'],
      feed: [
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Food description here.',
          image: '/static/images/mock-plate.svg',
          name: 'Pancakes',
          pageLink: '#',
          customLink: '#',
          categories: ['breakfast', 'lunch'],
          calories: 1200,
        },
        {
          publishedOn: '2020-06-23T19:31:14.835Z',
          description: 'Food description here.',
          image: '/static/images/mock-plate.svg',
          name: 'Sandwich',
          pageLink: '#',
          customLink: '#',
          categories: ['lunch'],
          calories: 1200,
        },
        {
          publishedOn: '2020-06-22T19:31:14.835Z',
          description: 'Food description here.',
          image: '/static/images/mock-plate.svg',
          name: 'Burger',
          pageLink: '#',
          customLink: '#',
          categories: ['lunch'],
          options: [],
          calories: 1200,
        },
        {
          publishedOn: '2020-06-24T19:31:14.835Z',
          description: 'Food description here.',
          image: '/static/images/mock-plate.svg',
          name: 'Bacon',
          pageLink: '#',
          customLink: '#',
          categories: ['breakfast'],
          calories: 1200,
        },
        {
          publishedOn: '2020-06-21T19:31:14.835Z',
          description: 'Food description here.',
          image: '/static/images/mock-plate.svg',
          name: 'Hashbrowns',
          pageLink: '#',
          customLink: '#',
          categories: ['breakfast'],
          calories: 1200,
        },
        {
          publishedOn: '2020-06-20T19:31:14.835Z',
          description: 'Food description here.',
          image: '/static/images/mock-plate.svg',
          name: 'Eggs',
          pageLink: '#',
          customLink: '#',
          categories: ['breakfast'],
          calories: 1200,
        },
        {
          publishedOn: '2020-06-19T19:31:14.835Z',
          description: 'Food description here.',
          image: '/static/images/mock-plate.svg',
          name: 'Omlet',
          pageLink: '#',
          customLink: '#',
          categories: ['breakfast'],
          calories: 1200,
        },
        {
          publishedOn: '2020-06-18T19:31:14.835Z',
          description: 'Food description here.',
          image: '/static/images/mock-plate.svg',
          name: 'French Toast',
          pageLink: '#',
          customLink: '#',
          categories: ['breakfast'],
          calories: 1200,
        },
      ],
    });
  },
});
