import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('app-view', {
  template,
  name: 'full-page',
  data() {
    return {};
  },
  created() {
    this.$store.dispatch('getPages');
    this.$log.info('fetch all pages for searching');
  },
  methods: {},
});
