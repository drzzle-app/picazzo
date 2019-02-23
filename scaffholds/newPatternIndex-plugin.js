import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('pattern-name', {
  template,
  name: 'pattern-name',
  mounted() {
    $.fn.picazzo.patternName({
      el: $(this.$refs.patternName),
    });
  },
});
