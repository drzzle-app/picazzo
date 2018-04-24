import Vue from 'vue';
import { mapGetters } from 'vuex';

const template = require('./template.html');

export default Vue.component('side-bar', {
  template,
  name: 'side-bar',
  computed: {
    ...mapGetters(['pages']),
  },
  data() {
    return {
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
