import Vue from 'vue';

export default Vue.component('full-page', {
  template: '<div id="app"><router-view></router-view></div>',
  name: 'full-page',
  data() {
    return {};
  },
  created() {
    this.$store.dispatch('getPages');
    this.$log.info('pull in all json site data');
  },
  methods: {},
});
