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
    ...mapGetters(['sidebarLinks']),
  },
  created() {
    this.$store.dispatch('getSideBarLinks').then((links) => {
      this.links = links;
    });
    this.$log.info('fetch sidebar links');
  },
  data() {
    return {
      links: [],
    };
  },
  methods: {
    goTo(path) {
      this.$router.push({ path });
    },
  },
});
