import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('blog-grid-droplet', {
  template,
  name: 'blog-grid-droplet',
  mounted() {
    const $blogGrid = $(this.$refs.blogGrid);
    const formatDate = this.formatDate;
    const truncate = this.truncate;
    $blogGrid.drzFilterGrid({
      output(data) {
        return `
        <div class="drzBlog-grid-card">
          <a class="drzBlog-grid-inner" href="${data.pageLink}">
            <div class="drzBlog-grid-cardImageWrap">
              <img class="drzBlog-grid-cardImage" data-asset="${data.image}" alt="${data.title}" />
            </div>
            <div class="drzBlog-grid-cardInfo">
              <span class="drzBlog-grid-title">${data.title}</span>
              <span class="drzBlog-grid-date">${formatDate(data.created)}</span>
              <p class="drzBlog-grid-preview">${truncate(data.plainText, 150)}</p>
            </div>
          </a>
        </div>
        `;
      },
      filters: ['movie', 'music'],
      pagination: 8,
      searchKeys: ['title', 'plainText', 'author'],
      feed: [
        {
          created: '2020-08-19T19:31:14.835Z',
          image: '/static/images/mock-blog.svg',
          title: 'Blog Title',
          author: 'Seymour Butts',
          plainText: 'Some text here asdn askd alksndalk nsdlkans dkansdl naslkdn alsndlkas ndlkasn dlknasdl nalsdn laksndl aknsdlk nasldnalsndlaksn dlkans ldknas dlknasld knalskdn lasknd laksndl adl akmdsl alsdmakls mdaksmd lkmasldm alksdml kamsdlm aslkdmaslk mdlaksm dlkasmd kasda sdasd asd asd',
          pageLink: '#',
          categories: ['movie'],
        },
        {
          created: '2020-08-20T19:31:14.835Z',
          image: '/static/images/mock-blog.svg',
          title: 'Blog Title 2',
          author: 'Seymour Butts',
          plainText: 'Some text here...',
          pageLink: '#',
          categories: ['movie'],
        },
        {
          created: '2020-08-21T19:31:14.835Z',
          image: '/static/images/mock-blog.svg',
          title: 'Blog Title 3',
          author: 'Seymour Butts',
          plainText: 'Some text here...',
          pageLink: '#',
          categories: ['movie', 'music'],
        },
        {
          created: '2020-08-22T19:31:14.835Z',
          image: '/static/images/mock-blog.svg',
          title: 'Blog Title 4',
          author: 'Seymour Butts',
          plainText: 'Some text here...',
          pageLink: '#',
          categories: [],
        },
        {
          created: '2020-08-23T19:31:14.835Z',
          image: '/static/images/mock-blog.svg',
          title: 'Blog Title 5',
          author: 'Seymour Butts',
          plainText: 'Some text here...',
          pageLink: '#',
          categories: ['movie', 'music'],
        },
        {
          created: '2020-08-24T19:31:14.835Z',
          image: '/static/images/mock-blog.svg',
          title: 'Blog Title 6',
          author: 'Seymour Butts',
          plainText: 'Some text here...',
          pageLink: '#',
          categories: ['music'],
        },
        {
          created: '2020-08-25T19:31:14.835Z',
          image: '/static/images/mock-blog.svg',
          title: 'Blog Title 7',
          author: 'Seymour Butts',
          plainText: 'Some text here...',
          pageLink: '#',
          categories: [],
        },
        {
          created: '2020-08-26T19:31:14.835Z',
          image: '/static/images/mock-blog.svg',
          title: 'Blog Title 8',
          author: 'Seymour Butts',
          plainText: 'Some text here...',
          pageLink: '#',
          categories: ['movie', 'music'],
        },
      ],
    });
  },
  methods: {
    formatDate(date) {
      const string = new Date(date);
      const month = string.getMonth() + 1;
      const day = string.getDate();
      const year = (string.getFullYear()).toString().slice(-2);
      return `${month}/${day}/${year}`;
    },
    truncate(text, limit) {
      if (text.length < limit) {
        return text;
      }
      return `${text.substring(0, limit)}...`;
    },
  },
});
