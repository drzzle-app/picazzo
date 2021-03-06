import Vue from 'vue';

const template = require('./template.html');

export default Vue.component('accordion-droplet', {
  template,
  name: 'accordion-droplet',
  props: ['search'],
  mounted() {
    const $accordion = $(this.$refs.accordion);
    $accordion.drzAccordion({
      search: this.search,
    });
  },
});
