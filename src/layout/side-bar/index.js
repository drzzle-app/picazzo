import Vue from 'vue';
import { mapGetters } from 'vuex';
import SearchModal from './search-modal';

const template = require('./template.html');

export default Vue.component('side-bar', {
  template,
  name: 'side-bar',
  components: {
    SearchModal,
  },
  computed: {
    ...mapGetters(['pages']),
  },
  data() {
    return {
      // @TODO we should probly pull this in more dynamically.
      // in conjuction with the pages.json file
      links: [
        {
          text: 'Welcome',
          route: '/welcome',
        },
        {
          text: 'Contributing',
          route: '/contributing',
        },
      ],
    };
  },
  methods: {
    goTo(path) {
      this.$router.push({ path });
    },
  },
});
