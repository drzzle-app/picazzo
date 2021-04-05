import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('place-grid-droplet', {
  template,
  name: 'place-grid-droplet',
  mounted() {
    const $placeGrid = $(this.$refs.placeGrid);
    const truncate = this.truncate;
    $placeGrid.drzFilterGrid({
      output(data) {
        let contact = '';
        if (data.phone || data.email || data.address || data.website) {
          const phone = data.phone ? `<span class="drzPlace-item-contactSpan">${data.phone}</span>` : '';
          const email = data.email ? `<span class="drzPlace-item-contactSpan">${data.email}</span>` : '';
          const website = data.website ? `<span class="drzPlace-item-contactSpan">${data.website}</span>` : '';
          const address = data.address && data.address.value ? `<span class="drzPlace-item-contactSpan">${data.address.value}</span>` : '';
          contact = `
          <div class="drzPlace-item-contact">
            ${email}${phone}${address}${website}
          </div>`;
        }
        return `
        <li class="drzPlace-item-card">
          <a href="${data.pageLink}" class="drzPlace-item-link">
            <div class="drzPlace-item-imgWrap">
              <img class="drzPlace-item-img" data-asset="${data.image}" alt="${data.name}" />
            </div>
            <div class="drzPlace-item-data">
              <div class="drzPlace-item-top">
                <h4 class="drzPlace-item-header">${data.name}</h4>
              </div>
              <hr class="drzPlace-item-break" />
              ${contact}
              <p class="drzPlace-item-preview">
                ${truncate(data.description || '', 500)}
              </p>
            </div>
          </a>
        </li>
        `;
      },
      gridContainer: 'drzPlace-items-container',
      filterText: 'Filters',
      sort: 'alphabetical',
      sortKey: 'name',
      match: 'some',
      filters: ['house', 'land'],
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
          image: '/static/images/mock-place.svg',
          name: 'House 1',
          address: {
            value: 'Midland TX',
            lat: 31.997431,
            lng: -102.078041,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['house'],
        },
        {
          publishedOn: '2020-07-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-place.svg',
          name: 'House 2',
          address: {
            value: 'Lubbock TX',
            lat: 33.5842591,
            lng: -101.8782822,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['house'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-place.svg',
          name: 'Lot 1',
          phone: '1-555-555-5555',
          email: 'land@email.com',
          website: 'www.land.com',
          address: {
            value: '3980 Boat Club Rd, Fort Worth, TX 76135',
            lat: 32.7910997,
            lng: -97.3455793,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['land'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-place.svg',
          name: 'Lot 2',
          address: {
            value: 'Southlake TX',
            lat: 32.949763,
            lng: -97.126684,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['land'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-place.svg',
          name: 'House 3',
          address: {
            value: 'Houston TX',
            lat: 29.7302684,
            lng: -95.4347069,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['house'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-place.svg',
          name: 'House 4',
          address: {
            value: 'San Antonio Tx',
            lat: 29.4239324,
            lng: -98.4843125,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['house'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-place.svg',
          name: 'Lot 3',
          address: {
            value: 'Austin Tx',
            lat: 30.2701188,
            lng: -97.7313156,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['land'],
        },
        {
          publishedOn: '2020-06-25T19:31:14.835Z',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          image: '/static/images/mock-place.svg',
          name: 'Lot 4',
          address: {
            value: 'Corpus Christi Tx',
            lat: 27.7100371,
            lng: -97.37167009999999,
          },
          mapPin: '/static/images/icons/maps-default-pin.svg',
          pageLink: '#',
          customLink: '#',
          categories: ['land'],
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
