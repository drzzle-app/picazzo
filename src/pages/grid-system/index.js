import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('grid-system', {
  template,
  name: 'grid-system',
  methods: {
    pageTpl() {
      return `<body>
  <div class="row">
    content block droplet (nav)
  </div>
  <div class="section">
    <div class="container">
      <div class="row">
        droplet 1
      </div>
      <div class="row">
        droplet 2
      </div>
    </div>
  </div>
  <div class="section">
    <div class="container">
      <div class="row">
        droplet 3
      </div>
      <div class="row">
        droplet 4
      </div>
    </div>
  </div>
</body>`;
    },
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
