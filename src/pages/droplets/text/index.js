import Vue from 'vue';
import GeneralText from '@/droplets/text';
import TextTpl from '@/droplets/text/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('text-page', {
  template,
  name: 'text-page',
  mixins: [cleanDropletTpl],
  components: {
    GeneralText,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(TextTpl),
    };
  },
});
