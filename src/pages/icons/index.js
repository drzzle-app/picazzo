import Vue from 'vue';
import icons from '@/icons/config.json';

const template = require('./template.html');

export default Vue.component('icons', {
  template,
  name: 'icons',
  computed: {
    icons() {
      return this.$_.filter(icons.glyphs, i => i.selected !== false);
    },
  },
});
