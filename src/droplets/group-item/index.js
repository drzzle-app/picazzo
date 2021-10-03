import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('group-item-droplet', {
  template,
  name: 'group-item-droplet',
  mounted() {
    const $groupItemGrid = $(this.$refs.groupItemGrid);
    $groupItemGrid.drzFilterGrid({
      output(data) {
        return `
        <div class="drzGroupItem-grid-card">
          <a class="drzGroupItem-grid-cardInner" href="#">
            <div class="drzGroupItem-grid-cardImage">
              <img class="drzGroupItem-grid-cardImg" data-asset="${data.thumbnail}" />
            </div>
            <div class="drzGroupItem-grid-cardInfo">
              <span class="drzGroupItem-grid-cardTitle">${data.title}</span>
            </div>
          </a>
        </div>
        `;
      },
      gridContainer: 'drzGroupItem-grid-container',
      filterText: 'Filters',
      filters: ['red', 'blue'],
      sort: 'newest',
      match: 'some',
      pagination: 6,
      searchKeys: ['title'],
      feed: [
        {
          publishedOn: '2021-06-19T19:31:14.835Z',
          thumbnail: '/static/images/mock-group-item.svg',
          title: 'Group Item One',
          categories: ['red', 'blue'],
        },
        {
          publishedOn: '2021-06-20T19:31:14.835Z',
          thumbnail: '/static/images/mock-group-item.svg',
          title: 'Group Item Two',
          categories: ['red'],
        },
        {
          publishedOn: '2021-06-21T19:31:14.835Z',
          thumbnail: '/static/images/mock-group-item.svg',
          title: 'Group Item Three',
          categories: ['red'],
        },
        {
          publishedOn: '2021-06-22T19:31:14.835Z',
          thumbnail: '/static/images/mock-group-item.svg',
          title: 'Group Item Four',
          categories: ['red'],
        },
        {
          publishedOn: '2021-06-23T19:31:14.835Z',
          thumbnail: '/static/images/mock-group-item.svg',
          title: 'Group Item Five',
          categories: ['red', 'blue'],
        },
        {
          publishedOn: '2021-06-24T19:31:14.835Z',
          thumbnail: '/static/images/mock-group-item.svg',
          title: 'Group Item Six',
          categories: ['red'],
        },
        {
          publishedOn: '2021-06-25T19:31:14.835Z',
          thumbnail: '/static/images/mock-group-item.svg',
          title: 'Group Item Seven',
          categories: ['red'],
        },
        {
          publishedOn: '2021-06-26T19:31:14.835Z',
          thumbnail: '/static/images/mock-group-item.svg',
          title: 'Group Item Eight',
          categories: ['red'],
        },
      ],
    });
  },
});
