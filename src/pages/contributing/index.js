import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('contributing', {
  template,
  name: 'contributing',
  methods: {
    gridTemplate() {
      return `<div class="row">
  <div class="drzNewCard">

  </div>
  <div class="drzNewCard">

  </div>
  <div class="drzNewCard">

  </div>
</div>`;
    },
    pluginTpl() {
      return '<div class="myPattern" data-myOption="something">';
    },
    jqTpl() {
      return `<div class="parent">
  <div class="child"></div>
</div>`;
    },
  },
});
