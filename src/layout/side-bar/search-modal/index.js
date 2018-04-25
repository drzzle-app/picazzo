import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('search-modal', {
  template,
  name: 'search-modal',
  watch: {
    searchFlux(s) {
      if (s.trim() !== '') {
        this.showResults = true;
      } else {
        this.showResults = false;
      }
    },
  },
  data() {
    return {
      searchFlux: '',
      showResults: false,
    };
  },
});
