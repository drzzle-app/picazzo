import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('filter-grid-tool', {
  template,
  name: 'filter-grid-tool',
  mounted() {
    const $filterGrid = $(this.$refs.filterGrid);
    $filterGrid.drzFilterGrid({
      output(data) {
        return `
          <div style="border:1px solid #ccc;padding:0 20px 20px;">
          <h4>${data.name}</h4>
          <p>${data.description}</p>
          </div>
        `;
      },
      searchKeys: ['name', 'description'],
      filters: ['movie', 'music'],
      pagination: 4,
      feed: [
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'First Item description here.',
          name: 'First Item',
          categories: ['movie'],
        },
        {
          publishedOn: '2020-06-24T19:31:14.835Z',
          description: 'Second Item description here.',
          name: 'Second Item',
          categories: ['movie'],
        },
        {
          publishedOn: '2020-06-23T19:31:14.835Z',
          description: 'Third Item description here.',
          name: 'Third Item',
          categories: ['movie'],
        },
        {
          publishedOn: '2020-06-22T19:31:14.835Z',
          description: 'Fourth Item description here.',
          name: 'Fourth Item',
          categories: ['movie', 'music'],
        },
        {
          publishedOn: '2020-06-21T19:31:14.835Z',
          description: 'Fifth Item description here.',
          name: 'Fifth Item',
          categories: ['movie'],
        },
        {
          publishedOn: '2020-06-20T19:31:14.835Z',
          description: 'Sixth Item description here.',
          name: 'Sixth Item',
          categories: ['movie'],
        },
        {
          publishedOn: '2020-06-19T19:31:14.835Z',
          description: 'Seventh Item description here.',
          name: 'Seventh Item',
          categories: ['movie'],
        },
        {
          publishedOn: '2020-06-18T19:31:14.835Z',
          description: 'Eighth Item description here.',
          name: 'Eighth Item',
          categories: ['movie', 'music'],
        },
      ],
    });
  },
});
