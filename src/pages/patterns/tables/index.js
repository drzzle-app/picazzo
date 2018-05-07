import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('tables', {
  template,
  name: 'tables',
  data() {
    return {
      currentTheme: 'ecomm',
    };
  },
  computed: {
    theme() {
      return `/static/css/themes/${this.currentTheme}/main.min.css`;
    },
  },
});
