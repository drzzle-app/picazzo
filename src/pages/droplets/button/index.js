import Vue from 'vue';
import Button from '@/droplets/button';
import ButtonTpl from '@/droplets/button/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('button-page', {
  template,
  name: 'button-page',
  mixins: [cleanDropletTpl],
  components: {
    Button,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(ButtonTpl),
    };
  },
});
