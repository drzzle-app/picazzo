import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('tool-tips-tool', {
  template,
  name: 'tool-tips-tool',
  mounted() {
    const $toolTips = $(this.$refs.toolTips);
    $toolTips.drzTooltip();
  },
});
