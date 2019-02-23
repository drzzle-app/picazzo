import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('droplet-name', {
  template,
  name: 'droplet-name',
  mounted() {
    $.fn.picazzo.dropletName({
      el: $(this.$refs.dropletName),
    });
  },
});
