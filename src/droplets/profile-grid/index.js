import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('profile-grid-droplet', {
  template,
  name: 'profile-grid-droplet',
  mounted() {
    const $profileGrid = $(this.$refs.profileGrid);
    $profileGrid.drzFilterGrid({
      output(data) {
        return `
        <li class="drzProfile-item-card">
          <a href="${data.pageLink}" class="drzProfile-item-link">
            <div class="drzProfile-item-imgWrap">
              <img class="drzProfile-item-img" data-asset="${data.image}" alt="${data.name}" />
            </div>
            <div class="drzProfile-item-data">
              <div class="drzProfile-item-top">
                <h4 class="drzProfile-item-header">${data.name}</h4>
              </div>
              <hr class="drzProfile-item-break" />
              <p class="drzProfile-item-preview">
                ${data.description}
              </p>
            </div>
          </a>
        </li>
        `;
      },
      gridContainer: 'drzProfile-items-container',
      filterText: 'Filters',
      sort: 'newest',
      match: 'some',
      filters: ['man', 'woman'],
      pagination: 3,
      searchKeys: ['name', 'description', 'address'],
      feed: [
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Stanley Hudson',
          pageLink: '#',
          customLink: '#',
          categories: ['man'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Kevin Malone',
          pageLink: '#',
          customLink: '#',
          categories: ['man'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Angela Martin',
          pageLink: '#',
          customLink: '#',
          categories: ['woman'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Kelly Kapoor',
          pageLink: '#',
          customLink: '#',
          categories: ['woman'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Dwight Schrute',
          pageLink: '#',
          customLink: '#',
          categories: ['man'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Darryl Philbin',
          pageLink: '#',
          customLink: '#',
          categories: ['man'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Pam Beesly',
          pageLink: '#',
          customLink: '#',
          categories: ['woman'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Erin Hannon',
          pageLink: '#',
          customLink: '#',
          categories: ['woman'],
        },
      ],
    });
  },
});
