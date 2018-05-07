import Vue from 'vue';
import { mapGetters } from 'vuex';
import SearchBox from './search-box';
import SideBarLinks from './side-bar-links';

const template = require('./template.html');

export default Vue.component('side-bar', {
  template,
  name: 'side-bar',
  components: {
    SearchBox,
    SideBarLinks,
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
});
