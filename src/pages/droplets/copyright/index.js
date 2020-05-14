import Vue from 'vue';
import Copyright from '@/droplets/copyright';
import CopyrightTpl from '@/droplets/copyright/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('copyright-page', {
  template,
  name: 'copyright-page',
  mixins: [cleanDropletTpl],
  components: {
    Copyright,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(CopyrightTpl),
    };
  },
});
