import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('profile-grid-droplet', {
  template,
  name: 'profile-grid-droplet',
  mounted() {
    const $profileGrid = $(this.$refs.profileGrid);
    const truncate = this.truncate;
    $profileGrid.drzFilterGrid({
      output(data) {
        let contact = '';
        if (data.phone || data.email || data.address || data.website) {
          const phone = data.phone ? `<span class="drzProfile-item-contactSpan">${data.phone}</span>` : '';
          const email = data.email ? `<span class="drzProfile-item-contactSpan">${data.email}</span>` : '';
          const website = data.website ? `<span class="drzProfile-item-contactSpan">${data.website}</span>` : '';
          const address = data.address && data.address.value ? `<span class="drzProfile-item-contactSpan">${data.address.value}</span>` : '';
          contact = `
          <div class="drzProfile-item-contact">
            ${email}${phone}${address}${website}
          </div>`;
        }
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
              ${contact}
              <p class="drzProfile-item-preview">
                ${truncate(data.description || '', 500)}
              </p>
            </div>
          </a>
        </li>
        `;
      },
      gridContainer: 'drzProfile-items-container',
      filterText: 'Filters',
      sort: 'alphabetical',
      sortKey: 'name',
      match: 'some',
      filters: ['man', 'woman'],
      pagination: 3,
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
          mapPin: 'https://cdn.drzzle.app/mock-images/icons/maps-default-pin.svg',
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
          mapPin: 'https://cdn.drzzle.app/mock-images/icons/maps-default-pin.svg',
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
          mapPin: 'https://cdn.drzzle.app/mock-images/icons/maps-default-pin.svg',
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
          mapPin: 'https://cdn.drzzle.app/mock-images/icons/maps-default-pin.svg',
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
          mapPin: 'https://cdn.drzzle.app/mock-images/icons/maps-default-pin.svg',
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
          mapPin: 'https://cdn.drzzle.app/mock-images/icons/maps-default-pin.svg',
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
          mapPin: 'https://cdn.drzzle.app/mock-images/icons/maps-default-pin.svg',
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
          mapPin: 'https://cdn.drzzle.app/mock-images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['woman'],
        },
      ],
    });
  },
  methods: {
    truncate(text, limit) {
      if (text.length < limit) {
        return text;
      }
      return `${text.substring(0, limit)}...`;
    },
  },
});
