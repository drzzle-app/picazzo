import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('multi-step-tool', {
  template,
  name: 'multi-step-tool',
  mounted() {
    const $multiStep = $(this.$refs.multiStep);
    $multiStep.drzMultiStep();
  },
});
