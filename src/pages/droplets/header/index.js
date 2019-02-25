import Vue from 'vue';
import Header from '@/droplets/header';
import HeaderTpl from '@/droplets/header/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('header-page', {
  template,
  name: 'header-page',
  mixins: [cleanDropletTpl],
  components: {
    Header,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(HeaderTpl),
    };
  },
});
