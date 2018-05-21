import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('pattern-controls', {
  template,
  name: 'pattern-controls',
  props: {
    pattern: {
      type: Object,
      required: false,
      default() {
        return {
          name: 'component',
        };
      },
    },
  },
});
