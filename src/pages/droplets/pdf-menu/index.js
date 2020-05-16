import Vue from 'vue';
import PdfMenu from '@/droplets/pdf-menu';
import PdfMenuTpl from '@/droplets/pdf-menu/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('pdf-menu-page', {
  template,
  name: 'pdf-menu-page',
  mixins: [cleanDropletTpl],
  components: {
    PdfMenu,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(PdfMenuTpl),
    };
  },
});
