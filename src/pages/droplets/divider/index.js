import Vue from 'vue';
import Divider from '@/droplets/divider';
import DividerTpl from '@/droplets/divider/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('divider-page', {
  template,
  name: 'divider-page',
  mixins: [cleanDropletTpl],
  components: {
    Divider,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(DividerTpl),
    };
  },
});
