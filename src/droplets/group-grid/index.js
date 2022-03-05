import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('group-grid-droplet', {
  template,
  name: 'group-grid-droplet',
  mounted() {
    const $groupGrid = $(this.$refs.groupGrid);
    $groupGrid.drzFilterGrid({
      output(data) {
        return `
        <div class="drzGroup-grid-card">
          <a class="drzGroup-grid-cardInner" href="#">
            <div
              class="drzGroup-grid-cardImage"
              data-asset="${data.thumbnail}">
            </div>
            <div class="drzGroup-grid-cardInfo">
              <span class="drzGroup-grid-cardTitle">${data.alias}</span>
            </div>
          </a>
        </div>
        `;
      },
      gridContainer: 'drzGroup-grid-container',
      filters: ['red', 'blue'],
      pagination: 6,
      assets: 'bg',
      searchKeys: ['alias', 'description'],
      sortKey: 'created',
      feed: [
        {
          created: '2020-06-25T19:31:14.835Z',
          description: 'One group description.',
          thumbnail: '/static/images/mock-group.svg',
          alias: 'Group One',
          pageLink: '#',
          customLink: '#',
          categories: ['red'],
        },
        {
          created: '2020-06-24T19:31:14.835Z',
          description: 'Two group description.',
          thumbnail: '/static/images/mock-group.svg',
          alias: 'Group Two',
          pageLink: '#',
          customLink: '#',
          categories: ['red', 'blue'],
        },
        {
          created: '2020-06-27T19:31:14.835Z',
          description: 'Three group description.',
          thumbnail: '/static/images/mock-group.svg',
          alias: 'Group Three',
          pageLink: '#',
          customLink: '#',
          categories: ['blue'],
        },
        {
          created: '2020-06-23T19:31:14.835Z',
          description: 'Four group description.',
          thumbnail: '/static/images/mock-group.svg',
          alias: 'Group Four',
          pageLink: '#',
          customLink: '#',
          categories: ['red', 'blue'],
        },
        {
          created: '2020-06-22T19:31:14.835Z',
          description: 'Five group description.',
          thumbnail: '/static/images/mock-group.svg',
          alias: 'Group Five',
          pageLink: '#',
          customLink: '#',
          categories: ['red'],
        },
        {
          created: '2020-06-29T19:31:14.835Z',
          description: 'Six group description.',
          thumbnail: '/static/images/mock-group.svg',
          alias: 'Group Six',
          pageLink: '#',
          customLink: '#',
          categories: ['blue'],
        },
        {
          created: '2020-06-30T19:31:14.835Z',
          description: 'Seven group description.',
          thumbnail: '/static/images/mock-group.svg',
          alias: 'Group Seven',
          pageLink: '#',
          customLink: '#',
          categories: ['blue', 'red'],
        },
        {
          created: '2020-06-20T19:31:14.835Z',
          description: 'Eight group description.',
          thumbnail: '/static/images/mock-group.svg',
          alias: 'Group Eight',
          pageLink: '#',
          customLink: '#',
          categories: ['red'],
        },
      ],
    });
  },
});
