import Vue from 'vue';
import { mapGetters } from 'vuex';

const template = require('./template.html');

export default Vue.component('app-view', {
  template,
  name: 'full-page',
  computed: {
    ...mapGetters(['currentTheme']),
    theme() {
      return `/static/css/themes/${this.currentTheme}/main.min.css`;
    },
  },
  data() {
    return {};
  },
  created() {
    this.$store.dispatch('getPages');
    this.$log.info('fetch all pages for searching');
  },
  methods: {},
});
