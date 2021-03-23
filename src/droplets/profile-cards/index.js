import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('profile-cards-droplet', {
  template,
  name: 'profile-cards-droplet',
  mounted() {
    const $blogGrid = $(this.$refs.profileCards);
    $blogGrid.drzFilterGrid({
      output(data) {
        return `
        <div class="drzProfile-cards-card">
          <a class="drzProfile-cards-cardInner" href="#">
            <div
              class="drzProfile-cards-cardImage"
              data-asset="${data.image}">
            </div>
            <div class="drzProfile-cards-cardInfo">
              <span class="drzProfile-cards-cardTitle">${data.name}</span>
            </div>
          </a>
        </div>
        `;
      },
      gridContainer: 'drzProfile-cards-container',
      filterText: 'Filters',
      pagination: 6,
      sort: 'alphabetical',
      assets: 'bg',
      sortKey: 'name',
      match: 'some',
      filters: ['man', 'woman'],
      map: {
        title: 'name',
        pin: 'mapPin',
      },
      searchKeys: ['name', 'description', 'address.value', 'phone', 'email', 'website'],
      feed: [
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Stanley Hudson',
          address: {
            value: 'Midland TX',
            lat: 31.997431,
            lng: -102.078041,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['man'],
        },
        {
          publishedOn: '2020-07-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Kevin Malone',
          address: {
            value: 'Lubbock TX',
            lat: 33.5842591,
            lng: -101.8782822,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['man'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Angela Martin',
          phone: '1-555-555-5555',
          email: 'angela.martin@dundermifflin.com',
          website: 'www.angelamartin.com',
          address: {
            value: '3980 Boat Club Rd, Fort Worth, TX 76135',
            lat: 32.7910997,
            lng: -97.3455793,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['woman'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Kelly Kapoor',
          address: {
            value: 'Southlake TX',
            lat: 32.949763,
            lng: -97.126684,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['woman'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Dwight Schrute',
          address: {
            value: 'Houston TX',
            lat: 29.7302684,
            lng: -95.4347069,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['man'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Darryl Philbin',
          address: {
            value: 'San Antonio Tx',
            lat: 29.4239324,
            lng: -98.4843125,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['man'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Pam Beesly',
          address: {
            value: 'Austin Tx',
            lat: 30.2701188,
            lng: -97.7313156,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['woman'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-profile.svg',
          name: 'Erin Hannon',
          address: {
            value: 'Corpus Christi Tx',
            lat: 27.7100371,
            lng: -97.37167009999999,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['woman'],
        },
      ],
    });
  },
});
