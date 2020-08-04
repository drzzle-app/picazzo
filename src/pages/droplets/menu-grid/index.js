import Vue from 'vue';
import MenuGrid from '@/droplets/menu-grid';
import MenuGridTpl from '@/droplets/menu-grid/template.html';
import { cleanDropletTpl } from '@/mixins/cleanDropletTpl';

const template = require('./template.html');

export default Vue.component('menu-grid-page', {
  template,
  name: 'menu-grid-page',
  mixins: [cleanDropletTpl],
  components: {
    MenuGrid,
  },
  data() {
    return {
      dropletHtml: this.cleanDropletTpl(MenuGridTpl),
    };
  },
  methods: {
    groupHtml() {
      return `<div class="row">
${this.dropletHtml}${this.dropletHtml}</div>`;
    },
  },
});
