import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('grid-system', {
  template,
  name: 'grid-system',
  methods: {
    demoHtml() {
      return `<div class="row">
  <div class="column col-4">
    Some content here.
  </div>
  <div class="column col-4">
    Some content here.
  </div>
  <div class="column col-4">
    Some content here.
  </div>
</div>`;
    },
  },
});
