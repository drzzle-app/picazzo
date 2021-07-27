import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('media-item-grid-droplet', {
  template,
  name: 'media-item-grid-droplet',
  mounted() {
    const $mediaItemGrid = $(this.$refs.mediaItemGrid);
    $mediaItemGrid.drzFilterGrid({
      output(data) {
        return `
        <div class="drzMediaItem-grid-card">
          <a class="drzMediaItem-grid-cardInner" href="#">
            <div class="drzMediaItem-grid-cardImage">
              <img class="drzMediaItem-grid-cardImg" data-asset="${data.thumbnail}" />
            </div>
            <div class="drzMediaItem-grid-cardInfo">
              <span class="drzMediaItem-grid-cardTitle">${data.title}</span>
            </div>
          </a>
        </div>
        `;
      },
      gridContainer: 'drzMediaItem-grid-container',
      filterText: 'Filters',
      filters: ['red', 'blue'],
      sort: 'newest',
      match: 'some',
      pagination: 6,
      searchKeys: ['title'],
      feed: [
        {
          publishedOn: '2021-06-19T19:31:14.835Z',
          thumbnail: '/static/images/mock-media.svg',
          title: 'Item One',
          categories: ['red', 'blue'],
        },
        {
          publishedOn: '2021-06-20T19:31:14.835Z',
          thumbnail: '/static/images/mock-media.svg',
          title: 'Item Two',
          categories: ['red'],
        },
        {
          publishedOn: '2021-06-21T19:31:14.835Z',
          thumbnail: '/static/images/mock-media.svg',
          title: 'Item Three',
          categories: ['red'],
        },
        {
          publishedOn: '2021-06-22T19:31:14.835Z',
          thumbnail: '/static/images/mock-media.svg',
          title: 'Item Four',
          categories: ['red'],
        },
        {
          publishedOn: '2021-06-23T19:31:14.835Z',
          thumbnail: '/static/images/mock-media.svg',
          title: 'Item Five',
          categories: ['red', 'blue'],
        },
        {
          publishedOn: '2021-06-24T19:31:14.835Z',
          thumbnail: '/static/images/mock-media.svg',
          title: 'Item Six',
          categories: ['red'],
        },
        {
          publishedOn: '2021-06-25T19:31:14.835Z',
          thumbnail: '/static/images/mock-media.svg',
          title: 'Item Seven',
          categories: ['red'],
        },
        {
          publishedOn: '2021-06-26T19:31:14.835Z',
          thumbnail: '/static/images/mock-media.svg',
          title: 'Item Eight',
          categories: ['red'],
        },
      ],
    });
  },
});
